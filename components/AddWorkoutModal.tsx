'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  caloriesBurned?: number;
}

interface AddWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddWorkoutModal({ isOpen, onClose, onSuccess }: AddWorkoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'strength',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: '', sets: 0, reps: 0, weight: 0, caloriesBurned: 0 }
  ]);

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: 0, reps: 0, weight: 0, caloriesBurned: 0 }]);
  };

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const totalDuration = exercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);
      const totalCalories = exercises.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0);

      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          exercises: exercises.filter(ex => ex.name),
          duration: totalDuration,
          totalCalories,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create workout');
      }

      toast.success('Workout added successfully!');
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({ name: '', type: 'strength', date: new Date().toISOString().split('T')[0], notes: '' });
      setExercises([{ name: '', sets: 0, reps: 0, weight: 0, caloriesBurned: 0 }]);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Add Workout</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Workout Name</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g., Morning Run"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                className="input-field"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="cardio">Cardio</option>
                <option value="strength">Strength</option>
                <option value="flexibility">Flexibility</option>
                <option value="sports">Sports</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              required
              className="input-field"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">Exercises</label>
              <button
                type="button"
                onClick={addExercise}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                + Add Exercise
              </button>
            </div>

            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Exercise {index + 1}</span>
                    {exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExercise(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Exercise name"
                      className="input-field col-span-2 md:col-span-3"
                      value={exercise.name}
                      onChange={(e) => updateExercise(index, 'name', e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Sets"
                      className="input-field"
                      value={exercise.sets || ''}
                      onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                    />
                    <input
                      type="number"
                      placeholder="Reps"
                      className="input-field"
                      value={exercise.reps || ''}
                      onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 0)}
                    />
                    <input
                      type="number"
                      placeholder="Weight (kg)"
                      className="input-field"
                      value={exercise.weight || ''}
                      onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value) || 0)}
                    />
                    <input
                      type="number"
                      placeholder="Duration (min)"
                      className="input-field"
                      value={exercise.duration || ''}
                      onChange={(e) => updateExercise(index, 'duration', parseInt(e.target.value) || 0)}
                    />
                    <input
                      type="number"
                      placeholder="Calories"
                      className="input-field col-span-2"
                      value={exercise.caloriesBurned || ''}
                      onChange={(e) => updateExercise(index, 'caloriesBurned', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Any additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary">
              {loading ? 'Adding...' : 'Add Workout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
