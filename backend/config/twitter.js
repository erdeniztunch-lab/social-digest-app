import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

// OAuth 2.0 client for user authentication
export const getTwitterOAuthClient = () => {
  return new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
  });
};

// Get user-specific client with access tokens
export const getUserTwitterClient = (accessToken, accessSecret) => {
  return new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: accessToken,
    accessSecret: accessSecret,
  });
};

// Bearer token client for app-only auth
export const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
