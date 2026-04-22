# IronLog — Workout Tracker

A full-stack workout tracking web application built with React.js and Firebase. Plan your weekly training split, track your sets, and log your progress — all synced to the cloud in real time.

🔗 **Live:** [ironlog.nicholaschoo.com](https://ironlog.nicholaschoo.com)

---

## ⚠️ Access Notice

IronLog is a **permission-based application**. Registration is open, but access to the app requires approval from the administrator. If you would like access, please contact me at nicholaschoojiajun@gmail.com with your registered email address.

---

## Features

- **Authentication** — Secure email/password registration and login via Firebase Auth
- **Weekly Planner** — Build your training split across 7 days with exercises, sets, reps, and weight
- **Exercise Management** — Add, edit, and delete exercises per day
- **Progress Tracking** — Check off exercises as you complete them with a live progress bar
- **Activity Log** — Every completed exercise is timestamped and grouped by date
- **Cloud Sync** — All data is stored in Firebase Firestore and synced in real time
- **Settings** — Update display name, change password, or delete account
- **Landing Page** — Public-facing page with feature showcase and app mockups
- **Mobile Responsive** — Fully optimised for mobile and desktop

---

## Tech Stack

| Category | Technology |
|---|---|
| Frontend | React.js, JavaScript, CSS |
| Routing | React Router v7 |
| Build Tool | Vite |
| Authentication | Firebase Authentication |
| Database | Firebase Firestore |
| Hosting | Netlify |
| Domain | nicholaschoo.com |
| Version Control | GitHub |

---

## Project Structure

src/
├── firebase.js          # Firebase config and exports
├── main.jsx             # App entry point
├── app.css              # Global styles
├── App.jsx              # Routing and auth state
├── LandingPage.jsx      # Public landing page
├── LoginPage.jsx        # Login page
├── RegisterPage.jsx     # Registration page
├── WorkoutTracker.jsx   # Main tracker (protected)
└── SettingsPage.jsx     # User settings (protected)

---

## Firestore Data Structure

users/
{userId}/
displayName: string
email: string
createdAt: timestamp

data/
  routine/
    MON: [ { id, name, sets, reps, weight, group } ]
    TUE: [ ... ]
    ...

logs/
  {logId}/
    exerciseName: string
    sets: number
    reps: number
    weight: number
    group: string
    day: string
    date: string
    completedAt: timestamp

approved/
{userId}/
email: string

---

## Local Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/nicholas-choo/workout-tracker.git
cd workout-tracker
npm install
```

Create a `.env` file in the root directory with your Firebase config:

VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

Run the development server:

```bash
npm run dev
```

---

## Deployment

This project is deployed via **Netlify** with continuous deployment from GitHub. Every push to the main branch triggers an automatic redeploy.

Environment variables are configured in **Netlify → Site Configuration → Environment Variables**.

---

## Author

**Nicholas Choo**
🌐 [nicholaschoo.com](https://nicholaschoo.com)
