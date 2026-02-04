import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { generateDigestForUser } from '../services/digestService.js';
import { supabaseAdmin } from '../config/supabase.js';

const router = express.Router();

router.post('/test', authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (!user.twitter_access_token) {
      return res.status(400).json({ success: false, error: 'Twitter account not connected' });
    }

    const result = await generateDigestForUser(user);
    res.json({ 
      success: result.success, 
      message: result.success ? 'Test digest sent successfully' : 'Failed to send test digest',
      error: result.error 
    });
  } catch (error) {
    console.error('Error sending test digest:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
