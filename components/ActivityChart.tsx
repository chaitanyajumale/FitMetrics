'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ActivityChartProps {
  data: Array<{
    date: string;
    caloriesBurned: number;
    caloriesConsumed: number;
    workoutDuration: number;
  }>;
}

export default function ActivityChart({ data }: ActivityChartProps) {
  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Activity Overview (Last 7 Days)</h3>
      
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Calories</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="caloriesBurned" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Calories Burned"
            />
            <Line 
              type="monotone" 
              dataKey="caloriesConsumed" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Calories Consumed"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Workout Duration (minutes)</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="workoutDuration" fill="#0ea5e9" name="Duration" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
