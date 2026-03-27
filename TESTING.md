# Migration Testing Checklist

Use this checklist to verify the Supabase to SQLite migration is working correctly.

## Pre-Testing Setup

- [ ] Database initialized: `npm run db:init` from backend folder
- [ ] Backend dependencies installed: `npm install` in backend folder
- [ ] Frontend dependencies installed: `npm install` in root folder
- [ ] Backend running on port 3001
- [ ] Frontend running on port 5173

## Backend Tests

- [ ] Backend starts without errors: `npm run dev:backend`
- [ ] Health check works: `curl http://localhost:3001/health` returns `{"status":"ok"}`
- [ ] SQLite database file created: `backend/bookings.db` exists
- [ ] No CORS errors in console

## API Endpoint Tests

Use curl or Postman to test:

### GET /api/bookings (empty initially)
```bash
curl http://localhost:3001/api/bookings
# Should return: []
```

### GET /api/bookings/stylist/:stylist/date/:date (no bookings yet)
```bash
curl http://localhost:3001/api/bookings/stylist/Ibbe/date/2024-03-27
# Should return: []
```

### POST /api/bookings (create booking)
```bash
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"stylist":"Ibbe","date":"2024-03-27","time":"10:00","customer_name":"Test User","customer_phone":"0712345678"}'
# Should return: booking object with id
```

### GET /api/bookings (verify creation)
```bash
curl http://localhost:3001/api/bookings
# Should return: array with one booking
```

### DELETE /api/bookings/:id
```bash
# Use the id from creation response
curl -X DELETE http://localhost:3001/api/bookings/{id}
# Should return: {"success":true}
```

## Frontend - Booking Page Tests

1. **Navigation**
   - [ ] Can navigate to booking page
   - [ ] No "supabase is not defined" errors in console

2. **Step 1: Choose Stylist**
   - [ ] Both stylists displayed (Ibbe, Wiliam)
   - [ ] Can select a stylist
   - [ ] Clicking stylist progresses to Step 2

3. **Step 2: Choose Date/Time**
   - [ ] Can navigate dates with arrows
   - [ ] Cannot go before today
   - [ ] Can go to future dates
   - [ ] Time slots display (18 slots from 09:00-17:30)
   - [ ] All time slots are available initially
   - [ ] Can select a time slot

4. **Step 3: Enter Information**
   - [ ] Form shown with Name and Phone fields
   - [ ] Summary shows selected stylist, date, time
   - [ ] Can submit form with valid data

5. **Confirmation**
   - [ ] After submission, confirmation page appears
   - [ ] Shows booking details
   - [ ] "New booking" button resets form

6. **Real-Time Updates (Polling)**
   - [ ] Make a booking
   - [ ] Wait 5 seconds
   - [ ] That time slot shows as booked
   - [ ] Try booking same slot - should be disabled
   - [ ] Open different browser tab to same page
   - [ ] Create booking on tab 1
   - [ ] Within 5 seconds, tab 2 shows new slot as booked

## Frontend - Admin Page Tests

1. **Authentication**
   - [ ] Can navigate to admin page
   - [ ] Login form appears
   - [ ] Wrong password shows error
   - [ ] Correct password (fonsax2024) logs in

2. **View Bookings (after successful login)**
   - [ ] All bookings display
   - [ ] Bookings sorted by date and time
   - [ ] Shows customer name, phone, stylist, date/time

3. **Delete Booking**
   - [ ] Delete button visible for each booking
   - [ ] Clicking delete removes booking
   - [ ] Success message appears
   - [ ] List refreshes immediately
   - [ ] Other tabs refresh within 5 seconds

4. **Logout**
   - [ ] Logout button works
   - [ ] Returns to login screen

## Error Handling Tests

1. **Network Error**
   - [ ] Stop backend server
   - [ ] Try to create booking in frontend
   - [ ] Error message appears: "Failed to create booking"

2. **Duplicate Time Slot**
   - [ ] Create booking at 10:00 for Ibbe on 2024-03-27
   - [ ] Try booking same time slot
   - [ ] Error appears: "Time slot already booked"

3. **Invalid Input**
   - [ ] Booking form with empty name - submit disabled
   - [ ] Booking form with empty phone - submit disabled

## Database Verification

```bash
# Check database contents directly
cd backend
npm install -D sqlite3
npx sqlite3 bookings.db "SELECT * FROM bookings;"
```

- [ ] Schema created correctly
- [ ] Bookings table exists
- [ ] Data persists across server restarts

## Multi-Tab Synchronization Test

1. [ ] Open application in two browser tabs
2. [ ] Create booking in Tab 1
3. [ ] Wait 5 seconds
4. [ ] Tab 2 reflects the new booking
5. [ ] Delete booking in Tab 2
6. [ ] Wait 5 seconds
7. [ ] Tab 1 reflects the deletion

## Performance Tests

- [ ] Page loads in < 2 seconds
- [ ] Creating booking completes in < 1 second
- [ ] Polling doesn't cause noticeable lag
- [ ] Admin page with 50+ bookings loads quickly

## Browser Compatibility

- [ ] Chrome/Edge works
- [ ] Firefox works
- [ ] Safari works (if applicable)

## Cleanup

After testing:
- [ ] Delete test bookings
- [ ] Verify admin page is empty (or clear to expected state)
- [ ] Check no console errors remain

## If Issues Found

1. **Check error messages** in browser console and server terminal
2. **Verify .env files** are correctly set:
   - Frontend: `VITE_API_URL=http://localhost:3001/api`
   - Backend: `PORT=3001`, `FRONTEND_URL=http://localhost:5173`
3. **Check ports** are not in use
4. **Reinitialize database** if needed: `npm run db:init`
5. **Check CORS** settings in backend server

## Sign-Off

- [ ] All tests passed
- [ ] No console errors
- [ ] Ready for production deployment

Date tested: ___________
Tested by: ___________
