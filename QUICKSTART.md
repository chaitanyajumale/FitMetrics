# Quick Start Guide - FitMetrics

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
cd fitness-tracker
npm install
```

### 2. Set Up MongoDB
**Option A: Local MongoDB**
```bash
# Install MongoDB
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb
```

**Option B: MongoDB Atlas (Recommended)**
1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get connection string
4. Update `.env.local`

### 3. Configure Environment
Edit `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/fitness-tracker
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitness-tracker

JWT_SECRET=your-secret-key-change-this
NODE_ENV=development
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Open Application
Visit [http://localhost:3000](http://localhost:3000)

## 📝 First Steps

1. **Create Account**
   - Click "Get Started" or "Register"
   - Fill in your details
   - Set your fitness goals (optional)

2. **Log Your First Workout**
   - Click "+ Add Workout"
   - Enter workout details
   - Add exercises with sets/reps/weight
   - Save

3. **Track Nutrition**
   - Click "+ Log Nutrition"
   - Add your meals
   - Track calories and macros
   - Monitor water intake

4. **View Progress**
   - Dashboard shows 7-day activity charts
   - See workout statistics
   - Get personalized suggestions

## 🎯 Key Features

- **Workout Tracking**: Log exercises, sets, reps, weight
- **Nutrition Monitoring**: Track meals, calories, macros
- **Progress Charts**: Visualize your fitness journey
- **Goal Setting**: Set and track fitness goals
- **Smart Suggestions**: Get personalized workout recommendations

## 📊 Sample Data

Want to see the app in action? Create these sample entries:

**Workout Example:**
- Name: "Morning Strength Training"
- Type: Strength
- Exercises:
  - Bench Press: 3 sets x 10 reps @ 60kg
  - Squats: 4 sets x 12 reps @ 80kg
  - Deadlifts: 3 sets x 8 reps @ 100kg

**Nutrition Example:**
- Breakfast: Oatmeal with berries (350 cal, 12g protein, 60g carbs, 8g fat)
- Lunch: Grilled chicken salad (450 cal, 40g protein, 30g carbs, 15g fat)
- Dinner: Salmon with rice (600 cal, 45g protein, 70g carbs, 18g fat)

## 🚀 Deployment

### Deploy to Vercel (Free)
1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📚 Documentation

- [README.md](README.md) - Full documentation
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [FEATURES.md](FEATURES.md) - Features & optimizations

## 🆘 Troubleshooting

**MongoDB Connection Failed?**
- Check MongoDB is running: `sudo systemctl status mongodb`
- Verify connection string in `.env.local`
- Check network access in MongoDB Atlas

**Port 3000 Already in Use?**
```bash
# Use different port
PORT=3001 npm run dev
```

**Dependencies Installation Failed?**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 💡 Tips

1. **Mobile Testing**: The app is fully responsive
2. **Data Persistence**: All data is stored in MongoDB
3. **Security**: Passwords are hashed, JWT tokens are secure
4. **Performance**: Optimized with caching and indexes

## 🎉 Next Steps

- Customize the theme in `tailwind.config.js`
- Add more workout types
- Integrate with fitness devices
- Deploy to production

Enjoy tracking your fitness journey! 🏋️‍♂️💪
