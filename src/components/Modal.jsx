import { useEffect } from "react";

export default function Modal({ title, message, onConfirm, onCancel, confirmText = "Eliminar", cancelText = "Cancelar", danger = false }) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
        animation: "modalOverlayIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--card)",
          borderRadius: 20,
          padding: "28px 24px 20px",
          maxWidth: 340,
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          animation: "modalIn 0.25s ease",
        }}
      >
        <h3 style={{
          fontSize: 17,
          fontWeight: 700,
          marginBottom: 8,
          fontFamily: "'Outfit', sans-serif",
        }}>
          {title}
        </h3>

        <p style={{
          fontSize: 14,
          color: "var(--muted)",
          lineHeight: 1.5,
          marginBottom: 24,
          fontFamily: "'Outfit', sans-serif",
        }}>
          {message}
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 12,
              border: "2px solid var(--border)",
              background: "transparent",
              color: "var(--text)",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
              transition: "all 0.15s",
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 12,
              border: "none",
              background: danger ? "#FF6B6B" : "var(--accent)",
              color: "white",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
              transition: "all 0.15s",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.9) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}