# FitMetrics

A full-stack fitness tracker built with Next.js 14, TypeScript, Tailwind CSS, and MongoDB.

FitMetrics helps users log workouts and nutrition, monitor trends, and view personalized suggestions from a single dashboard.

## Features

- JWT auth with HttpOnly cookie sessions (`/api/auth/register`, `/api/auth/login`, `/api/auth/logout`)
- Workout tracking (exercise details, duration, calories, notes)
- Nutrition logging with daily meal + macro totals
- Dashboard analytics with charts, recent activity, and goal-aware suggestions
- SWR-based client caching and periodic refresh on the dashboard
- API + DB performance optimizations (`lean()`, aggregation pipelines, query indexes, connection pooling)

## Tech Stack

- `next` 14 (App Router)
- `react` 18 + TypeScript
- Tailwind CSS
- MongoDB + Mongoose
- SWR
- Recharts
- `jsonwebtoken` + `bcryptjs`

## Quick Start

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create `/.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/fitness-tracker
JWT_SECRET=replace-with-a-strong-secret
NODE_ENV=development
```

Notes:
- In development, if `JWT_SECRET` is missing, a fallback secret is used.
- In production, `JWT_SECRET` must be set to a strong unique value.

### 3) Start MongoDB

Use your preferred local or remote MongoDB instance.

Docker example:

```bash
docker run -d -p 27017:27017 --name fitmetrics-mongo mongo:latest
```

### 4) Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## NPM Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Workouts

- `GET /api/workouts?startDate=&endDate=&type=&limit=`
- `POST /api/workouts`
- `DELETE /api/workouts?id=<workoutId>`

### Nutrition

- `GET /api/nutrition?startDate=&endDate=&limit=`
- `POST /api/nutrition`
- `DELETE /api/nutrition?id=<nutritionId>`

### Dashboard

- `GET /api/dashboard?days=30`

## Project Structure

```text
fitness-tracker/
  app/
    api/
      auth/
      dashboard/
      nutrition/
      workouts/
    dashboard/
    login/
    register/
  components/
    ActivityChart.tsx
    AddWorkoutModal.tsx
    AddNutritionModal.tsx
  lib/
    auth.ts
    auth-cookie.ts
    jwt-config.ts
    mongodb.ts
  models/
    User.ts
    Workout.ts
    Nutrition.ts
```

## Deployment

Deploying to Vercel is the simplest path:

1. Push this repository to GitHub.
2. Import the repo in Vercel.
3. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
4. Deploy.

## Security Notes

- Passwords are hashed with `bcryptjs`.
- JWT is stored in an HttpOnly cookie named `token`.
- Cookie is `secure` in production and `sameSite=lax`.

## Roadmap Ideas

- PWA + offline support
- Push notifications
- Device/wearable integrations
- Meal planning and templates
- Expanded social/community features
