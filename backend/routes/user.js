import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      twitter_username: user.twitter_username,
      twitter_connected: !!user.twitter_access_token,
      digest_enabled: user.digest_enabled,
      preferences: user.preferences,
      created_at: user.created_at,
    };

    res.json({ success: true, user: safeUser });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const { digest_enabled, preferences } = req.body;
    const updates = {};
    
    if (typeof digest_enabled === 'boolean') {
      updates.digest_enabled = digest_enabled;
    }

    if (preferences) {
      const validPreferences = {};
      if (preferences.detail_level && ['low', 'medium', 'high'].includes(preferences.detail_level)) {
        validPreferences.detail_level = preferences.detail_level;
      }
      if (preferences.digest_time) {
        validPreferences.digest_time = preferences.digest_time;
      }
      if (preferences.language) {
        validPreferences.language = preferences.language;
      }
      updates.preferences = validPreferences;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'No valid updates provided' });
    }

    updates.updated_at = new Date().toISOString();

    const { error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', req.user.id);

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/digest-history', authenticateToken, async (req, res) => {
  try {
    const { data: logs, error } = await supabaseAdmin
      .from('digest_logs')
      .select('*')
      .eq('user_id', req.user.id)
      .order('sent_at', { ascending: false })
      .limit(30);

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, logs });
  } catch (error) {
    console.error('Error fetching digest history:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
