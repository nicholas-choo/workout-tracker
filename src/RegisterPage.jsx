import { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link } from "react-router-dom";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(user, { displayName: name });
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
                <div className="auth-subtitle">CREATE YOUR ACCOUNT</div>
                {error && <div className="auth-error">{error}</div>}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label className="auth-label">FULL NAME</label>
                        <input className="auth-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
                    </div>
                    <div className="auth-field">
                        <label className="auth-label">EMAIL</label>
                        <input className="auth-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required />
                    </div>
                    <div className="auth-field">
                        <label className="auth-label">PASSWORD</label>
                        <input className="auth-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" minLength={6} required />
                    </div>
                    <button className="auth-btn" type="submit" disabled={loading}>
                        {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                    </button>
                </form>
                <div className="auth-footer">
                    Already have an account? <Link className="auth-link" to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
}

function friendlyError(code) {
    switch (code) {
        case "auth/email-already-in-use": return "That email is already registered.";
        case "auth/invalid-email":        return "Please enter a valid email.";
        case "auth/weak-password":        return "Password must be at least 6 characters.";
        default:                          return "Something went wrong. Please try again.";
    }
}