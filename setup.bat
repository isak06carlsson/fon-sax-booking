@echo off
REM Quick setup script for Fön Sax Booking System

REM Check if node is installed
where node >nul 2>nul
if errorlevel 1 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org/
    exit /b 1
)

echo ===============================================
echo Fön Sax Booking System - Setup
echo ===============================================
echo.

echo Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo Failed to install frontend dependencies
    exit /b 1
)

echo.
echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo Failed to install backend dependencies
    exit /b 1
)

echo.
echo Skipping DB bootstrap in setup script.
echo Set backend/.env DATABASE_URL first, then run:
echo   cd backend ^&^& npm run db:init
cd ..

echo.
echo ===============================================
echo Setup completed successfully!
echo ===============================================
echo.
echo To start development:
echo   Option 1 (recommended): npm run dev:full
echo   Option 2 (separate terminals):
echo      Terminal 1: npm run dev
echo      Terminal 2: npm run dev:backend
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3001
echo.
echo Admin credentials: set ADMIN_PASSWORD in backend/.env
echo.
