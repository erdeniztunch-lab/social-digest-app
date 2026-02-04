#!/bin/bash

# Twitter Digest App - Complete Setup Script
# This script creates all necessary project files

echo "🚀 Setting up Twitter Digest App..."
echo ""

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p backend/{config,middleware,routes,services}
mkdir -p frontend/src/{components,contexts,lib,pages,public}
mkdir -p database

# Create backend files
echo "🔧 Creating backend files..."

# user.js routes
cat > backend/routes/user.js << 'USERJS'
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
USERJS

# digest.js routes
cat > backend/routes/digest.js << 'DIGESTJS'
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
DIGESTJS

echo "✅ Backend route files created"

# Create backend services
echo "🔧 Creating backend services..."

# twitterService.js
cat > backend/services/twitterService.js << 'TWITTERSERVICE'
import { getUserTwitterClient } from '../config/twitter.js';

export const getUserTimeline = async (accessToken, accessSecret, userId) => {
  try {
    const client = getUserTwitterClient(accessToken, accessSecret);
    const timeline = await client.v2.homeTimeline({
      max_results: 100,
      'tweet.fields': ['created_at', 'public_metrics', 'author_id'],
      'user.fields': ['username', 'name'],
      expansions: ['author_id'],
    });

    const tweets = [];
    for await (const tweet of timeline) {
      const author = timeline.includes?.users?.find(u => u.id === tweet.author_id);
      tweets.push({
        tweet_id: tweet.id,
        text: tweet.text,
        author_id: tweet.author_id,
        author_username: author?.username,
        author_name: author?.name,
        created_at: tweet.created_at,
        like_count: tweet.public_metrics?.like_count || 0,
        retweet_count: tweet.public_metrics?.retweet_count || 0,
        reply_count: tweet.public_metrics?.reply_count || 0,
      });
    }

    return { success: true, tweets };
  } catch (error) {
    console.error('Error fetching timeline:', error);
    return { success: false, error: error.message, tweets: [] };
  }
};

export const filterTweetsByTime = (tweets, hours = 24) => {
  const cutoffTime = new Date();
  cutoffTime.setHours(cutoffTime.getHours() - hours);
  return tweets.filter(tweet => {
    const tweetTime = new Date(tweet.created_at);
    return tweetTime > cutoffTime;
  });
};

export const sortTweetsByEngagement = (tweets) => {
  return tweets.sort((a, b) => {
    const scoreA = (a.like_count || 0) + (a.retweet_count || 0) * 2 + (a.reply_count || 0);
    const scoreB = (b.like_count || 0) + (b.retweet_count || 0) * 2 + (b.reply_count || 0);
    return scoreB - scoreA;
  });
};

export const limitTweetsByPreference = (tweets, detailLevel = 'medium') => {
  const limits = { low: 5, medium: 15, high: 30 };
  const limit = limits[detailLevel] || limits.medium;
  return tweets.slice(0, limit);
};
TWITTERSERVICE

echo "✅ Twitter service created"
echo ""
echo "⚠️  Note: Some files still need to be created manually:"
echo "  - backend/services/emailService.js"
echo "  - backend/services/digestService.js"
echo "  - All frontend files"
echo "  - database/schema.sql"
echo ""
echo "📖 Please refer to README.md for complete setup instructions"
echo ""
echo "✨ Basic structure created successfully!"
