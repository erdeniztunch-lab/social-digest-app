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
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  }

  getTwitterOAuthUrl() {
    return this.request('/api/auth/twitter/oauth-url', { method: 'POST' });
  }

  handleTwitterCallback(code, codeVerifier, state) {
    return this.request('/api/auth/twitter/callback', {
      method: 'POST',
      body: JSON.stringify({ code, codeVerifier, state }),
    });
  }

  disconnectTwitter() {
    return this.request('/api/auth/twitter/disconnect', { method: 'POST' });
  }

  getUserProfile() {
    return this.request('/api/user/profile');
  }

  updatePreferences(preferences) {
    return this.request('/api/user/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  getDigestHistory() {
    return this.request('/api/user/digest-history');
  }

  sendTestDigest() {
    return this.request('/api/digest/test', { method: 'POST' });
  }
}

export const apiClient = new ApiClient();
