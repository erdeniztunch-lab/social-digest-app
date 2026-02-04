# 🐦 Twitter Digest App

Never miss your Twitter feed again! Get a personalized summary of your Twitter timeline delivered to your inbox every morning.

## ✨ Features

- 🔐 **Secure Authentication** - OAuth 2.0 with Twitter and Supabase Auth
- 📧 **Daily Email Digests** - Automated timeline summaries sent to your inbox
- ⚙️ **Customizable Settings** - Choose detail level, delivery time, and preferences
- 📊 **Engagement-Based Sorting** - See the most important tweets first
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 🆓 **100% Free** - Built entirely with free tier services

## 🏗️ Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- React Router
- Supabase Client
- Lucide Icons

### Backend
- Node.js + Express
- Supabase (PostgreSQL)
- Twitter API v2
- Resend (Email)
- Node-cron (Scheduling)

### Free Tier Services
- **Supabase**: Database + Auth (500MB free)
- **Twitter API v2**: Free tier (500K tweets/month)
- **Resend**: Email delivery (3,000 emails/month free)
- **Vercel**: Frontend hosting (unlimited)
- **Render**: Backend hosting (750 hours/month free)

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Twitter Developer account ([apply here](https://developer.twitter.com))
- A Supabase account ([sign up](https://supabase.com))
- A Resend account ([sign up](https://resend.com))

## 📚 Documentation

- `docs/QUICKSTART.md` - 15-minute setup guide
- `docs/FRONTEND-SETUP.md` - Frontend setup details
- `docs/PROJECT_STRUCTURE.md` - Architecture overview
- `docs/CODE_TEMPLATES.md` - Frontend code templates
- `docs/PACKAGE_README.txt` - Package overview

## 🚀 Quick Start

### 1. Setup External Services

#### Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `database/schema.sql`
3. Go to Settings > API and copy:
   - Project URL
   - anon/public key
   - service_role key

#### Twitter API Setup
1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new App or use an existing one
3. In App Settings:
   - Enable OAuth 2.0 with PKCE
   - Add callback URL: `http://localhost:5173/auth/twitter/callback`
   - Set App permissions to: **Read only**
4. Copy your credentials:
   - API Key
   - API Secret
   - Bearer Token
   - Client ID
   - Client Secret

#### Resend Setup
1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use the testing domain)
3. Create an API key from Settings > API Keys

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials
# Use your favorite editor (nano, vim, code, etc.)
nano .env
```

Edit the `.env` file with your actual credentials:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com

PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

DIGEST_CRON_SCHEDULE=0 8 * * *
```

Start the backend server:
```bash
npm run dev
```

Backend should now be running at `http://localhost:3001`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials
nano .env
```

Edit the `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3001
```

Start the frontend:
```bash
npm run dev
```

Frontend should now be running at `http://localhost:5173`

### 4. Test the Application

1. Open `http://localhost:5173` in your browser
2. Click "Get Started" and create an account
3. Sign in with your new account
4. Connect your Twitter account
5. Configure your settings (detail level, delivery time)
6. Click "Send Test Digest" to receive a test email
7. Check your inbox!

## 📖 How It Works

### User Flow
1. User signs up with email/password
2. User connects their Twitter account via OAuth
3. User configures digest preferences
4. Backend cron job runs daily at specified time
5. System fetches user's Twitter timeline
6. Tweets are filtered (last 24 hours) and sorted by engagement
7. Email digest is generated and sent via Resend

### Cron Schedule
The default schedule sends digests at **8:00 AM every day**. Customize in `backend/.env`:

```env
# Format: minute hour day month dayofweek
DIGEST_CRON_SCHEDULE=0 8 * * *  # 8 AM daily (default)

# Examples:
# 0 6 * * * - 6 AM daily
# 0 20 * * * - 8 PM daily
# 0 9 * * 1-5 - 9 AM weekdays only
# 0 12 * * 0 - 12 PM Sundays only
```

## 🚢 Deployment Guide

### Deploy Backend to Render

1. Push your code to GitHub (make sure `.env` is in `.gitignore`)
2. Go to [render.com](https://render.com) and create account
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: twitter-digest-backend
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add all environment variables from your `.env`
7. Click "Create Web Service"

### Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and create account
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (your Render backend URL)
6. Click "Deploy"

### Update Twitter Callback URLs

After deployment, update your Twitter App settings:
- Add production callback: `https://your-domain.vercel.app/auth/twitter/callback`
- Keep localhost callback for development

## 📊 API Endpoints

### Authentication
- `POST /api/auth/twitter/oauth-url` - Generate Twitter OAuth URL
- `POST /api/auth/twitter/callback` - Handle OAuth callback
- `POST /api/auth/twitter/disconnect` - Disconnect Twitter account

### User Management
- `GET /api/user/profile` - Get user profile and settings
- `PUT /api/user/preferences` - Update user preferences
- `GET /api/user/digest-history` - Get digest history logs

### Digest Operations
- `POST /api/digest/test` - Send test digest (authenticated users only)
- `POST /api/trigger-digest` - Manual trigger (development only)

## 🔒 Security Features

- OAuth 2.0 with PKCE for Twitter authentication
- Row Level Security (RLS) enabled on all Supabase tables
- Service role key used only on backend (never exposed to frontend)
- JWT tokens for API authentication
- Environment variables for all sensitive data
- HTTPS required in production

## 🗂️ Project Structure

```
twitter-digest-app/
├── backend/
│   ├── config/
│   │   ├── supabase.js          # Supabase client config
│   │   └── twitter.js           # Twitter API client
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── routes/
│   │   ├── auth.js              # Twitter OAuth routes
│   │   ├── user.js              # User management routes
│   │   └── digest.js            # Digest operations
│   ├── services/
│   │   ├── emailService.js      # Resend email service
│   │   ├── twitterService.js    # Twitter API operations
│   │   └── digestService.js     # Digest generation logic
│   ├── server.js                # Express server entry point
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx       # Main layout wrapper
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── lib/
│   │   │   ├── supabase.js      # Supabase client
│   │   │   └── api.js           # API client
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx  # Marketing landing page
│   │   │   ├── LoginPage.jsx    # User login
│   │   │   ├── SignupPage.jsx   # User registration
│   │   │   ├── DashboardPage.jsx # Main dashboard
│   │   │   ├── SettingsPage.jsx  # User settings
│   │   │   └── TwitterCallbackPage.jsx # OAuth callback
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env.example
│   └── .gitignore
├── database/
│   └── schema.sql               # Supabase database schema
├── README.md                    # This file
└── .gitignore                   # Root gitignore
```

## 🐛 Troubleshooting

### "Failed to fetch timeline"
**Cause**: Twitter API credentials issue or rate limit
**Solution**:
- Verify Twitter API credentials in `.env`
- Ensure app has "Read" permissions in Twitter Developer Portal
- Check if bearer token is valid
- Verify you haven't hit rate limits (500K tweets/month free tier)

### "Email not sent"
**Cause**: Resend configuration issue
**Solution**:
- Verify Resend API key in `.env`
- Check that FROM_EMAIL domain is verified in Resend
- If using test domain, emails only go to verified addresses
- Check Resend dashboard for error logs

### "Database error" or "RLS policy violation"
**Cause**: Database schema not set up correctly
**Solution**:
- Ensure `database/schema.sql` was run in Supabase SQL Editor
- Verify RLS policies are enabled
- Check that environment variables match your Supabase project
- Use service_role key for backend operations

### "OAuth callback failed"
**Cause**: Twitter OAuth configuration mismatch
**Solution**:
- Verify callback URL in Twitter Developer Portal matches exactly
- Ensure OAuth 2.0 with PKCE is enabled
- Check that Client ID and Client Secret are correct
- Clear browser cache and try again

### "CORS error"
**Cause**: Frontend and backend CORS mismatch
**Solution**:
- Verify FRONTEND_URL in backend `.env` matches your frontend URL
- In production, update to use your actual domain
- Check that backend CORS middleware is configured correctly

## 💡 Development Tips

### Manual Digest Trigger (Development Only)
In development mode, you can manually trigger digest generation:

```bash
curl -X POST http://localhost:3001/api/trigger-digest
```

This endpoint is automatically disabled in production.

### Testing Without Twitter
To test the app without connecting Twitter:
1. Comment out Twitter connection checks in backend
2. Use mock data for timeline
3. Focus on email delivery and UI testing

### Customizing Email Template
Edit `backend/services/emailService.js` → `generateDigestEmailHTML()` function to customize:
- HTML structure
- Styling
- Content formatting
- Additional sections

## 📝 Environment Variables Reference

### Backend Required Variables
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key (safe for client)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (backend only)
- `TWITTER_API_KEY` - Twitter API key
- `TWITTER_API_SECRET` - Twitter API secret
- `TWITTER_BEARER_TOKEN` - Twitter bearer token
- `TWITTER_CLIENT_ID` - Twitter OAuth 2.0 client ID
- `TWITTER_CLIENT_SECRET` - Twitter OAuth 2.0 client secret
- `RESEND_API_KEY` - Resend API key for sending emails
- `FROM_EMAIL` - Email address to send from

### Backend Optional Variables
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `DIGEST_CRON_SCHEDULE` - Cron schedule (default: 0 8 * * *)

### Frontend Required Variables
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_API_URL` - Backend API URL (default: http://localhost:3001)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Twitter API for timeline access
- Supabase for authentication and database
- Resend for reliable email delivery
- The open-source community

## 📧 Support

If you encounter any issues or have questions:
1. Check the Troubleshooting section above
2. Review the documentation
3. Open an issue on GitHub

---

Built with ❤️ by developers who love Twitter but also love sleep
