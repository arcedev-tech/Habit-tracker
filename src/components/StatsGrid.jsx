export default function StatsGrid({ maxStreak, weekTotal, weekMax, todayPct }) {
  const stats = [
    { icon: "🔥", value: maxStreak, suffix: " días", label: "Racha más larga" },
    { icon: "📊", value: weekTotal, suffix: `/${weekMax}`, label: "Esta semana" },
    { icon: "🎯", value: Math.round(todayPct), suffix: "%", label: "Tasa hoy" },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 10,
      marginBottom: 20,
      animation: "slideUp 0.7s ease",
    }}>
      {stats.map((stat) => (
        <div key={stat.label} style={{
          background: "var(--card)",
          borderRadius: 16,
          padding: "16px 12px",
          textAlign: "center",
          boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
        }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>{stat.icon}</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>
            {stat.value}
            <span style={{ fontSize: 12, fontWeight: 400, color: "var(--muted)" }}>{stat.suffix}</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
