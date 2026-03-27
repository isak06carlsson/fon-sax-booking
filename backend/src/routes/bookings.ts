import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/connection.js';
import type { Booking, CreateBookingInput } from '../types/index.js';

const router = Router();

// Get all bookings (for admin)
router.get('/bookings', (req, res) => {
  db.all(
    'SELECT * FROM bookings ORDER BY date ASC, time ASC',
    (err: Error | null, rows: Booking[]) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows || []);
      }
    }
  );
});

// Get bookings for a specific stylist and date
router.get('/bookings/stylist/:stylist/date/:date', (req, res) => {
  const { stylist, date } = req.params;

  db.all(
    'SELECT time FROM bookings WHERE stylist = ? AND date = ?',
    [stylist, date],
    (err: Error | null, rows: Array<{ time: string }>) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        const times = (rows || []).map(b => b.time.trim());
        res.json(times);
      }
    }
  );
});

// Create a new booking
router.post('/bookings', (req, res) => {
  const { stylist, date, time, customer_name, customer_phone }: CreateBookingInput = req.body;

  // Validate input
  if (!stylist || !date || !time || !customer_name || !customer_phone) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const id = uuidv4();
  const created_at = new Date().toISOString();

  db.run(
    'INSERT INTO bookings (id, stylist, date, time, customer_name, customer_phone, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, stylist, date, time, customer_name.trim(), customer_phone.trim(), created_at],
    function(err: Error | null) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          res.status(409).json({ error: 'Time slot already booked' });
        } else {
          res.status(500).json({ error: err.message });
        }
      } else {
        res.status(201).json({
          id,
          stylist,
          date,
          time,
          customer_name: customer_name.trim(),
          customer_phone: customer_phone.trim(),
          created_at,
        });
      }
    }
  );
});

// Delete a booking
router.delete('/bookings/:id', (req, res) => {
  const { id } = req.params;

  db.run(
    'DELETE FROM bookings WHERE id = ?',
    [id],
    function(err: Error | null) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ success: true });
      }
    }
  );
});

// Admin login endpoint
router.post('/admin/login', (req, res) => {
  const { password } = req.body;

  if (!password) {
    res.status(400).json({ error: 'Password required' });
    return;
  }

  const adminPassword = process.env.ADMIN_PASSWORD || 'fonsax2024';

  if (password === adminPassword) {
    // Create a simple token (in production, use JWT)
    const token = Buffer.from(`admin:${Date.now()}`).toString('base64');
    res.json({ success: true, token });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

export default router;
