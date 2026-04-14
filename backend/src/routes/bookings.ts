import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/connection.js';
import type { Booking, CreateBookingInput } from '../types/index.js';

const router = Router();

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const isPgUniqueViolation = (error: unknown): boolean => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === '23505'
  );
};

// Get all bookings (for admin)
router.get('/bookings', async (req, res) => {
  try {
    const result = await query<Booking>(
      'SELECT id, stylist, service, date::text AS date, time, customer_name, customer_phone, created_at::text AS created_at FROM bookings ORDER BY date ASC, time ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings', code: 'INTERNAL_ERROR' });
  }
});

// Get bookings for a specific stylist and date
router.get('/bookings/stylist/:stylist/date/:date', async (req, res) => {
  const { stylist, date } = req.params;

  if (!DATE_REGEX.test(date)) {
    res.status(400).json({ error: 'Invalid date format', code: 'INVALID_DATE' });
    return;
  }

  try {
    const result = await query<{ time: string }>(
      'SELECT time FROM bookings WHERE stylist = $1 AND date = $2::date',
      [stylist, date]
    );
    res.json(result.rows.map((row) => row.time.trim()));
  } catch (error) {
    console.error('Error fetching booked times:', error);
    res.status(500).json({ error: 'Failed to fetch booked times', code: 'INTERNAL_ERROR' });
  }
});

// Create a new booking
router.post('/bookings', async (req, res) => {
  const { stylist, service, date, time, customer_name, customer_phone }: CreateBookingInput = req.body;

  // Validate input
  if (!stylist || !service || !date || !time || !customer_name || !customer_phone) {
    res.status(400).json({ error: 'Missing required fields', code: 'VALIDATION_ERROR' });
    return;
  }

  if (!DATE_REGEX.test(date)) {
    res.status(400).json({ error: 'Invalid date format', code: 'INVALID_DATE' });
    return;
  }

  if (!TIME_REGEX.test(time)) {
    res.status(400).json({ error: 'Invalid time format', code: 'INVALID_TIME' });
    return;
  }

  const id = uuidv4();
  const created_at = new Date().toISOString();
  const trimmedName = customer_name.trim();
  const trimmedPhone = customer_phone.trim();

  try {
    await query(
      'INSERT INTO bookings (id, stylist, service, date, time, customer_name, customer_phone, created_at) VALUES ($1, $2, $3, $4::date, $5, $6, $7, $8::timestamptz)',
      [id, stylist, service, date, time, trimmedName, trimmedPhone, created_at]
    );

    res.status(201).json({
      id,
      stylist,
      service,
      date,
      time,
      customer_name: trimmedName,
      customer_phone: trimmedPhone,
      created_at,
    });
  } catch (error) {
    if (isPgUniqueViolation(error)) {
      res.status(409).json({ error: 'Time slot already booked', code: 'TIME_SLOT_TAKEN' });
      return;
    }

    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking', code: 'INTERNAL_ERROR' });
  }
});

// Delete a booking
router.delete('/bookings/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM bookings WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Booking not found', code: 'NOT_FOUND' });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Failed to delete booking', code: 'INTERNAL_ERROR' });
  }
});

// Admin login endpoint
router.post('/admin/login', (req, res) => {
  const { password } = req.body;

  if (!password) {
    res.status(400).json({ error: 'Password required', code: 'VALIDATION_ERROR' });
    return;
  }

  const adminPassword = process.env.ADMIN_PASSWORD || 'fonsax2024';

  if (password === adminPassword) {
    // Create a simple token (in production, use JWT)
    const token = Buffer.from(`admin:${Date.now()}`).toString('base64');
    res.json({ success: true, token });
  } else {
    res.status(401).json({ error: 'Invalid password', code: 'INVALID_CREDENTIALS' });
  }
});

export default router;
