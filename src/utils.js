export const DEFAULT_HABITS = [
  { id: "h1", name: "Meditar", icon: "🧘", color: "#E8A87C" },
  { id: "h2", name: "Ejercicio", icon: "🏃", color: "#85CDCA" },
  { id: "h3", name: "Leer", icon: "📖", color: "#D4A5E5" },
  { id: "h4", name: "Agua (8 vasos)", icon: "💧", color: "#6EB5FF" },
  { id: "h5", name: "Dormir 8h", icon: "😴", color: "#FFD166" },
];

export const EMOJIS = [
  "✨", "🎯", "💪", "🧠", "🎨", "🌱", "☀️", "🔥",
  "🍎", "✍️", "🎵", "🧹", "💊", "🚶", "🛌",
];

export const COLORS = [
  "#E8A87C", "#85CDCA", "#D4A5E5", "#6EB5FF", "#FFD166",
  "#FF6B6B", "#A8E6CF", "#FFB7B2", "#B5EAD7", "#C7CEEA",
];

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function getWeekDates() {
  const today = new Date();
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export function getDayLabel(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return DAY_NAMES[d.getDay()];
}

export function getDayNum(dateStr) {
  return parseInt(dateStr.slice(8));
}

export function getStreak(habitId, completions) {
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (completions[key]?.[habitId]) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function formatTime(date) {
  return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

export function formatDate(date) {
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
