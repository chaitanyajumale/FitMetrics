import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Workout from '@/models/Workout';
import Nutrition from '@/models/Nutrition';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Parallel queries for better performance
    const [userProfile, workoutStats, nutritionStats, recentWorkouts, recentNutrition] = await Promise.all([
      User.findById(user.userId).lean().select('-password'),
      
      // Aggregated workout statistics
      Workout.aggregate([
        {
          $match: {
            userId: user.userId,
            date: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: null,
            totalWorkouts: { $sum: 1 },
            totalDuration: { $sum: '$duration' },
            totalCaloriesBurned: { $sum: '$totalCalories' },
            avgDuration: { $avg: '$duration' },
            avgCaloriesBurned: { $avg: '$totalCalories' },
          },
        },
      ]),
      
      // Aggregated nutrition statistics
      Nutrition.aggregate([
        {
          $match: {
            userId: user.userId,
            date: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: null,
            avgCalories: { $avg: '$totalCalories' },
            avgProtein: { $avg: '$totalProtein' },
            avgCarbs: { $avg: '$totalCarbs' },
            avgFats: { $avg: '$totalFats' },
            avgWaterIntake: { $avg: '$waterIntake' },
          },
        },
      ]),
      
      // Recent activities
      Workout.find({ userId: user.userId })
        .sort({ date: -1 })
        .limit(5)
        .lean()
        .select('name type duration totalCalories date'),
      
      Nutrition.find({ userId: user.userId })
        .sort({ date: -1 })
        .limit(5)
        .lean()
        .select('date totalCalories totalProtein totalCarbs totalFats'),
    ]);

    // Daily activity chart data (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const dailyActivityData = await Promise.all(
      last7Days.map(async (date) => {
        const dayStart = new Date(date);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        const [workoutData, nutritionData] = await Promise.all([
          Workout.aggregate([
            {
              $match: {
                userId: user.userId,
                date: { $gte: dayStart, $lte: dayEnd },
              },
            },
            {
              $group: {
                _id: null,
                caloriesBurned: { $sum: '$totalCalories' },
                duration: { $sum: '$duration' },
              },
            },
          ]),
          Nutrition.findOne({
            userId: user.userId,
            date: { $gte: dayStart, $lte: dayEnd },
          })
            .lean()
            .select('totalCalories'),
        ]);

        return {
          date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          caloriesBurned: workoutData[0]?.caloriesBurned || 0,
          caloriesConsumed: nutritionData?.totalCalories || 0,
          workoutDuration: workoutData[0]?.duration || 0,
        };
      })
    );

    // Workout suggestions based on user activity
    const workoutSuggestions = await generateWorkoutSuggestions(
      user.userId,
      workoutStats[0]?.totalWorkouts || 0,
      userProfile?.goals
    );

    const response = NextResponse.json({
      userProfile,
      stats: {
        workout: workoutStats[0] || {
          totalWorkouts: 0,
          totalDuration: 0,
          totalCaloriesBurned: 0,
          avgDuration: 0,
          avgCaloriesBurned: 0,
        },
        nutrition: nutritionStats[0] || {
          avgCalories: 0,
          avgProtein: 0,
          avgCarbs: 0,
          avgFats: 0,
          avgWaterIntake: 0,
        },
      },
      recentActivity: {
        workouts: recentWorkouts,
        nutrition: recentNutrition,
      },
      chartData: dailyActivityData,
      suggestions: workoutSuggestions,
    });

    // Cache for 5 minutes
    response.headers.set('Cache-Control', 'private, max-age=300, stale-while-revalidate=60');

    return response;
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Generate personalized workout suggestions
async function generateWorkoutSuggestions(userId: string, totalWorkouts: number, goals: any) {
  const suggestions = [];

  // Get workout frequency by type
  const workoutTypes = await Workout.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const typeMap = new Map(workoutTypes.map((t) => [t._id, t.count]));

  // Suggest variety
  if (!typeMap.has('cardio') || (typeMap.get('cardio') || 0) < totalWorkouts * 0.3) {
    suggestions.push({
      type: 'cardio',
      title: 'Add More Cardio',
      description: 'Try running, cycling, or swimming for heart health',
      reason: 'Cardio helps improve cardiovascular endurance',
    });
  }

  if (!typeMap.has('strength') || (typeMap.get('strength') || 0) < totalWorkouts * 0.3) {
    suggestions.push({
      type: 'strength',
      title: 'Incorporate Strength Training',
      description: 'Try weightlifting or bodyweight exercises',
      reason: 'Strength training builds muscle and boosts metabolism',
    });
  }

  if (!typeMap.has('flexibility')) {
    suggestions.push({
      type: 'flexibility',
      title: 'Try Flexibility Training',
      description: 'Yoga or stretching can improve mobility',
      reason: 'Flexibility exercises reduce injury risk',
    });
  }

  // Goal-based suggestions
  if (goals?.weeklyWorkouts && totalWorkouts < (goals.weeklyWorkouts * 4)) {
    suggestions.push({
      type: 'goal',
      title: 'Increase Workout Frequency',
      description: `You're targeting ${goals.weeklyWorkouts} workouts per week`,
      reason: 'Stay consistent to reach your goals',
    });
  }

  return suggestions.slice(0, 3);
}
