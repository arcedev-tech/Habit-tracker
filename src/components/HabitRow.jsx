import { useState } from "react";
import { getTodayKey, getStreak } from "../utils";

export default function HabitRow({ habit, weekDates, completions, onToggle, onRemove }) {
  const [animatingCell, setAnimatingCell] = useState(null);
  const todayKey = getTodayKey();
  const streak = getStreak(habit.id, completions);

  const handleToggle = (dateKey) => {
    setAnimatingCell(dateKey);
    setTimeout(() => setAnimatingCell(null), 500);
    onToggle(habit.id, dateKey);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr repeat(7, 38px)",
        alignItems: "center",
        padding: "10px 12px",
        borderBottom: "1px solid var(--border)",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = "color-mix(in srgb, var(--border) 50%, transparent)"}
      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>{habit.icon}</span>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: 14,
            fontWeight: 500,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {habit.name}
          </div>
          {streak > 0 && (
            <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>
              🔥 {streak} día{streak !== 1 ? "s" : ""}
            </div>
          )}
        </div>
        <button
          onClick={() => onRemove(habit.id)}
          className="remove-btn"
          style={{
            opacity: 0,
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: 16,
            color: "var(--muted)",
            padding: "2px 6px",
            flexShrink: 0,
            transition: "opacity 0.2s",
          }}
        >
          ×
        </button>
      </div>

      {weekDates.map((d) => {
        const done = completions[d]?.[habit.id];
        const isToday = d === todayKey;
        const isAnim = animatingCell === d;
        return (
          <div key={d} style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={() => handleToggle(d)}
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                border: done ? "none" : `2px solid ${isToday ? habit.color + "88" : "var(--border)"}`,
                background: done ? habit.color : "transparent",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                WebkitTapHighlightColor: "transparent",
                animation: isAnim ? "checkBounce 0.4s ease" : "none",
              }}
            >
              {done && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        );
      })}

      <style>{`
        div:hover > div > .remove-btn { opacity: 1 !important; }
        button:active { transform: scale(0.85); }
        @media (hover: hover) {
          button:hover { transform: scale(1.12); }
        }
      `}</style>
    </div>
  );
}
