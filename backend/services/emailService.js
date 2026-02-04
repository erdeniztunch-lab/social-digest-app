import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendDigestEmail = async (to, subject, html) => {
  try {
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Twitter Digest <noreply@yourdomain.com>',
      to: [to],
      subject: subject,
      html: html,
    });
    console.log('✅ Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

export const generateDigestEmailHTML = (tweets, userName, preferences) => {
  const greeting = getGreeting();
  return \`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Twitter Digest</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
    .container { background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { border-bottom: 3px solid #1DA1F2; padding-bottom: 20px; margin-bottom: 30px; }
    h1 { color: #1DA1F2; margin: 0 0 10px 0; font-size: 28px; }
    .greeting { color: #666; font-size: 16px; }
    .tweet-card { background-color: #f9f9f9; border-left: 4px solid #1DA1F2; padding: 20px; margin-bottom: 20px; border-radius: 8px; }
    .tweet-author { font-weight: bold; color: #1a1a1a; margin-bottom: 8px; font-size: 16px; }
    .tweet-text { color: #333; margin-bottom: 12px; font-size: 15px; }
    .tweet-meta { color: #888; font-size: 13px; display: flex; gap: 15px; }
    .tweet-link { color: #1DA1F2; text-decoration: none; font-weight: 500; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888; font-size: 13px; }
    .stats { background-color: #e8f5fd; padding: 15px; border-radius: 8px; margin-bottom: 25px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐦 Your Twitter Digest</h1>
      <p class="greeting">\${greeting}, \${userName || 'there'}!</p>
    </div>
    <div class="stats">
      <span><strong>\${tweets.length}</strong> tweets from the last 24 hours</span>
    </div>
    \${tweets.length === 0 ? '<p style="text-align: center; color: #888; padding: 40px 0;">No new tweets in the last 24 hours.</p>' : tweets.map(tweet => \`
      <div class="tweet-card">
        <div class="tweet-author">@\${tweet.author_username || 'unknown'}</div>
        <div class="tweet-text">\${tweet.text}</div>
        <div class="tweet-meta">
          <span>❤️ \${tweet.like_count || 0}</span>
          <span>🔄 \${tweet.retweet_count || 0}</span>
          <span>💬 \${tweet.reply_count || 0}</span>
          \${tweet.tweet_id ? \`<a href="https://twitter.com/i/web/status/\${tweet.tweet_id}" class="tweet-link">View Tweet →</a>\` : ''}
        </div>
      </div>
    \`).join('')}
    <div class="footer">
      <p>You're receiving this because you signed up for Twitter Digest.</p>
      <p><a href="\${process.env.FRONTEND_URL}/settings" style="color: #1DA1F2;">Update Settings</a></p>
    </div>
  </div>
</body>
</html>
  \`;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};
