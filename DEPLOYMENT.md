# Deployment Guide
//test
## Prerequisites

1. **MongoDB Atlas Account** (Free tier available)
   - Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string

2. **Vercel Account** (Free tier available)
   - Sign up at [vercel.com](https://vercel.com)

## Step-by-Step Deployment

### 1. Prepare MongoDB Atlas

1. **Create a cluster**
   - Choose a cloud provider (AWS/GCP/Azure)
   - Select a region close to your users
   - Use M0 (Free) tier for development

2. **Configure Network Access**
   - Go to Network Access
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add specific IP addresses for security

3. **Create Database User**
   - Go to Database Access
   - Click "Add New Database User"
   - Choose authentication method (Password)
   - Save username and password
   - Grant read/write access

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your user password
   - Replace `<dbname>` with `fitness-tracker`

Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fitness-tracker?retryWrites=true&w=majority`

### 2. Prepare Your Code

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/fitness-tracker.git
git push -u origin main
```

2. **Environment Variables**
Prepare these values:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Generate with `openssl rand -base64 32`
- `NODE_ENV`: `production`

### 3. Deploy to Vercel

1. **Import Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

2. **Configure Project**
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
   - Install Command: `npm install`

3. **Add Environment Variables**
   - Click "Environment Variables"
   - Add each variable:
     ```
     MONGODB_URI=mongodb+srv://...
     JWT_SECRET=your-generated-secret
     NODE_ENV=production
     ```
   - Make sure they're available for Production, Preview, and Development

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Your app will be live at `https://your-app.vercel.app`

### 4. Post-Deployment

1. **Test the Application**
   - Visit your Vercel URL
   - Create a test account
   - Log a workout and nutrition entry
   - Check dashboard statistics

2. **Custom Domain (Optional)**
   - Go to your project settings
   - Click "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

3. **Monitor Performance**
   - Check Vercel Analytics
   - Monitor MongoDB Atlas metrics
   - Set up alerts for errors

## Alternative Deployment Options

### Deploy to Railway

1. **Create account at [railway.app](https://railway.app)**

2. **New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add MongoDB**
   - Click "New" → "Database" → "MongoDB"
   - Copy the connection string
   - Add to environment variables

4. **Configure Environment**
   - Add `JWT_SECRET`
   - Add `NODE_ENV=production`
   - MongoDB URI is auto-added

5. **Deploy**
   - Railway auto-deploys on git push

### Deploy to Render

1. **Create account at [render.com](https://render.com)**

2. **New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure**
   - Name: fitness-tracker
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. **Add Environment Variables**
   - Add MongoDB URI
   - Add JWT_SECRET
   - Add NODE_ENV=production

5. **Create Web Service**

## Performance Optimization for Production

### 1. Enable Compression
Already enabled in Next.js config

### 2. CDN Configuration
- Vercel automatically uses CDN
- Static assets cached at edge

### 3. Database Optimization
```javascript
// Already implemented in lib/mongodb.ts
{
  maxPoolSize: 10,
  minPoolSize: 5,
  socketTimeoutMS: 45000,
}
```

### 4. Monitor Application
- Set up Vercel Analytics
- Enable MongoDB monitoring in Atlas
- Set up error tracking (Sentry, LogRocket)

## Troubleshooting

### Build Fails
- Check Node version (use 18.x or higher)
- Verify all dependencies are installed
- Check TypeScript errors: `npm run build` locally

### Database Connection Issues
- Verify MongoDB URI is correct
- Check network access whitelist
- Ensure database user has correct permissions

### Authentication Not Working
- Verify JWT_SECRET is set
- Check cookie settings (secure in production)
- Ensure HTTPS is enabled

### Slow Performance
- Enable caching headers (already implemented)
- Check database indexes (already created)
- Monitor slow queries in MongoDB Atlas

## Security Checklist

- [ ] Changed JWT_SECRET from default
- [ ] Using HTTPS (automatic on Vercel)
- [ ] MongoDB network access configured
- [ ] Strong database user password
- [ ] Environment variables not committed to git
- [ ] CORS properly configured
- [ ] Rate limiting enabled (add if needed)

## Scaling Considerations

### Database
- Start with M0 (Free) tier
- Upgrade to M10 for production (512MB RAM)
- Enable auto-scaling in Atlas

### Application
- Vercel scales automatically
- Consider caching layer (Redis) for 1000+ users
- Implement rate limiting for API routes

### Cost Estimation
- **Free Tier**: MongoDB Atlas M0 + Vercel Free
- **Low Traffic**: ~$10-20/month (M10 MongoDB)
- **Medium Traffic**: ~$50-100/month (M20 MongoDB + Vercel Pro)

## Backup Strategy

1. **Enable MongoDB Backups**
   - Go to Atlas → Backup
   - Enable continuous backups (M10+)
   - Or use point-in-time restore

2. **Code Backups**
   - GitHub serves as version control
   - Enable branch protection

## Maintenance

### Regular Updates
```bash
# Update dependencies
npm update

# Check for security issues
npm audit

# Fix vulnerabilities
npm audit fix
```

### Monitor Logs
- Vercel: Check function logs
- MongoDB Atlas: Review slow queries
- Set up alerts for errors

## Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- MongoDB: [mongodb.com/support](https://www.mongodb.com/support)
- GitHub Issues: Open an issue in your repository
