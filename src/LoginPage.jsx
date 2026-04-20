import { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError(friendlyError(err.code));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-root">
            <div className="auth-card">
                <Link to="/" className="auth-back">← BACK</Link>
                <div className="auth-logo">IRON<span>LOG</span></div>
                <div className="auth-subtitle">SIGN IN TO YOUR ACCOUNT</div>
                {error && <div className="auth-error">{error}</div>}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label className="auth-label">EMAIL</label>
                        <input className="auth-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required />
                    </div>
                    <div className="auth-field">
                        <label className="auth-label">PASSWORD</label>
                        <input className="auth-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                    </div>
                    <button className="auth-btn" type="submit" disabled={loading}>
                        {loading ? "SIGNING IN..." : "SIGN IN"}
                    </button>
                </form>
                <div className="auth-footer">
                    Don't have an account? <Link className="auth-link" to="/register">Register</Link>
                </div>
            </div>
        </div>
    );
}

function friendlyError(code) {
  switch (code) {
    case "auth/invalid-email":        return "Please enter a valid email.";
    case "auth/user-not-found":       return "No account found with that email.";
    case "auth/wrong-password":       return "Incorrect password.";
    case "auth/invalid-credential":   return "Invalid email or password.";
    case "auth/too-many-requests":    return "Too many attempts. Try again later.";
    case "auth/user-disabled":        return "This account has been disabled.";
    default:                          return "Something went wrong. Please try again.";
  }
}