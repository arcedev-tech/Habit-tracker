import { useEffect } from "react";

export default function Toast({ message, icon = "✓", onClose, duration = 2500 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div style={{
      position: "fixed",
      bottom: 32,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 1001,
      animation: "toastIn 0.3s ease, toastOut 0.3s ease forwards",
      animationDelay: `0s, ${duration - 300}ms`,
    }}>
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        fontFamily: "'Outfit', sans-serif",
      }}>
        <span style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: "var(--accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          color: "white",
          fontWeight: 700,
          flexShrink: 0,
        }}>
          {icon}
        </span>
        <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>
          {message}
        </span>
      </div>

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateX(-50%) translateY(0); }
          to { opacity: 0; transform: translateX(-50%) translateY(20px); }
        }
      `}</style>
    </div>
  );
}