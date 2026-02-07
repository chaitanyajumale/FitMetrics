import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMeal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: Date;
}

export interface INutrition extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: Date;
  meals: IMeal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  waterIntake: number; // in ml
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MealSchema = new Schema<IMeal>({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fats: { type: Number, required: true },
  time: { type: Date, required: true },
}, { _id: false });

const NutritionSchema = new Schema<INutrition>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true 
    },
    date: { type: Date, required: true, index: true },
    meals: [MealSchema],
    totalCalories: { type: Number, required: true, default: 0 },
    totalProtein: { type: Number, required: true, default: 0 },
    totalCarbs: { type: Number, required: true, default: 0 },
    totalFats: { type: Number, required: true, default: 0 },
    waterIntake: { type: Number, default: 0 },
    notes: { type: String },
  },
  { 
    timestamps: true,
    minimize: false,
  }
);

// Compound index for efficient user+date queries
NutritionSchema.index({ userId: 1, date: -1 });
// Unique constraint to prevent duplicate entries per day
NutritionSchema.index({ userId: 1, date: 1 }, { unique: true });

const Nutrition: Model<INutrition> = mongoose.models.Nutrition || mongoose.model<INutrition>('Nutrition', NutritionSchema);

export default Nutrition;
