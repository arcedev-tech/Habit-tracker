import { useState, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import {
  DEFAULT_HABITS,
  getTodayKey,
  getWeekDates,
  getDayLabel,
  getDayNum,
  getStreak,
} from "./utils";
import Header from "./components/Header";
import ProgressCard from "./components/ProgressCard";
import HabitRow from "./components/HabitRow";
import AddHabitForm from "./components/AddHabitForm";
import StatsGrid from "./components/StatsGrid";
import ChartsView from "./components/Chartsview";
import Modal from "./components/Modal";
import Toast from "./components/Toast";

const TABS = [
  { id: "tracker", label: "Hábitos", icon: "✅" },
  { id: "charts", label: "Gráficas", icon: "📊" },
];

export default function App() {
  const [habits, setHabits] = useLocalStorage("habits-list", DEFAULT_HABITS);
  const [completions, setCompletions] = useLocalStorage("habits-completions", {});
  const [showAdd, setShowAdd] = useState(false);
  const [activeTab, setActiveTab] = useState("tracker");
  const [modalData, setModalData] = useState(null);
  const [toast, setToast] = useState(null);

  const todayKey = getTodayKey();
  const weekDates = getWeekDates();

  const toggleHabit = useCallback((habitId, dateKey) => {
    setCompletions((prev) => {
      const updated = { ...prev };
      if (!updated[dateKey]) updated[dateKey] = {};
      updated[dateKey] = { ...updated[dateKey], [habitId]: !updated[dateKey][habitId] };
      return updated;
    });
  }, [setCompletions]);

  const addHabit = useCallback((habit) => {
    setHabits((prev) => [...prev, habit]);
    setShowAdd(false);
    setToast({ message: `"${habit.name}" añadido`, icon: "✨" });
  }, [setHabits]);

  const removeHabit = useCallback((id) => {
    const habit = habits.find((h) => h.id === id);
    setModalData({
      title: "Eliminar hábito",
      message: `¿Seguro que quieres eliminar "${habit?.name}"? Se perderá todo su historial de seguimiento.`,
      onConfirm: () => {
        setHabits((prev) => prev.filter((h) => h.id !== id));
        setModalData(null);
        setToast({ message: `"${habit?.name}" eliminado`, icon: "🗑️" });
      },
    });
  }, [habits, setHabits]);

  const todayCount = habits.filter((h) => completions[todayKey]?.[h.id]).length;
  const todayTotal = habits.length;
  const todayPct = todayTotal > 0 ? (todayCount / todayTotal) * 100 : 0;
  const weekTotal = weekDates.reduce(
    (sum, d) => sum + habits.filter((h) => completions[d]?.[h.id]).length,
    0
  );
  const maxStreak = Math.max(0, ...habits.map((h) => getStreak(h.id, completions)));

  return (
    <div style={{
      maxWidth: 520,
      margin: "0 auto",
      padding: "24px 16px 40px",
    }}>
      <Header />

      {/* Tab navigation */}
      <div style={{
        display: "flex",
        gap: 4,
        marginBottom: 20,
        background: "var(--card)",
        borderRadius: 14,
        padding: 4,
        boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
      }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 11,
                border: "none",
                background: isActive ? "var(--accent)" : "transparent",
                color: isActive ? "white" : "var(--muted)",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                transition: "all 0.25s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 15 }}>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "tracker" ? (
        <>
          <ProgressCard todayCount={todayCount} todayTotal={todayTotal} />

          {/* Week grid */}
          <div style={{
            background: "var(--card)",
            borderRadius: 20,
            boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
            overflow: "hidden",
            marginBottom: 20,
            animation: "slideUp 0.6s ease",
          }}>
            {/* Day headers */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr repeat(7, 38px)",
              padding: "14px 12px 8px",
              borderBottom: "1px solid var(--border)",
            }}>
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: 1,
                display: "flex",
                alignItems: "flex-end",
              }}>
                Hábito
              </div>
              {weekDates.map((d) => {
                const isToday = d === todayKey;
                return (
                  <div key={d} style={{
                    textAlign: "center",
                    fontSize: 11,
                    fontWeight: isToday ? 700 : 400,
                    color: isToday ? "var(--accent)" : "var(--muted)",
                  }}>
                    {getDayLabel(d)}
                    <div style={{
                      fontSize: 13,
                      fontWeight: isToday ? 700 : 500,
                      color: isToday ? "var(--text)" : "var(--muted)",
                      marginTop: 2,
                    }}>
                      {getDayNum(d)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Habit rows */}
            {habits.map((habit) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                weekDates={weekDates}
                completions={completions}
                onToggle={toggleHabit}
                onRemove={removeHabit}
              />
            ))}

            {/* Add form */}
            {showAdd && (
              <AddHabitForm
                onAdd={addHabit}
                onCancel={() => setShowAdd(false)}
              />
            )}

            <button
              onClick={() => setShowAdd(!showAdd)}
              style={{
                width: "100%",
                padding: 14,
                border: "none",
                background: "transparent",
                color: "var(--accent)",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                letterSpacing: 0.5,
              }}
            >
              {showAdd ? "Cancelar" : "+ Nuevo hábito"}
            </button>
          </div>

          <StatsGrid
            maxStreak={maxStreak}
            weekTotal={weekTotal}
            weekMax={todayTotal * 7}
            todayPct={todayPct}
          />
        </>
      ) : (
        <ChartsView habits={habits} completions={completions} />
      )}

      <p style={{
        textAlign: "center",
        fontSize: 11,
        color: "var(--muted)",
        opacity: 0.6,
        marginTop: 8,
      }}>
        Tus datos se guardan localmente en este dispositivo ✓
      </p>

      {/* Custom confirm modal */}
      {modalData && (
        <Modal
          title={modalData.title}
          message={modalData.message}
          onConfirm={modalData.onConfirm}
          onCancel={() => setModalData(null)}
          confirmText="Eliminar"
          danger
        />
      )}

      {/* Toast notifications */}
      {toast && (
        <Toast
          message={toast.message}
          icon={toast.icon}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}