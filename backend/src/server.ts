import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bookingsRouter from './routes/bookings.js';
import db from './db/connection.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Vite uses 8080 in this repo; 5173 is the default Vite port elsewhere.
const devAllowedOrigins = [
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const isProduction = process.env.NODE_ENV === 'production';

// Function to cleanup expired bookings
const cleanupExpiredBookings = () => {
  const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD
  db.run(
    'DELETE FROM bookings WHERE date < ?',
    [today],
    function(err: Error | null) {
      if (err) {
        console.error('Error cleaning up expired bookings:', err);
      } else if (this.changes > 0) {
        console.log(`Cleaned up ${this.changes} expired booking(s)`);
      }
    }
  );
};

// Run cleanup on server start
cleanupExpiredBookings();

// Run cleanup every hour
setInterval(cleanupExpiredBookings, 60 * 60 * 1000);

// Middleware
app.use(
  cors({
    origin: isProduction
      ? process.env.FRONTEND_URL || false
      : (origin, cb) => {
          if (!origin) return cb(null, true);
          if (devAllowedOrigins.includes(origin)) return cb(null, true);
          if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
            return cb(null, true);
          }
          return cb(null, false);
        },
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api', bookingsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
