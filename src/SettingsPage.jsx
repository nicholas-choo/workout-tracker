import { useState } from "react";
import { auth, db } from "./firebase";
import { updateProfile, updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function SettingsPage({ user }) {
    const navigate = useNavigate();

    // Display name
    const [displayName, setDisplayName] = useState(user.displayName || "");
    const [nameSuccess, setNameSuccess] = useState("");
    const [nameError, setNameError] = useState("");
    const [nameSaving, setNameSaving] = useState(false);

    // Password
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordSaving, setPasswordSaving] = useState(false);

    // Delete account
    const [deletePassword, setDeletePassword] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    // ─── Update display name ───────────────────────────────────
    const handleUpdateName = async () => {
        if (!displayName.trim()) return;
        setNameSaving(true);
        setNameError("");
        setNameSuccess("");
        try {
            await updateProfile(auth.currentUser, { displayName });
            await updateDoc(doc(db, "users", user.uid), { displayName });
            setNameSuccess("Display name updated!");
        } catch (err) {
            setNameError("Failed to update name. Try again.");
        } finally {
            setNameSaving(false);
        }
    };

    // ─── Update password ───────────────────────────────────────
    const handleUpdatePassword = async () => {
        if (!currentPassword || !newPassword) return;
        if (newPassword.length < 6) {
            setPasswordError("New password must be at least 6 characters.");
            return;
        }
        setPasswordSaving(true);
        setPasswordError("");
        setPasswordSuccess("");
        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);
            await updatePassword(auth.currentUser, newPassword);
            setPasswordSuccess("Password updated!");
            setCurrentPassword("");
            setNewPassword("");
        } catch (err) {
            if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
                setPasswordError("Current password is incorrect.");
            } else {
                setPasswordError("Failed to update password. Try again.");
            }
        } finally {
            setPasswordSaving(false);
        }
    };

    // ─── Delete account ────────────────────────────────────────
    const handleDeleteAccount = async () => {
        if (!deletePassword) return;
        setDeleteLoading(true);
        setDeleteError("");
        try {
            const credential = EmailAuthProvider.credential(user.email, deletePassword);
            await reauthenticateWithCredential(auth.currentUser, credential);
            await deleteDoc(doc(db, "users", user.uid));
            await deleteUser(auth.currentUser);
        } catch (err) {
            if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
                setDeleteError("Password is incorrect.");
            } else {
                setDeleteError("Failed to delete account. Try again.");
            }
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <header className="tracker-header">
                <div>
                    <div className="tracker-logo">IRON<span>LOG</span></div>
                    <div className="tracker-username">SETTINGS</div>
                </div>
                <button className="signout-btn" onClick={() => navigate("/tracker")}>← BACK</button>
            </header>

            <div className="tracker-main" style={{ maxWidth: 560 }}>

                {/* Display Name */}
                <div className="settings-section">
                    <div className="settings-label">01</div>
                    <div className="settings-title">DISPLAY NAME</div>
                    <div className="settings-desc">This is the name shown in your workout tracker.</div>

                    {nameError && <div className="auth-error">{nameError}</div>}
                    {nameSuccess && <div className="settings-success">{nameSuccess}</div>}

                    <div className="settings-row">
                        <input className="auth-input" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
                        <button className="save-btn" onClick={handleUpdateName} disabled={nameSaving}>
                            {nameSaving ? "SAVING..." : "SAVE"}
                        </button>
                    </div>
                </div>

                {/* Password */}
                <div className="settings-section">
                    <div className="settings-label">02</div>
                    <div className="settings-title">CHANGE PASSWORD</div>
                    <div className="settings-desc">You'll need your current password to confirm.</div>

                    {passwordError && <div className="auth-error">{passwordError}</div>}
                    {passwordSuccess && <div className="settings-success">{passwordSuccess}</div>}

                    <div className="settings-field">
                        <label className="auth-label">CURRENT PASSWORD</label>
                        <input className="auth-input" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
                    </div>
                    <div className="settings-field">
                        <label className="auth-label">NEW PASSWORD</label>
                        <input className="auth-input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 6 characters" />
                    </div>
                    <button className="save-btn" onClick={handleUpdatePassword} disabled={passwordSaving}>
                        {passwordSaving ? "SAVING..." : "UPDATE PASSWORD"}
                    </button>
                </div>

                {/* Delete Account */}
                <div className="settings-section">
                    <div className="settings-label" style={{ color: "#FF4D4D" }}>03</div>
                    <div className="settings-title" style={{ color: "#FF4D4D" }}>DELETE ACCOUNT</div>
                    <div className="settings-desc">
                        Permanently deletes your account and all data. This cannot be undone.
                    </div>

                    {deleteError && <div className="auth-error">{deleteError}</div>}

                    {!confirmDelete ? (
                        <button className="danger-btn" onClick={() => setConfirmDelete(true)}>
                            DELETE MY ACCOUNT
                        </button>
                    ) : (
                        <>
                            <div className="settings-field">
                                <label className="auth-label">ENTER PASSWORD TO CONFIRM</label>
                                <input className="auth-input" type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} placeholder="••••••••" />
                            </div>
                            <div className="settings-row">
                                <button className="cancel-btn" onClick={() => setConfirmDelete(false)}>
                                    CANCEL
                                </button>
                                <button className="danger-btn" onClick={handleDeleteAccount} disabled={deleteLoading}>
                                    {deleteLoading ? "DELETING..." : "CONFIRM DELETE"}
                                </button>
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}