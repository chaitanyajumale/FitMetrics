import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number; // in minutes
  caloriesBurned?: number;
}

export interface IWorkout extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other';
  exercises: IExercise[];
  duration: number; // total duration in minutes
  totalCalories: number;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseSchema = new Schema<IExercise>({
  name: { type: String, required: true },
  sets: { type: Number, default: 0 },
  reps: { type: Number, default: 0 },
  weight: { type: Number },
  duration: { type: Number },
  caloriesBurned: { type: Number },
}, { _id: false });

const WorkoutSchema = new Schema<IWorkout>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true // Optimize user queries
    },
    name: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['cardio', 'strength', 'flexibility', 'sports', 'other'],
      required: true 
    },
    exercises: [ExerciseSchema],
    duration: { type: Number, required: true },
    totalCalories: { type: Number, required: true },
    date: { type: Date, required: true, index: true }, // Optimize date range queries
    notes: { type: String },
  },
  { 
    timestamps: true,
    // Optimize memory usage
    minimize: false,
  }
);

// Compound index for efficient user+date queries
WorkoutSchema.index({ userId: 1, date: -1 });
// Index for type-based filtering
WorkoutSchema.index({ userId: 1, type: 1 });

const Workout: Model<IWorkout> = mongoose.models.Workout || mongoose.model<IWorkout>('Workout', WorkoutSchema);

export default Workout;
