'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: string;
}

interface AddNutritionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddNutritionModal({ isOpen, onClose, onSuccess }: AddNutritionModalProps) {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [notes, setNotes] = useState('');
  const [meals, setMeals] = useState<Meal[]>([
    { name: '', calories: 0, protein: 0, carbs: 0, fats: 0, time: '08:00' }
  ]);

  const addMeal = () => {
    setMeals([...meals, { name: '', calories: 0, protein: 0, carbs: 0, fats: 0, time: '12:00' }]);
  };

  const updateMeal = (index: number, field: keyof Meal, value: any) => {
    const updated = [...meals];
    updated[index] = { ...updated[index], [field]: value };
    setMeals(updated);
  };

  const removeMeal = (index: number) => {
    setMeals(meals.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const mealsWithTime = meals
        .filter(meal => meal.name)
        .map(meal => ({
          ...meal,
          time: new Date(`${date}T${meal.time}`).toISOString(),
        }));

      const res = await fetch('/api/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          meals: mealsWithTime,
          waterIntake,
          notes,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save nutrition data');
      }

      toast.success('Nutrition data saved successfully!');
      onSuccess();
      onClose();
      
      // Reset form
      setDate(new Date().toISOString().split('T')[0]);
      setWaterIntake(0);
      setNotes('');
      setMeals([{ name: '', calories: 0, protein: 0, carbs: 0, fats: 0, time: '08:00' }]);
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
          <h2 className="text-2xl font-bold text-gray-900">Log Nutrition</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                required
                className="input-field"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Water Intake (ml)</label>
              <input
                type="number"
                className="input-field"
                placeholder="2000"
                value={waterIntake || ''}
                onChange={(e) => setWaterIntake(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">Meals</label>
              <button
                type="button"
                onClick={addMeal}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                + Add Meal
              </button>
            </div>

            <div className="space-y-4">
              {meals.map((meal, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Meal {index + 1}</span>
                    {meals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMeal(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Meal name"
                      className="input-field col-span-2"
                      value={meal.name}
                      onChange={(e) => updateMeal(index, 'name', e.target.value)}
                    />
                    <input
                      type="time"
                      className="input-field"
                      value={meal.time}
                      onChange={(e) => updateMeal(index, 'time', e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Calories"
                      className="input-field"
                      value={meal.calories || ''}
                      onChange={(e) => updateMeal(index, 'calories', parseInt(e.target.value) || 0)}
                    />
                    <input
                      type="number"
                      placeholder="Protein (g)"
                      className="input-field"
                      value={meal.protein || ''}
                      onChange={(e) => updateMeal(index, 'protein', parseInt(e.target.value) || 0)}
                    />
                    <input
                      type="number"
                      placeholder="Carbs (g)"
                      className="input-field"
                      value={meal.carbs || ''}
                      onChange={(e) => updateMeal(index, 'carbs', parseInt(e.target.value) || 0)}
                    />
                    <input
                      type="number"
                      placeholder="Fats (g)"
                      className="input-field col-span-2"
                      value={meal.fats || ''}
                      onChange={(e) => updateMeal(index, 'fats', parseInt(e.target.value) || 0)}
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
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
