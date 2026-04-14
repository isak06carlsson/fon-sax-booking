import 'dotenv/config';
import pool from './connection.js';

const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        stylist TEXT NOT NULL,
        service TEXT NOT NULL,
        date DATE NOT NULL,
        time TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(stylist, date, time)
      )
    `);

    console.log('Bookings table ready');
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

void initializeDatabase();
