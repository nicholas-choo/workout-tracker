import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { auth } from "./firebase"
import { onAuthStateChanged } from 'firebase/auth'
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import WorkoutTracker from "./WorkoutTracker";
import SettingsPage from "./SettingsPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return (
      <div className="loading-root">
        <div className="loading-logo">IRON<span>LOG</span></div>
        <div className="loading-sub">LOADING...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/tracker" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/tracker" />} />
        <Route path="/tracker" element={user ? <WorkoutTracker user={user} /> : <Navigate to="/" />} />
        <Route path="/settings" element={user ? <SettingsPage user={user} /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}