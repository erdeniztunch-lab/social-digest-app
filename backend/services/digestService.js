import { supabaseAdmin } from '../config/supabase.js';
import { getUserTimeline, filterTweetsByTime, sortTweetsByEngagement, limitTweetsByPreference } from './twitterService.js';
import { sendDigestEmail, generateDigestEmailHTML } from './emailService.js';

export const generateAndSendDigests = async () => {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('digest_enabled', true)
      .not('twitter_access_token', 'is', null);

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    console.log(\`📧 Processing digests for \${users.length} users...\`);

    for (const user of users) {
      try {
        await generateDigestForUser(user);
      } catch (error) {
        console.error(\`Error generating digest for user \${user.id}:\`, error);
      }
    }

    console.log('✅ All digests processed');
  } catch (error) {
    console.error('Error in generateAndSendDigests:', error);
    throw error;
  }
};

export const generateDigestForUser = async (user) => {
  try {
    console.log(\`🔄 Generating digest for user: \${user.email}\`);

    const { success, tweets } = await getUserTimeline(
      user.twitter_access_token,
      user.twitter_access_secret,
      user.twitter_user_id
    );

    if (!success) {
      console.error(\`Failed to fetch timeline for user \${user.id}\`);
      return;
    }

    const recentTweets = filterTweetsByTime(tweets, 24);
    const sortedTweets = sortTweetsByEngagement(recentTweets);
    const preferences = user.preferences || {};
    const finalTweets = limitTweetsByPreference(sortedTweets, preferences.detail_level);

    console.log(\`📊 Found \${finalTweets.length} tweets for \${user.email}\`);

    const emailHTML = generateDigestEmailHTML(
      finalTweets,
      user.twitter_username || user.email.split('@')[0],
      preferences
    );

    const emailSubject = \`Your Twitter Digest - \${new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })}\`;

    const result = await sendDigestEmail(user.email, emailSubject, emailHTML);

    if (result.success) {
      await supabaseAdmin.from('digest_logs').insert({
        user_id: user.id,
        tweet_count: finalTweets.length,
        sent_at: new Date().toISOString(),
        status: 'sent',
      });
      console.log(\`✅ Digest sent to \${user.email}\`);
    } else {
      await supabaseAdmin.from('digest_logs').insert({
        user_id: user.id,
        tweet_count: 0,
        sent_at: new Date().toISOString(),
        status: 'failed',
        error_message: result.error,
      });
      console.log(\`❌ Failed to send digest to \${user.email}\`);
    }

    return result;
  } catch (error) {
    console.error(\`Error generating digest for user \${user.id}:\`, error);
    throw error;
  }
};
