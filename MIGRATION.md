# Migration from Supabase to SQLite - Complete Guide

This document outlines the changes made to migrate from Supabase PostgreSQL to a local SQLite database with an Express.js backend.

## What Changed

### Backend Setup
- **New**: Express.js server (backend folder)
- **New**: SQLite3 database
- **New**: REST API endpoints for bookings
- **New**: Polling-based real-time updates

### Frontend Changes
- **Removed**: Supabase client dependency
- **Updated**: BookingPage.tsx - Now uses API client
- **Updated**: AdminPage.tsx - Now uses API client
- **Changed**: Real-time updates from Supabase subscriptions to polling

### Database
- **Changed**: PostgreSQL → SQLite
- **Moved**: Database schema migration to backend
- **Same**: Booking table structure (id, stylist, date, time, customer_name, customer_phone, created_at)

## Installation & Setup

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Initialize Database
```bash
npm run db:init
```
This creates the SQLite database file at `backend/bookings.db`

### 3. Start Backend DevServer
```bash
npm run dev
# Or from root: npm run dev:backend
```
Backend runs on `http://localhost:3001`

### 4. Start Frontend DevServer (in new terminal)
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

### 5. Run Both Concurrently (from root)
```bash
npm run dev:full
```
Requires `concurrently` package - install if needed:
```bash
npm install -D concurrently
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
```

### Backend (.env)
```
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## API Endpoints

### GET /api/bookings
Get all bookings (admin use)

### GET /api/bookings/stylist/:stylist/date/:date
Get available time slots for a specific stylist and date

### POST /api/bookings
Create a new booking
```json
{
  "stylist": "Ibbe",
  "date": "2024-03-27",
  "time": "10:00",
  "customer_name": "John Doe",
  "customer_phone": "0712345678"
}
```

### DELETE /api/bookings/:id
Delete a booking

## Real-Time Updates

**Before**: Supabase real-time subscriptions
**After**: Polling with 5-second intervals

The frontend polls for updated bookings every 5 seconds to keep slots synchronized across tabs and devices.

## Database File

The SQLite database is stored at:
```
backend/bookings.db
```

This file is automatically created on first run. Make sure to:
- Back it up before deploying
- Add it to `.gitignore` (already done)
- Include it in your deployment package

## Production Considerations

For production:
1. Change `FRONTEND_URL` and `VITE_API_URL` to your production URLs
2. Consider using a database with better concurrency (PostgreSQL with sqlite connection)
3. Implement proper API authentication
4. Add rate limiting
5. Consider a database backup strategy
6. Use environment-specific configurations

## Testing the Migration

1. Start both servers
2. Create a booking - should save to SQLite
3. Refresh page - booking should appear (polling)
4. Go to admin page - should see the booking
5. Delete from admin - booking disappears

## Troubleshooting

### Database connection error
- Make sure port 3001 is not in use
- Check that backend/.env is properly configured

### API calls failing from frontend
- Verify VITE_API_URL is correct in .env
- Check CORS configuration in backend (api allows localhost:5173)
- Check browser console for detailed errors

### Time slots not updating
- Verify polling is working (check Network tab in DevTools)
- Ensure API endpoint is returning correct format (array of times)

## Rollback to Supabase

If you need to revert:
1. Restore old package.json with @supabase/supabase-js
2. Restore .env with Supabase credentials
3. Restore original BookingPage.tsx and AdminPage.tsx from git history
4. Run `npm install`
