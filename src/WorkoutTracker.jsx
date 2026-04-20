import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc, query, orderBy, getDocs, deleteDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const MUSCLE_GROUPS = ["CHEST", "BACK", "SHOULDERS", "ARMS", "LEGS", "CORE", "CARDIO"];

const COLORS = {
  CHEST: "#FF4D4D",
  BACK: "#FF8C00",
  SHOULDERS: "#FFD700",
  ARMS: "#00E5FF",
  LEGS: "#7C4DFF",
  CORE: "#00E676",
  CARDIO: "#FF4081",
};

const EMPTY_ROUTINE = {
  MON: [], TUE: [], WED: [], THU: [], FRI: [], SAT: [], SUN: []
};

export default function WorkoutTracker({ user }) {
    const [loading, setLoading] = useState(true);
    const [routine, setRoutine] = useState(EMPTY_ROUTINE);
    const [activeDay, setActiveDay] = useState("MON");
    const [adding, setAdding] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: "", sets: 3, reps: 10, weight: 0, group: "CHEST" });
    const [editing, setEditing] = useState(null);
    const [completed, setCompleted] = useState({});
    const [flash, setFlash] = useState(null);
    const [log, setLog] = useState([]);
    const [view, setView] = useState("week");

    useEffect(() => {
        const setup = async () => {
            try {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        displayName: user.displayName || "",
                        email: user.email,
                        createdAt: serverTimestamp(),
                    });
                }

                // Load routine
                const routineRef = doc(db, "users", user.uid, "data", "routine");
                const routineSnap = await getDoc(routineRef);
                if (routineSnap.exists()) {
                    setRoutine({ ...EMPTY_ROUTINE, ...routineSnap.data() });
                }

                // Load logs
                const logsRef = collection(db, "users", user.uid, "logs");
                const q = query(logsRef, orderBy("completedAt", "desc"));
                const logSnap = await getDocs(q);
                const loadedLogs = logSnap.docs.slice(0, 50).map((d) => ({
                    logId: d.id,
                    ...d.data(),
                    time: d.data().completedAt?.toDate().toLocaleTimeString() || "",
                    date: d.data().date || d.data().completedAt?.toDate().toLocaleDateString("en-GB") || "",
                }));
                setLog(loadedLogs);

            } catch (err) {
                console.error("Error:", err.code, err.message);
            } finally {
                setLoading(false);
            }
        };

        setup();
    }, [user.uid]);

    const handleSignOut = async () => {
        await signOut(auth);
    };

    const saveRoutine = async (newRoutine) => {
        setSaving(true);
        try {
            const routineRef = doc(db, "users", user.uid, "data", "routine");
            await setDoc(routineRef, newRoutine);
        } catch (err) {
            console.error("Save error:", err.message);
        } finally {
            setSaving(false);
        }
    };

    const addExercise = () => {
        if (!form.name.trim()) return;

        const newEx = {
            id: `${Date.now()}`,
            name: form.name,
            sets: form.sets,
            reps: form.reps,
            weight: form.weight,
            group: form.group,
        };

        const newRoutine = {
            ...routine,
            [activeDay]: [...routine[activeDay], newEx],
        };

        setRoutine(newRoutine);
        saveRoutine(newRoutine);
        setForm({ name: "", sets: 3, reps: 10, weight: 0, group: "CHEST" });
        setAdding(false);
    };

    const deleteExercise = (exId) => {
        const newRoutine = {
            ...routine,
            [activeDay]: routine[activeDay].filter((e) => e.id !== exId),
        };
        setRoutine(newRoutine);
        saveRoutine(newRoutine);
    };

    const openEdit = (ex) => {
        setForm({ name: ex.name, sets: ex.sets, reps: ex.reps, weight: ex.weight, group: ex.group });
        setEditing(ex.id);
        setAdding(false);
    };

    const saveEdit = () => {
        if (!form.name.trim()) return;
        const newRoutine = {
            ...routine,
            [activeDay]: routine[activeDay].map((e) =>
            e.id === editing ? { ...e, ...form } : e
            ),
        };
        setRoutine(newRoutine);
        saveRoutine(newRoutine);
        setEditing(null);
        setForm({ name: "", sets: 3, reps: 10, weight: 0, group: "CHEST" });
    };

    const triggerFlash = (name) => {
        setFlash(name);
        setTimeout(() => setFlash(null), 1200);
    };

    const toggleComplete = async (exId) => {
        const key = `${activeDay}-${exId}`;

        // Unchecking — just remove from local state
        if (completed[key]) {
            setCompleted((prev) => ({ ...prev, [key]: false }));
            return;
        }

        const ex = routine[activeDay].find((e) => e.id === exId);
        setCompleted((prev) => ({ ...prev, [key]: true }));
        triggerFlash(ex.name);

        // Write to Firestore
        try {
            const logsRef = collection(db, "users", user.uid, "logs");
            const logEntry = {
                exerciseName: ex.name,
                sets: ex.sets,
                reps: ex.reps,
                weight: ex.weight,
                group: ex.group,
                day: activeDay,
                completedAt: serverTimestamp(),
                date: new Date().toLocaleDateString("en-GB"), // e.g. 19/04/2026
            };
            const docRef = await addDoc(logsRef, logEntry);

            // Add to local log state
            setLog((l) => [
                {
                    ...logEntry,
                    logId: docRef.id,
                    time: new Date().toLocaleTimeString(),
                },
                ...l,
                ]);
        } catch (err) {
            console.error("Log error:", err.message);
        }
    };

    const deleteLog = async (logId) => {
        try {
            const logRef = doc(db, "users", user.uid, "logs", logId);
            await deleteDoc(logRef);
            setLog((l) => l.filter((entry) => entry.logId !== logId));
        } catch (err) {
            console.error("Delete log error:", err.message);
        }
    };

    const isComplete = (exId) => !!completed[`${activeDay}-${exId}`];

    const todayExercises = routine[activeDay] || [];
    const completedToday = todayExercises.filter((e) => isComplete(e.id)).length;
    const totalVolume = Object.values(routine).reduce(
        (total, exs) => total + exs.reduce((s, e) => s + e.sets * e.reps * e.weight, 0), 0
    );
    const dayVolume = todayExercises.reduce((s, e) => s + e.sets * e.reps * e.weight, 0);

    if (loading) {
        return (
            <div className="loading-root">
                <div className="loading-logo">IRON<span>LOG</span></div>
                <div className="loading-sub">LOADING...</div>
            </div>
        );
    }

    return (
        <div>
            {/* Flash notification */}
            {flash && (
                <div className="flash">✓ {flash.toUpperCase()} DONE</div>
            )}

            {/* Header */}
            <header className="tracker-header">
                <div>
                    <div className="tracker-logo">IRON<span>LOG</span></div>
                    <div className="tracker-username">
                        {user.displayName?.toUpperCase() || user.email}
                        {saving && <span style={{ color: "#333", marginLeft: 10 }}>· SAVING...</span>}
                    </div>
                </div>

                <div className="tracker-stats">
                    <div className="tracker-stat">
                        <span className="stat-num">{totalVolume.toLocaleString()}</span>
                        <span className="stat-label">KG WEEKLY VOL</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="tracker-stat">
                        <span className="stat-num">{Object.values(routine).reduce((s, d) => s + d.length, 0)}</span>
                        <span className="stat-label"> TOTAL EXERCISES</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="tracker-stat">
                        <span className="stat-num">{Object.values(routine).filter((d) => d.length > 0).length}</span>
                        <span className="stat-label"> ACTIVE DAYS</span>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div className="view-toggle">
                        <button className={`view-btn ${view === "week" ? "active" : ""}`} onClick={() => setView("week")}>
                            WEEK
                        </button>
                        <button className={`view-btn ${view === "log" ? "active" : ""}`} onClick={() => setView("log")}>
                            LOG
                        </button>
                    </div>
                    <Link to="/settings">
                        <button className="signout-btn">SETTINGS</button>
                    </Link>
                    <button className="signout-btn" onClick={handleSignOut}>SIGN OUT</button>
                </div>
            </header>

            {view === "week" ? (
                <div className="tracker-main">

                {/* Main */}
                <div className="tracker-main">

                    {/* Day bar */}
                    <div className="day-bar">
                        {DAYS.map((day) => {
                            const hasWorkout = routine[day]?.length > 0;
                            const isActive = activeDay === day;
                            return (
                                <button key={day} onClick={() => { setActiveDay(day); setAdding(false); setEditing(null); }} className={`day-btn ${isActive ? "active" : ""} ${hasWorkout && !isActive ? "has-workout" : ""}`}>
                                    {day}{hasWorkout && !isActive && <span className="day-dot" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Day header */}
                    <div className="day-header">
                        <div>
                            <div className="day-title">
                                {activeDay === "SAT" || activeDay === "SUN" ? "REST / ACTIVE" : "TRAINING DAY"}
                            </div>
                            <div className="day-meta">
                                {completedToday}/{todayExercises.length} COMPLETED
                                {dayVolume > 0 && <span>↑ {dayVolume.toLocaleString()} KG</span>}
                            </div>
                        </div>
                        <button className="add-btn" onClick={() => { setAdding(true); setEditing(null); }}>+ ADD</button>
                    </div>

                    {/* Progress bar */}
                    {todayExercises.length > 0 && (
                        <div className="progress-wrap">
                            <div className={`progress-bar ${completedToday === todayExercises.length ? "complete" : ""}`} style={{ width: `${(completedToday / todayExercises.length) * 100}%` }} />
                        </div>
                    )}

                    {/* Exercise list */}
                    <div className="ex-list">

                        {/* Empty state */}
                        {todayExercises.length === 0 && !adding && (
                            <div className="empty-state">
                                <div className="empty-icon">◎</div>
                                <div className="empty-text">REST DAY</div>
                                <div className="empty-sub">Add exercises or enjoy the recovery</div>
                            </div>
                        )}

                        {/* Exercise rows */}
                        {todayExercises.map((ex) => {
                            const done = isComplete(ex.id);
                            return (
                                <div key={ex.id} className={`ex-row ${done ? "done" : ""}`} style={{ borderLeftColor: COLORS[ex.group] }}>
                                    {editing === ex.id ? (
                                        <div className="ex-form">
                                            <div className="ex-form-row">
                                                <input className="form-input" placeholder="Exercise name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} autoFocus />
                                                <select className="form-select" value={form.group} onChange={(e) => setForm((f) => ({ ...f, group: e.target.value }))}>
                                                    {MUSCLE_GROUPS.map((g) => <option key={g}>{g}</option>)}
                                                </select>
                                            </div>

                                            <div className="ex-form-row">
                                                <label className="num-label">
                                                    SETS
                                                    <input className="num-input" type="number" min={1} max={10} value={form.sets} onChange={(e) => setForm((f) => ({ ...f, sets: +e.target.value }))} />
                                                </label>
                                                <label className="num-label">
                                                    REPS
                                                    <input className="num-input" type="number" min={1} max={100} value={form.reps} onChange={(e) => setForm((f) => ({ ...f, reps: +e.target.value }))} />
                                                </label>
                                                <label className="num-label">
                                                    KG
                                                    <input className="num-input" type="number" min={0} value={form.weight} onChange={(e) => setForm((f) => ({ ...f, weight: +e.target.value }))} />
                                                </label>

                                                <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
                                                    <button className="cancel-btn" onClick={() => setEditing(null)}>CANCEL</button>
                                                    <button className="save-btn" onClick={saveEdit}>SAVE</button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <button className={`check-btn ${done ? "done" : ""}`} onClick={() => toggleComplete(ex.id)}>
                                                {done && "✓"}
                                            </button>

                                            <div className="ex-info">
                                                <div className="ex-name">{ex.name}</div>
                                                <div className="ex-meta">
                                                    <span>{ex.sets} × {ex.reps}</span>
                                                    {ex.weight > 0 && <span className="weight">@ {ex.weight}KG</span>}
                                                    <span className="muscle-tag" style={{ background: COLORS[ex.group] + "22", color: COLORS[ex.group] }}>
                                                        {ex.group}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="ex-actions">
                                                <button className="icon-btn" onClick={() => openEdit(ex)}>✎</button>
                                                <button className="icon-btn delete" onClick={() => deleteExercise(ex.id)}>✕</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}

                        {/* Add form */}
                        {adding && (
                            <div className="ex-row" style={{ borderLeftColor: "#DCFF00" }}>
                                <div className="ex-form">
                                    <div className="ex-form-row">
                                        <input className="form-input" placeholder="Exercise name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} autoFocus />
                                        <select className="form-select" value={form.group} onChange={(e) => setForm((f) => ({ ...f, group: e.target.value }))}>
                                            {MUSCLE_GROUPS.map((g) => <option key={g}>{g}</option>)}
                                        </select>
                                    </div>

                                    <div className="ex-form-row">
                                        <label className="num-label">
                                            SETS
                                            <input className="num-input" type="number" min={1} max={10} value={form.sets} onChange={(e) => setForm((f) => ({ ...f, sets: +e.target.value }))} />
                                        </label>
                                        <label className="num-label">
                                            REPS
                                            <input className="num-input" type="number" min={1} max={100} value={form.reps} onChange={(e) => setForm((f) => ({ ...f, reps: +e.target.value }))} />
                                        </label>
                                        <label className="num-label">
                                            KG
                                            <input className="num-input" type="number" min={0} value={form.weight} onChange={(e) => setForm((f) => ({ ...f, weight: +e.target.value }))} />
                                        </label>

                                        <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
                                            <button className="cancel-btn" onClick={() => setAdding(false)}>CANCEL</button>
                                            <button className="save-btn" onClick={addExercise}>SAVE</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Legend */}
                    <div className="legend">
                        {MUSCLE_GROUPS.map((g) => (
                            <div key={g} className="legend-item">
                                <div className="legend-dot" style={{ background: COLORS[g] }} />
                                {g}
                            </div>
                        ))}
                    </div>

                </div>

            </div>
            ) : (
                <div className="tracker-main">
                    <div className="day-header">
                        <div className="day-title">ACTIVITY LOG</div>
                    </div>

                    {log.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">◎</div>
                            <div className="empty-text">NO ACTIVITY YET</div>
                            <div className="empty-sub">Complete exercises to see them here</div>
                        </div>
                    ) : (
                        <div className="ex-list">
                            {log.map((entry) => (
                                <div key={entry.logId} className="ex-row" style={{ borderLeftColor: COLORS[entry.group] }}>
                                    <div style={{width: 64, textAlign: "center", color: "#444", fontSize: 10, fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1.8}}>
                                        {entry.date || "—"}<br />
                                        {entry.day}<br />
                                        {entry.time?.slice(0, 5)}
                                    </div>
                                    <div className="ex-info">
                                        <div className="ex-name">{entry.exerciseName}</div>
                                        <div className="ex-meta">
                                            <span>{entry.sets} × {entry.reps}</span>
                                            {entry.weight > 0 && <span className="weight">@ {entry.weight}KG</span>}
                                            <span className="muscle-tag" style={{ background: COLORS[entry.group] + "22", color: COLORS[entry.group] }}>
                                                {entry.group}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{ color: "#00E676", fontSize: 18, fontWeight: 900 }}>✓</div>
                                        <button className="icon-btn delete" onClick={() => deleteLog(entry.logId)}>✕</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}