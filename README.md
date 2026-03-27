# Fön Sax Booking System

A modern booking system for hair salon appointments built with React, TypeScript, and SQLite.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, React Query, Shadcn UI
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Styling**: Tailwind CSS
- **Routing**: React Router v6

## Project Structure

```
├── src/                          # Frontend source
│   ├── pages/
│   │   ├── BookingPage.tsx      # Customer booking interface
│   │   ├── AdminPage.tsx        # Admin booking management
│   │   └── ...
│   ├── integrations/
│   │   └── api/client.ts        # API client (replaces Supabase)
│   ├── components/              # React components
│   └── ...
├── backend/                      # Backend server
│   ├── src/
│   │   ├── server.ts            # Express server entry
│   │   ├── routes/
│   │   │   └── bookings.ts      # Booking API endpoints
│   │   ├── db/
│   │   │   ├── connection.ts    # SQLite connection
│   │   │   └── init.ts          # Database initialization
│   │   └── types/
│   │       └── index.ts         # TypeScript types
│   ├── bookings.db              # SQLite database (auto-created)
│   └── package.json
└── MIGRATION.md                 # Supabase to SQLite migration guide
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm/bun
- Port 3001 for backend
- Port 5173 for frontend

### Installation

1. **Install root dependencies**
```bash
npm install
```

2. **Install backend dependencies**
```bash
cd backend
npm install
cd ..
```

3. **Initialize database**
```bash
cd backend
npm run db:init
cd ..
```

### Running the Application

**Option 1: Start both servers in one command**
```bash
npm install -D concurrently  # if not already installed
npm run dev:full
```

**Option 2: Start servers separately**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:backend
```

Frontend: http://localhost:5173
Backend: http://localhost:3001

## Features

### Customer Booking
- Select stylist (Ibbe, Wiliam)
- Pick date and available time slot
- Enter contact information
- Real-time slot availability via polling
- Booking confirmation

### Admin Panel
- Password-protected admin interface
- View all bookings
- Delete bookings
- Real-time sync across tabs

## API Endpoints

All endpoints prefixed with `/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bookings` | Get all bookings |
| GET | `/bookings/stylist/:stylist/date/:date` | Get available slots |
| POST | `/bookings` | Create booking |
| DELETE | `/bookings/:id` | Delete booking |

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

See `.env.example` files for reference.

## Database

SQLite database is automatically created at `backend/bookings.db` on first run.

**Bookings Table Schema:**
- `id` (UUID, PK)
- `stylist` (TEXT)
- `date` (TEXT, YYYY-MM-DD)
- `time` (TEXT, HH:MM)
- `customer_name` (TEXT)
- `customer_phone` (TEXT)
- `created_at` (TIMESTAMP)
- UNIQUE constraint on (stylist, date, time)

## Development

### Build
```bash
npm run build          # Frontend only
cd backend && npm run build
```

### Lint
```bash
npm run lint
```

### Tests
```bash
npm run test          # Run once
npm run test:watch   # Watch mode
```

## Production Deployment

See [MIGRATION.md](./MIGRATION.md#production-considerations) for production deployment guidelines.

## Recent Changes

This project was recently migrated from Supabase to SQLite. See [MIGRATION.md](./MIGRATION.md) for detailed information about:
- What changed in the codebase
- Database migration details
- Real-time update strategy (polling)
- Troubleshooting guide

## Admin Credentials

**Default password**: `fonsax2024`

⚠️ Change this in production!

## License

MIT

