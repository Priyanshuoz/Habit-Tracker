# Habit Tracker

A premium, full-stack Habit Tracker application designed to help users establish and maintain daily or weekly routines. 

## Features
- **User Authentication:** Secure sign-up and login with JWT and hashed passwords using bcrypt.
- **Habit Management:** CRUD (Create, Read, Update, Delete) operations for daily and weekly habits.
- **Daily Check-In System:** Quick check-ins with calendar-based tracking.
- **Streaks & Progress:** Automatic calculations for current streak and longest streak records.
- **Consistency Score:** A custom algorithm tracking completion rates over the last 30 days (for daily habits) or 8 weeks (for weekly habits).
- **Data Visualization:** Interactive trend charts showing completions over time using Recharts.

---

## Tech Stack

- **Frontend:** React.js, Tailwind CSS v4, Lucide Icons, Recharts, Axios, React Router DOM
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)

---

## Directory Structure

```text
Habit_Tracker/
├── backend/            # Express Server and MongoDB API
│   ├── config/         # Database connection helper
│   ├── middleware/     # Auth token verification middleware
│   ├── models/         # User, Habit, and CheckIn schemas
│   └── routes/         # Express router endpoints
├── frontend/           # React dashboard UI (Vite)
│   ├── src/
│   │   ├── components/ # Habit cards, modals, stats overview
│   │   ├── pages/      # Login, Register, and Dashboard views
│   │   └── services/   # Axios API client setup
└── .gitignore          # Excludes node_modules and env secrets
```

---

## Setup and Running

### Prerequisites
- [Node.js](https://nodejs.org) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017`

### 1. Run the Backend API
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create your `.env` file (if you haven't yet) with:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/habit-tracker
   JWT_SECRET=your_jwt_secret_here
   ```
3. Start the server in development mode:
   ```bash
   npm run dev
   ```

### 2. Run the Frontend React App
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.
