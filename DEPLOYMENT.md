# 🚀 Deployment Guide - King's PrideNation

## GitHub Repository Setup

### Step 1: Create Repository on GitHub

1. Go to [GitHub](https://github.com/gaiuscodes)
2. Click the **"+"** icon → **"New repository"**
3. Repository name: `kings-pridenation`
4. Description: `Luxury e-commerce website for premium footwear`
5. Set to **Public** (or Private if preferred)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **"Create repository"**

### Step 2: Connect Local Repository to GitHub

Run these commands in the `kings-pridenation` folder:

```bash
git remote add origin https://github.com/gaiuscodes/kings-pridenation.git
git push -u origin main
```

If you need to authenticate, GitHub will prompt you for credentials.

## Netlify Deployment

### Step 1: Connect to Netlify

1. Go to [Netlify](https://www.netlify.com/)
2. Sign in with your GitHub account
3. Click **"Add new site"** → **"Import an existing project"**
4. Choose **"Deploy with GitHub"**
5. Authorize Netlify to access your GitHub repositories
6. Select the `kings-pridenation` repository

### Step 2: Configure Build Settings

Netlify will auto-detect the settings from `netlify.toml`, but verify:

- **Build command**: (leave empty - static site)
- **Publish directory**: `.` (root directory)
- **Base directory**: (leave empty)

### Step 3: Deploy

1. Click **"Deploy site"**
2. Wait for deployment to complete (usually 30-60 seconds)
3. Your site will be live at: `https://random-name.netlify.app`

### Step 4: Custom Domain (Optional)

1. In Netlify dashboard, go to **"Domain settings"**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `kingspridenation.com`)
4. Follow DNS configuration instructions

## Continuous Deployment

Once connected, every push to the `main` branch will automatically trigger a new deployment on Netlify!

## Environment Variables (if needed)

If you add any environment variables later:
1. Go to **Site settings** → **Environment variables**
2. Add your variables
3. Redeploy the site

## Troubleshooting

### Images not loading?
- Make sure image paths use relative paths: `images/kp1.jpg`
- Check that images are committed to the repository

### Admin panel not working?
- localStorage works in production
- Make sure all JavaScript files are properly linked

### Styling issues?
- Check browser console for errors
- Verify Tailwind CSS CDN is loading

---

**Your site is now live! 🎉**

