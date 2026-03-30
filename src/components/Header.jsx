import { useState, useEffect } from "react";
import { formatTime, formatDate } from "../utils";

export default function Header() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header style={{
      textAlign: "center",
      marginBottom: 28,
      animation: "fadeIn 0.6s ease",
    }}>
      <p style={{
        fontSize: 13,
        letterSpacing: 3,
        textTransform: "uppercase",
        color: "var(--muted)",
        marginBottom: 4,
      }}>
        {formatDate(now)}
      </p>
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 42,
        fontWeight: 700,
        letterSpacing: -1,
        margin: "4px 0 2px",
      }}>
        {formatTime(now)}
      </h1>
      <p style={{ fontSize: 14, color: "var(--muted)" }}>
        Tracker de Hábitos
      </p>
    </header>
  );
}
