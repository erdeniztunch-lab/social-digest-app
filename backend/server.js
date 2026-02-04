import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import digestRoutes from './routes/digest.js';
import { generateAndSendDigests } from './services/digestService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/digest', digestRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Cron job for daily digests
// Default: every day at 8 AM (0 8 * * *)
const cronSchedule = process.env.DIGEST_CRON_SCHEDULE || '0 8 * * *';
cron.schedule(cronSchedule, async () => {
  console.log('🕐 Running scheduled digest generation...');
  try {
    await generateAndSendDigests();
    console.log('✅ Scheduled digest generation completed');
  } catch (error) {
    console.error('❌ Error in scheduled digest generation:', error);
  }
});

// Manual trigger endpoint for testing (remove in production)
if (process.env.NODE_ENV === 'development') {
  app.post('/api/trigger-digest', async (req, res) => {
    try {
      await generateAndSendDigests();
      res.json({ success: true, message: 'Digest generation triggered' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📅 Digest cron schedule: ${cronSchedule}`);
});
