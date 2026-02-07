import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="text-white text-2xl font-bold">FitMetrics</div>
          <div className="space-x-4">
            <Link href="/login" className="text-white hover:text-primary-200 transition-colors">
              Login
            </Link>
            <Link href="/register" className="bg-white text-primary-700 px-6 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors">
              Get Started
            </Link>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Track Your Fitness Journey
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-primary-100">
            Monitor workouts, nutrition, and progress all in one place. 
            Get personalized insights to reach your fitness goals faster.
          </p>
          
          <div className="flex justify-center gap-4 mb-16">
            <Link href="/register" className="bg-white text-primary-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg">
              Start Free Trial
            </Link>
            <Link href="/login" className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-primary-700 transition-colors">
              Sign In
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-xl font-bold mb-2">Track Workouts</h3>
              <p className="text-primary-100">Log exercises, sets, reps, and monitor your strength progress over time</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl mb-4">🥗</div>
              <h3 className="text-xl font-bold mb-2">Monitor Nutrition</h3>
              <p className="text-primary-100">Track calories, macros, and maintain a balanced diet for optimal results</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">View Progress</h3>
              <p className="text-primary-100">Visualize your journey with detailed charts and personalized insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
