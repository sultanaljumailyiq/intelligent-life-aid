# Deploying to Netlify

This guide explains how to deploy the Smart Dental Platform to Netlify.

## Prerequisites

- Netlify account (https://app.netlify.com)
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 18+ installed locally

## Quick Start

### 1. Push Your Code to Git

```bash
git add .
git commit -m "Setup Netlify deployment"
git push origin main
```

### 2. Deploy to Netlify

#### Option A: Using Netlify CLI (Recommended)

```bash
npm install -g netlify-cli

# Build locally first to test
npm run build && npm run build:server

# Deploy
netlify deploy --prod
```

#### Option B: Using Netlify UI

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Select your Git provider (GitHub, GitLab, Bitbucket)
4. Choose your repository
5. Click "Deploy site"

The build settings will be automatically picked up from `netlify.toml`

## Environment Variables

Set these in Netlify Settings → Build & Deploy → Environment:

### Required Variables

```
NODE_ENV=production
```

### Optional Variables (if using services)

```
# Database Connection (if using Neon/Supabase)
DATABASE_URL=postgresql://...

# Stripe API (for payments)
STRIPE_PUBLIC_KEY=pk_...
STRIPE_SECRET_KEY=sk_...

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=your_api_key

# Other services
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
```

## Build Configuration

The `netlify.toml` file contains all build configuration:

- **Build command**: `npm run build && npm run build:server`
- **Publish directory**: `dist/spa`
- **Functions directory**: `netlify/functions`

## How It Works

### Frontend Build
- Vite builds the React SPA to `dist/spa/`
- This is served as the main website

### Backend Build
- Express server is built to `dist/server/`
- Bundled as a Netlify Function at `/.netlify/functions/api`

### API Routing
- All `/api/*` requests are automatically routed to the Netlify Function
- The Express app handles routing within the function

## Troubleshooting

### Build Fails

Check the build logs in Netlify:
1. Go to your site
2. Click "Deploys"
3. Click on the failed deploy
4. Scroll down to see build logs

Common issues:
- Missing environment variables
- Database connection errors
- TypeScript compilation errors

### API Routes Not Working

1. Check that the function is deployed: `/.netlify/functions/api`
2. Check browser DevTools Network tab for `/api/*` requests
3. Look at Netlify Function logs for errors
4. Verify `DATABASE_URL` is set if using a database

### Static Assets 404

- Ensure `dist/spa` contains the built files
- Check that Vite build completed successfully
- Clear Netlify cache: Site Settings → Deploys → "Clear cache and redeploy"

## Database Considerations

### Using Neon/Postgres

1. Create a database on Neon: https://neon.tech
2. Add `DATABASE_URL` environment variable to Netlify
3. Run migrations before deploy (or during build)

### Using Supabase

1. Create a project on Supabase
2. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to Netlify environment
3. Ensure your schema is set up in Supabase

## Performance Tips

1. **Image Optimization**: Consider using Netlify Image Optimization
2. **Caching**: Cache headers are set in `netlify.toml`
   - Static assets: 1 year cache
   - HTML files: No cache (always fetch new version)
   - API responses: No cache (always fresh)

3. **Edge Functions** (Premium): For server-side logic near users

## Custom Domain

1. Go to Site Settings → Domain Management
2. Add your custom domain
3. Follow Netlify's instructions to update DNS records

## Monitoring

Netlify provides analytics:
- Site Settings → Analytics
- View traffic, errors, and performance metrics

## Rollback Previous Deploys

1. Go to "Deploys"
2. Find the deploy you want to restore
3. Click the three dots menu
4. Select "Publish deploy"

## CI/CD Pipeline

Netlify automatically:
- Builds on every push to your branch
- Creates preview deploys for pull requests
- Deploys to production on merge to main

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com)
- [Netlify CLI Reference](https://cli.netlify.com)
- [Serverless Functions Guide](https://docs.netlify.com/functions/overview)
- [Build Configuration Reference](https://docs.netlify.com/configure-builds/file-based-configuration)
