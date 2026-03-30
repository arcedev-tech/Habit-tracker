import { useState } from "react";
import { EMOJIS, COLORS } from "../utils";

export default function AddHabitForm({ onAdd, onCancel }) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("✨");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({
      id: "h" + Date.now(),
      name: name.trim(),
      icon: emoji,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
    setName("");
    setEmoji("✨");
  };

  return (
    <div style={{
      padding: "14px 12px",
      borderBottom: "1px solid var(--border)",
      animation: "slideDown 0.3s ease",
      overflow: "hidden",
    }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        {EMOJIS.map((e) => (
          <button
            key={e}
            onClick={() => setEmoji(e)}
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              border: `2px solid ${emoji === e ? "var(--accent)" : "var(--border)"}`,
              background: emoji === e ? "color-mix(in srgb, var(--accent) 15%, transparent)" : "transparent",
              cursor: "pointer",
              fontSize: 16,
              transition: "all 0.15s",
            }}
          >
            {e}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Nombre del hábito..."
          autoFocus
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 10,
            border: "2px solid var(--border)",
            background: "var(--bg)",
            color: "var(--text)",
            fontSize: 14,
            fontFamily: "'Outfit', sans-serif",
            outline: "none",
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 18px",
            borderRadius: 10,
            border: "none",
            background: "var(--accent)",
            color: "white",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          Añadir
        </button>
      </div>
    </div>
  );
}
