import { useState, useMemo } from "react";
import { getStreak } from "../utils";

function getLast30Days() {
  const days = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function getLast12Weeks() {
  const weeks = [];
  const today = new Date();
  for (let w = 11; w >= 0; w--) {
    const weekDays = [];
    for (let d = 6; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(today.getDate() - w * 7 - d);
      weekDays.push(date.toISOString().slice(0, 10));
    }
    weeks.push(weekDays);
  }
  return weeks;
}

function getShortMonth(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("es-ES", { month: "short" }).slice(0, 3);
}

function getShortDay(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return d.getDate();
}

// Simple SVG bar chart
function BarChart({ data, color, maxVal }) {
  const barWidth = 100 / data.length;
  const max = maxVal || Math.max(1, ...data.map((d) => d.value));

  return (
    <svg width="100%" height="120" viewBox="0 0 400 120" preserveAspectRatio="none">
      {data.map((d, i) => {
        const h = (d.value / max) * 90;
        return (
          <g key={i}>
            <rect
              x={i * (400 / data.length) + 2}
              y={100 - h}
              width={Math.max(1, 400 / data.length - 4)}
              height={h}
              rx="3"
              fill={d.value > 0 ? color : "var(--border)"}
              opacity={d.value > 0 ? 0.85 : 0.4}
            >
              <animate
                attributeName="height"
                from="0"
                to={h}
                dur="0.5s"
                fill="freeze"
              />
              <animate
                attributeName="y"
                from="100"
                to={100 - h}
                dur="0.5s"
                fill="freeze"
              />
            </rect>
            {i % 5 === 0 && (
              <text
                x={i * (400 / data.length) + (400 / data.length) / 2}
                y="115"
                textAnchor="middle"
                fontSize="10"
                fill="var(--muted)"
                fontFamily="Outfit, sans-serif"
              >
                {d.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// Heatmap grid (12 weeks × 7 days)
function Heatmap({ weeks, habitId, completions, color }) {
  const dayLabels = ["L", "M", "X", "J", "V", "S", "D"];
  const cellSize = 14;
  const gap = 3;

  return (
    <div style={{ overflowX: "auto" }}>
      <svg
        width={weeks.length * (cellSize + gap) + 30}
        height={7 * (cellSize + gap) + 20}
        style={{ display: "block" }}
      >
        {dayLabels.map((label, di) => (
          <text
            key={label}
            x="0"
            y={di * (cellSize + gap) + cellSize - 2}
            fontSize="9"
            fill="var(--muted)"
            fontFamily="Outfit, sans-serif"
          >
            {di % 2 === 0 ? label : ""}
          </text>
        ))}

        {weeks.map((week, wi) => (
          <g key={wi}>
            {week.map((day, di) => {
              const done = completions[day]?.[habitId];
              return (
                <rect
                  key={day}
                  x={wi * (cellSize + gap) + 20}
                  y={di * (cellSize + gap)}
                  width={cellSize}
                  height={cellSize}
                  rx="3"
                  fill={done ? color : "var(--border)"}
                  opacity={done ? 0.9 : 0.3}
                >
                  <title>{day}: {done ? "✓" : "—"}</title>
                </rect>
              );
            })}
          </g>
        ))}

        {weeks.map((week, wi) => {
          if (wi % 4 === 0) {
            return (
              <text
                key={`label-${wi}`}
                x={wi * (cellSize + gap) + 20}
                y={7 * (cellSize + gap) + 12}
                fontSize="9"
                fill="var(--muted)"
                fontFamily="Outfit, sans-serif"
              >
                {getShortMonth(week[0])}
              </text>
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
}

export default function ChartsView({ habits, completions }) {
  const [selectedHabit, setSelectedHabit] = useState(null);
  const last30 = useMemo(() => getLast30Days(), []);
  const last12Weeks = useMemo(() => getLast12Weeks(), []);

  // Overall daily completion rate (last 30 days)
  const dailyRates = useMemo(() => {
    return last30.map((day) => {
      const completed = habits.filter((h) => completions[day]?.[h.id]).length;
      const pct = habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0;
      return { label: `${getShortDay(day)}`, value: pct };
    });
  }, [last30, habits, completions]);

  // Per-habit data for the last 30 days
  const habitChartData = useMemo(() => {
    return habits.map((habit) => {
      const data = last30.map((day) => ({
        label: `${getShortDay(day)}`,
        value: completions[day]?.[habit.id] ? 1 : 0,
      }));
      const completedDays = data.filter((d) => d.value > 0).length;
      const rate = Math.round((completedDays / 30) * 100);
      const streak = getStreak(habit.id, completions);
      return { habit, data, completedDays, rate, streak };
    });
  }, [habits, completions, last30]);

  const viewing = selectedHabit
    ? habitChartData.find((h) => h.habit.id === selectedHabit)
    : null;

  return (
    <div style={{ animation: "slideUp 0.4s ease" }}>
      {/* Overall completion trend */}
      <div style={{
        background: "var(--card)",
        borderRadius: 20,
        padding: "18px 16px",
        marginBottom: 16,
        boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
      }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
          📈 Tasa de cumplimiento — últimos 30 días
        </h3>
        <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
          Porcentaje de hábitos completados cada día
        </p>
        <BarChart data={dailyRates} color="var(--accent)" maxVal={100} />
      </div>

      {/* Habit selector */}
      <div style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        paddingBottom: 8,
        marginBottom: 16,
        WebkitOverflowScrolling: "touch",
      }}>
        {habits.map((habit) => {
          const isActive = selectedHabit === habit.id;
          return (
            <button
              key={habit.id}
              onClick={() => setSelectedHabit(isActive ? null : habit.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 12,
                border: `2px solid ${isActive ? habit.color : "var(--border)"}`,
                background: isActive ? habit.color + "22" : "var(--card)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "'Outfit', sans-serif",
                color: "var(--text)",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
                boxShadow: isActive ? `0 2px 12px ${habit.color}33` : "none",
              }}
            >
              <span>{habit.icon}</span>
              {habit.name}
            </button>
          );
        })}
      </div>

      {/* Selected habit detail */}
      {viewing ? (
        <div style={{
          background: "var(--card)",
          borderRadius: 20,
          padding: "18px 16px",
          marginBottom: 16,
          boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
          animation: "slideUp 0.3s ease",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 28 }}>{viewing.habit.icon}</span>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>{viewing.habit.name}</h3>
              <p style={{ fontSize: 12, color: "var(--muted)" }}>Últimos 30 días</p>
            </div>
          </div>

          {/* Stats row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10,
            marginBottom: 16,
          }}>
            <div style={{
              textAlign: "center",
              padding: "10px 8px",
              borderRadius: 12,
              background: viewing.habit.color + "15",
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: viewing.habit.color }}>
                {viewing.rate}%
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Cumplimiento</div>
            </div>
            <div style={{
              textAlign: "center",
              padding: "10px 8px",
              borderRadius: 12,
              background: viewing.habit.color + "15",
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: viewing.habit.color }}>
                {viewing.completedDays}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Días</div>
            </div>
            <div style={{
              textAlign: "center",
              padding: "10px 8px",
              borderRadius: 12,
              background: viewing.habit.color + "15",
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: viewing.habit.color }}>
                {viewing.streak}🔥
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Racha</div>
            </div>
          </div>

          {/* Bar chart */}
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 8 }}>
            Actividad diaria
          </p>
          <BarChart data={viewing.data} color={viewing.habit.color} maxVal={1} />

          {/* Heatmap */}
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginTop: 16, marginBottom: 8 }}>
            Mapa de actividad — 12 semanas
          </p>
          <Heatmap
            weeks={last12Weeks}
            habitId={viewing.habit.id}
            completions={completions}
            color={viewing.habit.color}
          />
        </div>
      ) : (
        /* Overview cards when no habit is selected */
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}>
          {habitChartData.map(({ habit, rate, streak, completedDays }) => (
            <button
              key={habit.id}
              onClick={() => setSelectedHabit(habit.id)}
              style={{
                background: "var(--card)",
                borderRadius: 16,
                padding: "16px 14px",
                boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "'Outfit', sans-serif",
                transition: "transform 0.2s, box-shadow 0.2s",
                color: "var(--text)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 4px 24px ${habit.color}22`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 20px rgba(0,0,0,0.04)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 22 }}>{habit.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{habit.name}</span>
              </div>

              {/* Mini progress bar */}
              <div style={{
                height: 6,
                borderRadius: 3,
                background: "var(--border)",
                marginBottom: 8,
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  borderRadius: 3,
                  background: habit.color,
                  width: `${rate}%`,
                  transition: "width 0.6s ease",
                }} />
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                color: "var(--muted)",
              }}>
                <span>{rate}% · {completedDays}/30 días</span>
                {streak > 0 && <span>🔥{streak}</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}