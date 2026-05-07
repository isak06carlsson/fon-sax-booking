# Fön Sax Booking System

A modern booking system for hair salon appointments built with React, TypeScript, and PostgreSQL.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, React Query, Shadcn UI
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (local or managed, recommended: Render PostgreSQL)
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
│   │   │   ├── connection.ts    # PostgreSQL pool connection
│   │   │   └── init.ts          # Database schema initialization
│   │   └── types/
│   │       └── index.ts         # TypeScript types
│   └── package.json
└── MIGRATION.md                 # Migration notes
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm/bun
- PostgreSQL database (or managed database URL)
- Port 3001 for backend
- Port 8080 for frontend

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

3. **Start PostgreSQL with Docker**
```bash
docker compose up -d
```

4. **Initialize database**
```bash
cd backend
npm run db:init
cd ..
```

5. **Configure backend env**
Create/update `backend/.env` with:

```env
PORT=3001
FRONTEND_URL=http://localhost:8080
NODE_ENV=development
ADMIN_PASSWORD=change-me
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fonsax
```

The PostgreSQL container uses the same credentials and database name, so this connection string works as-is when Docker is running.

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

Frontend: http://localhost:8080
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
FRONTEND_URL=http://localhost:8080
NODE_ENV=development
ADMIN_PASSWORD=change-me
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fonsax
```

See `.env.example` files for reference.

## Database

Bookings are stored in PostgreSQL.

For production hosting, use a managed PostgreSQL provider (Render PostgreSQL recommended).

**Bookings Table Schema:**
- `id` (UUID, PK)
- `stylist` (TEXT)
- `date` (DATE)
- `time` (TEXT, HH:MM)
- `customer_name` (TEXT)
- `customer_phone` (TEXT)
- `created_at` (TIMESTAMPTZ)
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

## Hosting

Recommended setup:
- Frontend: Render Static Site
- Backend: Render Web Service
- Database: Render PostgreSQL

Set these in production:
- Frontend `VITE_API_URL=https://<backend-domain>/api`
- Backend `FRONTEND_URL=https://<frontend-domain>`
- Backend `DATABASE_URL=<render-postgres-url>`
- Backend `ADMIN_PASSWORD=<secure-password>`

## Admin Credentials

**Default password in local example**: `fonsax2026`

⚠️ Change this in production!

## License

MIT

