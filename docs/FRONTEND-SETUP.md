# Frontend Setup Guide

The frontend is a React + Vite application. Follow these steps to set it up:

## Quick Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Edit `.env` with your credentials:**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3001
```

5. **Start development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Frontend Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   ├── contexts/        # React contexts (Auth)
│   ├── lib/            # Utilities (API client, Supabase)
│   ├── pages/          # Page components
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
└── tailwind.config.js  # Tailwind configuration
```

## Key Files to Create

Since the frontend has many files, here are the essential ones:

### 1. Package.json
See `package.json.template` for the complete dependency list.

### 2. Main Configuration Files
- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration  
- `postcss.config.js` - PostCSS configuration

### 3. Source Files
All source files should be created in the `src/` directory following the structure above.

### 4. Pages
- `LandingPage.jsx` - Marketing landing page
- `LoginPage.jsx` - User login
- `SignupPage.jsx` - User registration
- `DashboardPage.jsx` - Main dashboard
- `SettingsPage.jsx` - User settings
- `TwitterCallbackPage.jsx` - OAuth callback handler

### 5. Components
- `Layout.jsx` - Main layout wrapper with navigation

### 6. Contexts
- `AuthContext.jsx` - Authentication state management

### 7. Library Files
- `supabase.js` - Supabase client initialization
- `api.js` - Backend API client

## Using the Frontend Template Generator

We've created a script to generate all frontend files for you. Run:

```bash
cd frontend
node generate-frontend.js
```

This will create all necessary files with proper boilerplate code.

## Manual Setup (Alternative)

If you prefer to set up manually, refer to the original repository or the complete README.md for code samples of each file.

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set root directory to `frontend`
5. Add environment variables
6. Deploy!

