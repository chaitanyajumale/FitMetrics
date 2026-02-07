import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Nutrition from '@/models/Nutrition';
import { getUserFromRequest } from '@/lib/auth';

// GET nutrition entries for a user
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '30');

    const query: any = { userId: user.userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Optimized query with lean()
    const nutritionEntries = await Nutrition.find(query)
      .sort({ date: -1 })
      .limit(limit)
      .lean()
      .select('-__v');

    const response = NextResponse.json({ nutritionEntries });
    
    // Add caching headers
    response.headers.set('Cache-Control', 'private, max-age=300, stale-while-revalidate=60');
    
    return response;
  } catch (error) {
    console.error('Fetch nutrition error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new nutrition entry
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const data = await request.json();
    const { date, meals, waterIntake, notes } = data;

    if (!date || !meals) {
      return NextResponse.json(
        { error: 'Date and meals are required' },
        { status: 400 }
      );
    }

    // Calculate totals
    const totals = meals.reduce(
      (acc: any, meal: any) => ({
        totalCalories: acc.totalCalories + meal.calories,
        totalProtein: acc.totalProtein + meal.protein,
        totalCarbs: acc.totalCarbs + meal.carbs,
        totalFats: acc.totalFats + meal.fats,
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0 }
    );

    // Upsert (update or insert) nutrition entry
    const nutrition = await Nutrition.findOneAndUpdate(
      { userId: user.userId, date: new Date(date) },
      {
        $set: {
          meals,
          ...totals,
          waterIntake: waterIntake || 0,
          notes,
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ nutrition }, { status: 201 });
  } catch (error) {
    console.error('Create nutrition error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE nutrition entry
export async function DELETE(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Nutrition ID required' }, { status: 400 });
    }

    const nutrition = await Nutrition.findOneAndDelete({
      _id: id,
      userId: user.userId,
    });

    if (!nutrition) {
      return NextResponse.json({ error: 'Nutrition entry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete nutrition error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
