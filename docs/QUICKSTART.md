# 🚀 Quick Start Guide

Get Twitter Digest up and running in 15 minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## Step 1: Get API Credentials (10 minutes)

### Supabase
1. Go to [supabase.com](https://supabase.com) → Sign up
2. Create new project (wait 2 minutes for setup)
3. Go to SQL Editor → New query
4. Copy & paste contents of `database/schema.sql`
5. Click "Run"
6. Go to Settings → API
7. Copy these values:
   - Project URL
   - anon/public key
   - service_role key

### Twitter Developer
1. Go to [developer.twitter.com](https://developer.twitter.com)
2. Create app (or use existing)
3. Go to app Settings
4. User authentication settings:
   - Turn ON OAuth 2.0
   - Type: Web App
   - Callback: `http://localhost:5173/auth/twitter/callback`
   - App permissions: Read
5. Go to "Keys and tokens"
6. Copy:
   - API Key & Secret
   - Bearer Token
   - Client ID & Secret

### Resend
1. Go to [resend.com](https://resend.com) → Sign up
2. Add domain OR use test domain
3. API Keys → Create new key
4. Copy the API key

## Step 2: Backend Setup (2 minutes)

```bash
cd backend

# Install packages
npm install

# Setup environment
cp .env.example .env

# Edit .env - paste your credentials
nano .env  # or use your editor

# Start backend
npm run dev
```

Backend runs on: http://localhost:3001

Test it: `curl http://localhost:3001/health`

## Step 3: Frontend Setup (2 minutes)

```bash
cd frontend

# Install packages
npm install

# Setup environment
cp .env.example .env

# Edit .env
nano .env

# Start frontend
npm run dev
```

Frontend runs on: http://localhost:5173

## Step 4: Test the App (1 minute)

1. Open http://localhost:5173
2. Click "Get Started"
3. Create account with your email
4. Sign in
5. Click "Connect Twitter Account"
6. Authorize on Twitter
7. Back in app, click "Send Test Digest"
8. Check your email!

## Troubleshooting

### Backend won't start
- Check all `.env` variables are filled
- Ensure port 3001 is not in use
- Run `npm install` again

### Frontend won't start
- Check `.env` has correct values
- Ensure port 5173 is not in use
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

### Twitter connection fails
- Verify callback URL: `http://localhost:5173/auth/twitter/callback`
- Check OAuth 2.0 is enabled
- Ensure app has Read permissions

### Email not received
- Check Resend API key is correct
- If using test domain, email must be verified in Resend
- Check spam folder

### Database errors
- Ensure schema.sql was run in Supabase
- Check Supabase credentials in backend `.env`
- Verify service_role key (not anon key) is used

## What's Next?

1. **Customize Settings**: Go to Settings page, choose detail level
2. **Schedule**: Digests run at 8 AM daily (customize in backend `.env`)
3. **Deploy**: See README.md for deployment guides
4. **Customize Email**: Edit `backend/services/emailService.js`

## Daily Usage

Once set up:
- Digests automatically send at scheduled time
- Check Dashboard for history
- Adjust settings anytime
- Send test digests to preview

## Need Help?

- Check README.md for detailed docs
- Review TROUBLESHOOTING.md
- Check backend logs: Look at terminal running backend
- Check frontend console: Open browser DevTools

---

**Pro Tip**: Keep both terminals (backend & frontend) open while developing. Check logs if something breaks!

