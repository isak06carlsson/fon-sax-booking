# Developer Quick Reference

## Project Overview

Fön Sax Booking System - A hair salon appointment booking platform.
- Frontend: React 18 + TypeScript + Vite
- Backend: Express.js + Node.js
- Database: SQLite3
- Real-time: Polling (5-second intervals)

## Starting Development

```bash
# One command to start everything
npm run dev:full

# Or manually
npm run dev              # Terminal 1 - Frontend on :5173
npm run dev:backend     # Terminal 2 - Backend on :3001
```

## Key Files & Locations

### Frontend
- **Pages**: `src/pages/BookingPage.tsx`, `src/pages/AdminPage.tsx`
- **API Client**: `src/integrations/api/client.ts`
- **Components**: `src/components/`
- **Config**: `vite.config.ts`, `tsconfig.json`

### Backend
- **Server**: `backend/src/server.ts`
- **Routes**: `backend/src/routes/bookings.ts`
- **Database**: `backend/src/db/connection.ts`
- **Types**: `backend/src/types/index.ts`
- **Config**: `backend/tsconfig.json`, `backend/.env`

### Configuration
- **Frontend .env**: `VITE_API_URL` (API base URL)
- **Backend .env**: `PORT`, `FRONTEND_URL`, `NODE_ENV`
- **Database**: `backend/bookings.db` (auto-created, gitignored)

## Common Tasks

### Add New API Endpoint

1. Add function to `backend/src/routes/bookings.ts`:
```typescript
router.get('/bookings/custom', (req, res) => {
  // your logic
  db.all('SELECT * FROM bookings WHERE ...', (err, rows) => {
    res.json(rows);
  });
});
```

2. Add client function to `src/integrations/api/client.ts`:
```typescript
export const getCustomBookings = async () => {
  const response = await fetch(`${API_URL}/bookings/custom`);
  if (!response.ok) throw new Error('Failed');
  return response.json();
};
```

3. Use in component via React Query:
```typescript
const { data } = useQuery({
  queryKey: ['custom'],
  queryFn: getCustomBookings
});
```

### Modify Database Schema

1. Update `backend/src/db/init.ts`:
```typescript
db.run(`ALTER TABLE bookings ADD COLUMN new_field TEXT`)
```

2. Reinitialize:
```bash
cd backend && npm run db:init
```

⚠️ Note: Will lose existing data on schema changes

### Debug Polling

Check Network tab in DevTools:
- Look for `/api/bookings` requests every 5 seconds
- Verify response format (array of times or full bookings)
- Check for CORS errors

Adjust interval in `src/integrations/api/client.ts`:
```typescript
export const startPolling = (callback, intervalMs = 5000) // Change 5000
```

### Test API Endpoints

```bash
# Get all bookings
curl http://localhost:3001/api/bookings

# Get available times for Ibbe on date 2024-03-27
curl http://localhost:3001/api/bookings/stylist/Ibbe/date/2024-03-27

# Create booking
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"stylist":"Ibbe","date":"2024-03-27","time":"10:00","customer_name":"Test","customer_phone":"0712345678"}'

# Delete booking (replace ID)
curl -X DELETE http://localhost:3001/api/bookings/{booking_id}
```

## TypeScript Types

### Booking Type
```typescript
interface Booking {
  id: string;           // UUID
  stylist: string;      // "Ibbe" or "Wiliam"
  date: string;         // "YYYY-MM-DD"
  time: string;         // "HH:MM"
  customer_name: string;
  customer_phone: string;
  created_at: string;   // ISO timestamp
}
```

### Create Input
```typescript
interface CreateBookingInput {
  stylist: string;
  date: string;
  time: string;
  customer_name: string;
  customer_phone: string;
}
```

## NPM Scripts

### Frontend (root)
```bash
npm run dev           # Start dev server
npm run build         # Production build
npm run preview       # Preview prod build
npm run lint          # Run ESLint
npm run test          # Run tests
npm run test:watch   # Watch mode tests
npm run dev:backend  # Start backend only
npm run dev:full     # Start both servers
```

### Backend
```bash
npm run dev          # Start with watch mode
npm run build        # TypeScript compilation
npm run start        # Run compiled JS
npm run db:init      # Initialize database
```

## Error Messages & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| EADDRINUSE :3001 | Port in use | Kill process: `lsof -ti:3001 \| xargs kill -9` |
| CORS error | Domain not allowed | Check `FRONTEND_URL` in backend/.env |
| Database locked | Multiple writers | Close other connections, restart |
| API URL undefined | Missing .env | Add `VITE_API_URL` to .env |
| Slots not updating | Polling not running | Check Network tab, verify refetchInterval |

## Performance Tips

- Polling interval: 5s is good balance (lower = more requests, higher = stale data)
- Add caching headers to static files in production
- Use database indexes for date/time queries if scaling
- Monitor SQLite file size for large data volumes
- Consider pagination for admin panel with 1000+ bookings

## Security Checklist

- [ ] Change admin password from default
- [ ] Validate all API inputs on backend
- [ ] Add rate limiting to API
- [ ] Use HTTPS in production
- [ ] Sanitize user input in database
- [ ] Implement proper CORS (not localhost)
- [ ] Set NODE_ENV=production
- [ ] Backup database regularly
- [ ] Use .env for secrets, never in code
- [ ] Add authentication for admin area

## Deployment Checklist

- [ ] Frontend: `npm run build` → serve dist/
- [ ] Backend: `npm run build` → run dist/server.js
- [ ] Update .env for production URLs
- [ ] Ensure bookings.db is backed up
- [ ] Set environment variables on server
- [ ] Test API endpoints in production
- [ ] Set up database backup strategy
- [ ] Monitor error logs
- [ ] Set appropriate CORS headers

## Useful Links

- [Express.js Docs](https://expressjs.com/)
- [SQLite3 npm](https://www.npmjs.com/package/sqlite3)
- [React Query Docs](https://tanstack.com/query/latest)
- [Vite Docs](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Git & Version Control

Don't commit:
- ❌ `backend/bookings.db` (database file)
- ❌ `.env` files (secrets)
- ❌ `node_modules/`
- ❌ `dist/`

Already in `.gitignore`:
- ✅ Database files
- ✅ Logs
- ✅ .env files

## Useful Commands

```bash
# View database content
sqlite3 backend/bookings.db "SELECT * FROM bookings;"

# Count bookings
sqlite3 backend/bookings.db "SELECT COUNT(*) FROM bookings;"

# Clear all bookings (⚠️ careful!)
sqlite3 backend/bookings.db "DELETE FROM bookings;"

# Backup database
cp backend/bookings.db backend/bookings.db.backup

# Kill process on port 3001
# Mac/Linux: lsof -ti:3001 | xargs kill -9
# Windows: netstat -ano | findstr :3001 → taskkill /PID <PID> /F
```

## Need to Debug?

1. **Check browser console** for frontend errors
2. **Check server terminal** for backend errors  
3. **Check Network tab** for API calls (see response/request)
4. **Check .env files** for configuration issues
5. **Check database** with sqlite3 command above
6. **Restart both servers** (often fixes issues)

---

Happy coding! 🚀
