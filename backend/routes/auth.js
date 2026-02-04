import express from 'express';
import { getTwitterOAuthClient } from '../config/twitter.js';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/twitter/oauth-url', authenticateToken, async (req, res) => {
  try {
    const client = getTwitterOAuthClient();
    const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
      `${process.env.FRONTEND_URL}/auth/twitter/callback`,
      { scope: ['tweet.read', 'users.read', 'offline.access'] }
    );

    res.json({ success: true, authUrl: url, codeVerifier, state });
  } catch (error) {
    console.error('Error generating OAuth URL:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/twitter/callback', authenticateToken, async (req, res) => {
  try {
    const { code, codeVerifier, state } = req.body;

    if (!code || !codeVerifier) {
      return res.status(400).json({ success: false, error: 'Missing parameters' });
    }

    const client = getTwitterOAuthClient();
    const { client: loggedClient, accessToken, refreshToken } = await client.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: `${process.env.FRONTEND_URL}/auth/twitter/callback`,
    });

    const { data: twitterUser } = await loggedClient.v2.me();

    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        twitter_user_id: twitterUser.id,
        twitter_username: twitterUser.username,
        twitter_access_token: accessToken,
        twitter_refresh_token: refreshToken,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.user.id);

    if (updateError) {
      console.error('Error updating user:', updateError);
      return res.status(500).json({ success: false, error: 'Failed to save Twitter credentials' });
    }

    res.json({ success: true, message: 'Twitter account connected successfully', twitterUsername: twitterUser.username });
  } catch (error) {
    console.error('Error in Twitter callback:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/twitter/disconnect', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        twitter_user_id: null,
        twitter_username: null,
        twitter_access_token: null,
        twitter_refresh_token: null,
        digest_enabled: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.user.id);

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, message: 'Twitter account disconnected' });
  } catch (error) {
    console.error('Error disconnecting Twitter:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
