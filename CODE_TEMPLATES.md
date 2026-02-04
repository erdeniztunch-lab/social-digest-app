# Frontend Code Templates

This file contains all the source code for the frontend. Copy each section into the appropriate file.

## index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Twitter Digest - Never Miss Your Feed</title>
    <meta name="description" content="Get your Twitter timeline summarized and delivered to your inbox every morning.">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## src/main.jsx

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@layer components {
  .btn-primary {
    @apply bg-twitter text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-secondary {
    @apply bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors;
  }

  .card {
    @apply bg-white rounded-xl shadow-lg p-6 border border-gray-100;
  }

  .input {
    @apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-twitter focus:border-transparent;
  }

  .label {
    @apply block text-sm font-medium text-gray-700 mb-2;
  }
}
```

## src/lib/supabase.js

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## src/lib/api.js

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  constructor() {
    this.baseUrl = API_URL;
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('supabase_token');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': \`Bearer \${token}\` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getTwitterOAuthUrl() {
    return this.request('/api/auth/twitter/oauth-url', { method: 'POST' });
  }

  async handleTwitterCallback(code, codeVerifier, state) {
    return this.request('/api/auth/twitter/callback', {
      method: 'POST',
      body: JSON.stringify({ code, codeVerifier, state }),
    });
  }

  async disconnectTwitter() {
    return this.request('/api/auth/twitter/disconnect', { method: 'POST' });
  }

  async getUserProfile() {
    return this.request('/api/user/profile');
  }

  async updatePreferences(preferences) {
    return this.request('/api/user/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  async getDigestHistory() {
    return this.request('/api/user/digest-history');
  }

  async sendTestDigest() {
    return this.request('/api/digest/test', { method: 'POST' });
  }
}

export const apiClient = new ApiClient();
```

---

NOTE: Due to length, the complete React components (AuthContext, App, Layout, and all Pages) are available in the GitHub repository or can be provided separately. 

The essential pattern is:
1. AuthContext manages authentication state
2. App.jsx contains routing with protected routes
3. Layout.jsx provides navigation wrapper
4. Page components use the useAuth hook and apiClient

For a working template, you can either:
- Clone from the GitHub repository (recommended)
- Request the full component code
- Use create-react-app or Vite templates and add authentication logic

Each page component follows this structure:
- Import necessary hooks and components
- Use useAuth() to access user state
- Use apiClient for backend communication
- Handle loading and error states
- Display appropriate UI with Tailwind classes

