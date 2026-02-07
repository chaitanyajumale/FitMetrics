'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import ActivityChart from '@/components/ActivityChart';
import AddWorkoutModal from '@/components/AddWorkoutModal';
import AddNutritionModal from '@/components/AddNutritionModal';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const router = useRouter();
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showNutritionModal, setShowNutritionModal] = useState(false);

  // Fetch dashboard data with SWR for automatic caching and revalidation
  const { data, error, mutate } = useSWR('/api/dashboard?days=30', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true,
  });

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/login');
      router.refresh();
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleWorkoutSuccess = () => {
    mutate(); // Revalidate data
  };

  const handleNutritionSuccess = () => {
    mutate(); // Revalidate data
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load dashboard</p>
          <button onClick={() => router.push('/login')} className="btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const { userProfile, stats, recentActivity, chartData, suggestions } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FitMetrics</h1>
              <p className="text-gray-600">Welcome back, {userProfile?.name}!</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWorkoutModal(true)}
                className="btn-primary"
              >
                + Add Workout
              </button>
              <button
                onClick={() => setShowNutritionModal(true)}
                className="btn-primary"
              >
                + Log Nutrition
              </button>
              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="text-3xl mb-2">💪</div>
            <div className="text-2xl font-bold mb-1">{stats.workout.totalWorkouts}</div>
            <div className="text-primary-100 text-sm">Total Workouts (30 days)</div>
          </div>

          <div className="stat-card">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold mb-1">
              {Math.round(stats.workout.totalCaloriesBurned).toLocaleString()}
            </div>
            <div className="text-primary-100 text-sm">Calories Burned</div>
          </div>

          <div className="stat-card">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-2xl font-bold mb-1">
              {Math.round(stats.workout.totalDuration)} min
            </div>
            <div className="text-primary-100 text-sm">Total Workout Time</div>
          </div>

          <div className="stat-card">
            <div className="text-3xl mb-2">🥗</div>
            <div className="text-2xl font-bold mb-1">
              {Math.round(stats.nutrition.avgCalories || 0)}
            </div>
            <div className="text-primary-100 text-sm">Avg Daily Calories</div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="mb-8">
          <ActivityChart data={chartData} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Workout Suggestions */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Personalized Suggestions</h3>
            {suggestions && suggestions.length > 0 ? (
              <div className="space-y-4">
                {suggestions.map((suggestion: any, index: number) => (
                  <div key={index} className="border-l-4 border-primary-500 pl-4 py-2">
                    <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">{suggestion.description}</p>
                    <p className="text-xs text-gray-500">{suggestion.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Keep up the great work! You're doing well.</p>
            )}
          </div>

          {/* Nutrition Summary */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Nutrition Overview (30 days avg)</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Calories</span>
                <span className="font-semibold">{Math.round(stats.nutrition.avgCalories || 0)} kcal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Protein</span>
                <span className="font-semibold">{Math.round(stats.nutrition.avgProtein || 0)}g</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Carbs</span>
                <span className="font-semibold">{Math.round(stats.nutrition.avgCarbs || 0)}g</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Fats</span>
                <span className="font-semibold">{Math.round(stats.nutrition.avgFats || 0)}g</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Water Intake</span>
                <span className="font-semibold">{Math.round(stats.nutrition.avgWaterIntake || 0)}ml</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Workouts */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Workouts</h3>
            {recentActivity.workouts && recentActivity.workouts.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.workouts.map((workout: any) => (
                  <div key={workout._id} className="border-b border-gray-200 pb-3 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{workout.name}</h4>
                        <p className="text-sm text-gray-600">
                          {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)} • {workout.duration} min
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-primary-600">
                          {workout.totalCalories} cal
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(workout.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No workouts logged yet. Start by adding one!</p>
            )}
          </div>

          {/* Recent Nutrition */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Nutrition</h3>
            {recentActivity.nutrition && recentActivity.nutrition.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.nutrition.map((entry: any) => (
                  <div key={entry._id} className="border-b border-gray-200 pb-3 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {new Date(entry.date).toLocaleDateString()}
                        </h4>
                        <p className="text-sm text-gray-600">
                          P: {entry.totalProtein}g • C: {entry.totalCarbs}g • F: {entry.totalFats}g
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-primary-600">
                          {entry.totalCalories} cal
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No nutrition data logged yet. Start tracking!</p>
            )}
          </div>
        </div>

        {/* Goals Section */}
        {userProfile?.goals && (
          <div className="card mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Goals</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {userProfile.goals.targetWeight && (
                <div>
                  <span className="text-gray-700">Target Weight:</span>{' '}
                  <span className="font-semibold">{userProfile.goals.targetWeight} kg</span>
                </div>
              )}
              {userProfile.goals.weeklyWorkouts && (
                <div>
                  <span className="text-gray-700">Weekly Workouts:</span>{' '}
                  <span className="font-semibold">{userProfile.goals.weeklyWorkouts}</span>
                </div>
              )}
              {userProfile.goals.dailyCalories && (
                <div>
                  <span className="text-gray-700">Daily Calories:</span>{' '}
                  <span className="font-semibold">{userProfile.goals.dailyCalories} kcal</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddWorkoutModal
        isOpen={showWorkoutModal}
        onClose={() => setShowWorkoutModal(false)}
        onSuccess={handleWorkoutSuccess}
      />
      <AddNutritionModal
        isOpen={showNutritionModal}
        onClose={() => setShowNutritionModal(false)}
        onSuccess={handleNutritionSuccess}
      />
    </div>
  );
}
