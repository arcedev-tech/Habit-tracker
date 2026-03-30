🎯 Tracker de Hábitos

Aplicación web para hacer seguimiento de tus hábitos diarios.
Construida con React + Vite, funciona completamente en local (sin backend).

✨ Funcionalidades
Seguimiento semanal (últimos 7 días)
Hábitos personalizables (añadir/eliminar con emoji)
Rachas automáticas 🔥
Progreso diario visual (anillo + barra)
Estadísticas básicas (racha, total semanal, % del día)
Persistencia en localStorage
Modo oscuro automático
🚀 Instalación
npm install
npm run dev

Abre: http://localhost:5173

📁 Estructura
src/
├── App.jsx
├── main.jsx
├── index.css
├── utils.js
├── useLocalStorage.js
└── components/
⚙️ Scripts
npm run dev      # desarrollo
npm run build    # producción
npm run preview  # preview build
💾 Datos
Guardados en localStorage
Persisten al cerrar la app
No se sincronizan entre dispositivos