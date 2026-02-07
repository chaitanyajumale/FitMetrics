import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  age?: number;
  weight?: number;
  height?: number;
  goals?: {
    targetWeight?: number;
    weeklyWorkouts?: number;
    dailyCalories?: number;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true,
      index: true // Optimize email lookups
    },
    password: { type: String, required: true, select: false },
    age: { type: Number },
    weight: { type: Number },
    height: { type: Number },
    goals: {
      targetWeight: { type: Number },
      weeklyWorkouts: { type: Number },
      dailyCalories: { type: Number },
    },
  },
  { 
    timestamps: true,
    // Optimize queries by only returning needed fields
    toJSON: {
      transform: function(doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = await mongoose.model('User').findById(this._id).select('+password');
  return bcrypt.compare(candidatePassword, user.password);
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
