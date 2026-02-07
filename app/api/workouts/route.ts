import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Workout from '@/models/Workout';
import { getUserFromRequest } from '@/lib/auth';

// GET all workouts for a user with date filtering
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
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build optimized query
    const query: any = { userId: user.userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    if (type) {
      query.type = type;
    }

    // Optimized query with lean() for better performance
    const workouts = await Workout.find(query)
      .sort({ date: -1 })
      .limit(limit)
      .lean()
      .select('-__v'); // Exclude version key

    const response = NextResponse.json({ workouts });
    
    // Add caching headers for 5 minutes
    response.headers.set('Cache-Control', 'private, max-age=300, stale-while-revalidate=60');
    
    return response;
  } catch (error) {
    console.error('Fetch workouts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new workout
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const data = await request.json();
    const { name, type, exercises, duration, totalCalories, date, notes } = data;

    if (!name || !type || !exercises || !duration || !totalCalories || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const workout = await Workout.create({
      userId: user.userId,
      name,
      type,
      exercises,
      duration,
      totalCalories,
      date: new Date(date),
      notes,
    });

    return NextResponse.json({ workout }, { status: 201 });
  } catch (error) {
    console.error('Create workout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE workout
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
      return NextResponse.json({ error: 'Workout ID required' }, { status: 400 });
    }

    const workout = await Workout.findOneAndDelete({
      _id: id,
      userId: user.userId,
    });

    if (!workout) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete workout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
