import { Link } from "react-router-dom";

const FEATURES = [
    {
        number: "01",
        title: "PLAN YOUR WEEK",
        desc: "Build your weekly training split. Assign exercises to each day with sets, reps, and weight. Your routine is saved to the cloud and accessible anywhere.",
        mockup: <WeekMockup />,
    },
    {
        number: "02",
        title: "TRACK YOUR SETS",
        desc: "Check off exercises as you complete them. Watch the progress bar fill up as you push through your session. Every rep counts.",
        mockup: <TrackMockup />,
    },
    {
        number: "03",
        title: "LOG YOUR HISTORY",
        desc: "Every completed exercise is timestamped and saved. Review your activity log to see exactly what you've done and when.",
        mockup: <LogMockup />,
    },
];

export default function LandingPage() {
    return (
        <div className="landing-root">

        {/* Nav */}
        <nav className="landing-nav">
            <div className="nav-logo">IRON<span>LOG</span></div>
            <div className="nav-links">
            <Link className="nav-login" to="/login">SIGN IN</Link>
            <Link className="nav-register" to="/register">GET STARTED</Link>
            </div>
        </nav>

        {/* Hero */}
        <section className="hero">
            <div className="hero-bg-grid" />
            <div className="hero-eyebrow">WORKOUT TRACKER</div>
            <div className="hero-title">
            IRON<span className="hero-title-accent">LOG</span>
            </div>
            <div className="hero-tagline">LOG EVERY REP. OWN EVERY SET.</div>
            <div className="hero-cta">
            <Link className="hero-btn-primary" to="/register">START FOR FREE</Link>
            <Link className="hero-btn-secondary" to="/login">SIGN IN</Link>
            </div>
            <div className="hero-scroll">
            SCROLL
            <div className="hero-scroll-line" />
            </div>
        </section>

        {/* Ticker */}
        <div className="ticker">
            <div className="ticker-track">
            {[...Array(2)].map((_, i) => (
                <div key={i} style={{ display: "flex" }}>
                {["TRACK YOUR SETS", "LOG YOUR REPS", "OWN YOUR PROGRESS", "PLAN YOUR WEEK", "MONITOR YOUR VOLUME", "STAY CONSISTENT"].map((t) => (
                    <div key={t} className="ticker-item"><span>✦</span>{t}</div>
                ))}
                </div>
            ))}
            </div>
        </div>

        {/* Features */}
        <section className="features">
            <div className="features-header">
            <div className="section-eyebrow">FEATURES</div>
            <div className="section-title">EVERYTHING YOU NEED<br /><span>NOTHING YOU DON'T</span></div>
            </div>

            {FEATURES.map((f, i) => (
            <div key={f.number} className={`feature-block ${i % 2 === 1 ? "reverse" : ""}`}>
                <div>
                <div className="feature-number">{f.number}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
                </div>
                <div className="mockup-frame">{f.mockup}</div>
            </div>
            ))}
        </section>

        {/* Stats */}
        <div className="stats-banner">
            <div className="stats-inner">
            <div className="stat-block">
                <div className="stat-block-num">7</div>
                <div className="stat-block-label">DAYS A WEEK</div>
            </div>
            <div className="stat-block">
                <div className="stat-block-num">∞</div>
                <div className="stat-block-label">EXERCISES TO TRACK</div>
            </div>
            <div className="stat-block">
                <div className="stat-block-num">0</div>
                <div className="stat-block-label">EXCUSES</div>
            </div>
            </div>
        </div>

        {/* CTA */}
        <section className="cta-section">
            <div className="cta-bg" />
            <div className="cta-title">READY TO<br /><span style={{ color: "#DCFF00" }}>START?</span></div>
            <div className="cta-sub">JOIN IRONLOG AND TAKE CONTROL OF YOUR TRAINING.</div>
            <Link className="hero-btn-primary" to="/register" style={{ fontSize: 20, padding: "18px 48px" }}>
                CREATE YOUR ACCOUNT
            </Link>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
            <div className="footer-logo">IRON<span>LOG</span></div>
            <div className="footer-copy">© {new Date().getFullYear()} IRONLOG. BUILT BY{" "}
            <a className="footer-link" href="https://nicholaschoo.com" target="_blank" rel="noreferrer">
                NICHOLAS CHOO
            </a>
            </div>
            <a className="footer-link" href="https://nicholaschoo.com" target="_blank" rel="noreferrer">
            PORTFOLIO →
            </a>
        </footer>
        </div>
    );
    }

    // ── Mockup Components ──────────────────────────────────────

    function WeekMockup() {
    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const exercises = [
        { name: "Bench Press", meta: "4 × 8 @ 80KG", color: "#FF4D4D", group: "CHEST" },
        { name: "Incline DB Press", meta: "3 × 10 @ 30KG", color: "#FF4D4D", group: "CHEST" },
        { name: "Cable Fly", meta: "3 × 12 @ 20KG", color: "#FF4D4D", group: "CHEST" },
    ];
    return (
        <div>
        <div className="mockup-bar">
            <div className="mockup-dot" />
            <div className="mockup-dot" />
            <div className="mockup-dot" />
        </div>
        <div className="mockup-body">
            <div className="mockup-day-bar">
            {days.map((d) => (
                <div key={d} className={`mockup-day ${d === "MON" ? "active" : d === "WED" || d === "FRI" ? "has" : ""}`}>{d}</div>
            ))}
            </div>
            {exercises.map((ex) => (
            <div key={ex.name} className="mockup-ex" style={{ borderLeftColor: ex.color }}>
                <div className="mockup-ex-info">
                <div className="mockup-ex-name">{ex.name}</div>
                <div className="mockup-ex-meta">{ex.meta}
                    <span className="mockup-tag" style={{ background: ex.color + "22", color: ex.color, marginLeft: 6 }}>{ex.group}</span>
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
    }

    function TrackMockup() {
    const exercises = [
        { name: "Deadlift", meta: "3 × 5 @ 120KG", color: "#FF8C00", done: true },
        { name: "Barbell Row", meta: "4 × 8 @ 70KG", color: "#FF8C00", done: true },
        { name: "Pull-ups", meta: "4 × 10 @ BW", color: "#FF8C00", done: false },
        { name: "Face Pulls", meta: "3 × 15 @ 15KG", color: "#FF8C00", done: false },
    ];
    const done = exercises.filter((e) => e.done).length;
    return (
        <div>
        <div className="mockup-bar">
            <div className="mockup-dot" />
            <div className="mockup-dot" />
            <div className="mockup-dot" />
        </div>
        <div className="mockup-body">
            <div className="mockup-progress">
            <div className="mockup-progress-bar" style={{ width: `${(done / exercises.length) * 100}%` }} />
            </div>
            {exercises.map((ex) => (
            <div key={ex.name} className="mockup-ex" style={{ borderLeftColor: ex.color, opacity: ex.done ? 0.5 : 1 }}>
                <div className={`mockup-check ${ex.done ? "done" : ""}`}>{ex.done ? "✓" : ""}</div>
                <div className="mockup-ex-info">
                <div className="mockup-ex-name">{ex.name}</div>
                <div className="mockup-ex-meta">{ex.meta}</div>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
    }

    function LogMockup() {
    const entries = [
        { name: "Squat", meta: "4 × 6 @ 100KG", color: "#7C4DFF", day: "THU", time: "07:42" },
        { name: "Leg Press", meta: "3 × 12 @ 150KG", color: "#7C4DFF", day: "THU", time: "07:55" },
        { name: "Bench Press", meta: "4 × 8 @ 80KG", color: "#FF4D4D", day: "MON", time: "08:10" },
        { name: "OHP", meta: "3 × 8 @ 50KG", color: "#FFD700", day: "FRI", time: "09:00" },
    ];
    return (
        <div>
        <div className="mockup-bar">
            <div className="mockup-dot" />
            <div className="mockup-dot" />
            <div className="mockup-dot" />
        </div>
        <div className="mockup-body">
            {entries.map((e) => (
            <div key={e.name + e.time} className="mockup-log-entry" style={{ borderLeftColor: e.color }}>
                <div className="mockup-log-time">{e.day}<br />{e.time}</div>
                <div className="mockup-ex-info">
                <div className="mockup-ex-name">{e.name}</div>
                <div className="mockup-ex-meta">{e.meta}</div>
                </div>
                <div style={{ color: "#00E676", fontSize: 12, fontWeight: 900 }}>✓</div>
            </div>
            ))}
        </div>
        </div>
    );
}