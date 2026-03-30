export default function ProgressCard({ todayCount, todayTotal }) {
  const pct = todayTotal > 0 ? (todayCount / todayTotal) * 100 : 0;
  const circ = 2 * Math.PI * 34;

  let message = "¡Tú puedes! ✨";
  if (pct === 100) message = "¡Día perfecto! 🎉";
  else if (pct >= 50) message = "¡Vas genial! 💪";

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
      marginBottom: 28,
      padding: 20,
      background: "var(--card)",
      borderRadius: 20,
      boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
      animation: "slideUp 0.5s ease",
    }}>
      <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border)" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="34" fill="none"
            stroke="var(--accent)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct / 100)}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 20,
        }}>
          {todayCount}/{todayTotal}
        </div>
      </div>

      <div>
        <h2 style={{ fontWeight: 600, fontSize: 17, marginBottom: 4 }}>{message}</h2>
        <p style={{ fontSize: 13, color: "var(--muted)" }}>
          {todayCount} de {todayTotal} completados hoy
        </p>
        <div style={{
          marginTop: 8,
          height: 6,
          borderRadius: 3,
          background: "var(--border)",
          width: 160,
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            borderRadius: 3,
            background: "linear-gradient(90deg, var(--accent), var(--success))",
            width: `${pct}%`,
            transition: "width 0.6s ease",
            animation: "progressFill 0.8s ease",
          }} />
        </div>
      </div>
    </div>
  );
}
