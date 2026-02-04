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
