# Project Structure

```
twitter-digest-app/
├── backend/                      # Node.js + Express backend
│   ├── config/                   # Configuration files
│   │   ├── supabase.js          # Supabase client setup
│   │   └── twitter.js           # Twitter API client setup
│   ├── middleware/              # Express middleware
│   │   └── auth.js              # JWT authentication middleware
│   ├── routes/                  # API route handlers
│   │   ├── auth.js              # Twitter OAuth routes
│   │   ├── user.js              # User management routes
│   │   └── digest.js            # Digest operation routes
│   ├── services/                # Business logic
│   │   ├── twitterService.js    # Twitter API operations
│   │   ├── emailService.js      # Email sending with Resend
│   │   └── digestService.js     # Digest generation logic
│   ├── server.js                # Express server entry point
│   ├── package.json             # Backend dependencies
│   ├── .env.example             # Environment variables template
│   └── .gitignore              # Backend gitignore
│
├── frontend/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/          # React components
│   │   │   └── Layout.jsx       # Main layout wrapper
│   │   ├── contexts/            # React contexts
│   │   │   └── AuthContext.jsx  # Authentication state
│   │   ├── lib/                 # Utility libraries
│   │   │   ├── supabase.js      # Supabase client
│   │   │   └── api.js           # Backend API client
│   │   ├── pages/               # Page components
│   │   │   ├── LandingPage.jsx          # Marketing landing
│   │   │   ├── LoginPage.jsx            # User login
│   │   │   ├── SignupPage.jsx           # User registration
│   │   │   ├── DashboardPage.jsx        # Main dashboard
│   │   │   ├── SettingsPage.jsx         # User settings
│   │   │   └── TwitterCallbackPage.jsx  # OAuth callback
│   │   ├── App.jsx              # Main app with routing
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global styles (Tailwind)
│   ├── public/                  # Static assets
│   ├── index.html               # HTML template
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS config
│   ├── postcss.config.js        # PostCSS config
│   ├── .env.example             # Environment variables template
│   └── .gitignore              # Frontend gitignore
│
├── database/                    # Database scripts
│   └── schema.sql              # Supabase table schemas
│
├── README.md                    # Main documentation
├── QUICKSTART.md               # Quick setup guide
├── FRONTEND-SETUP.md           # Frontend setup details
├── CODE_TEMPLATES.md           # Code snippets for frontend
├── PROJECT_STRUCTURE.md        # This file
├── setup.sh                    # Automated setup script
└── .gitignore                  # Root gitignore

```

## File Descriptions

### Backend Files

- **server.js**: Main Express server with cron job setup
- **config/**: Database and API client configurations
- **middleware/auth.js**: Verifies JWT tokens from Supabase
- **routes/**: Express route handlers for different features
  - auth.js: Twitter OAuth flow (connect/disconnect)
  - user.js: User profile and preferences management
  - digest.js: Manual digest operations
- **services/**: Business logic separated from routes
  - twitterService.js: Fetch and process tweets
  - emailService.js: Send emails via Resend
  - digestService.js: Orchestrate digest generation

### Frontend Files

- **main.jsx**: React application entry point
- **App.jsx**: Main component with React Router setup
- **contexts/AuthContext.jsx**: Global authentication state
- **lib/**: Utility functions
  - supabase.js: Supabase client instance
  - api.js: Backend API wrapper class
- **components/Layout.jsx**: Navigation and page wrapper
- **pages/**: Individual page components
  - LandingPage: Public marketing page
  - Login/Signup: Authentication pages
  - Dashboard: Main user interface
  - Settings: User preferences
  - TwitterCallback: OAuth redirect handler

### Database

- **schema.sql**: PostgreSQL tables, indexes, RLS policies

### Documentation

- **README.md**: Complete project documentation
- **QUICKSTART.md**: Fast setup guide
- **FRONTEND-SETUP.md**: Detailed frontend instructions
- **CODE_TEMPLATES.md**: Copy-paste code snippets
- **PROJECT_STRUCTURE.md**: This file

## Key Technologies

- **Backend**: Node.js, Express, Supabase, Twitter API v2, Resend
- **Frontend**: React, Vite, Tailwind CSS, React Router
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth + Twitter OAuth 2.0
- **Scheduling**: node-cron

## Data Flow

1. User signs up → Supabase creates auth record
2. User connects Twitter → OAuth flow stores tokens
3. Cron job runs daily → Fetches all enabled users
4. For each user → Fetch timeline, filter, sort
5. Generate HTML email → Send via Resend
6. Log result → Store in digest_logs table

