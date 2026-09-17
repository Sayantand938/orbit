# Orbit — Local-First Time Tracker

Orbit is a privacy-focused, offline-capable time tracking application that runs entirely in your browser. It features a clean, responsive interface, detailed productivity analytics, and robust data management—all without requiring a backend server or user account.

## ✨ Features

- ⏱️ **Precision Timer**: Start, stop, and discard sessions with sub-second accuracy.
- 📊 **Dashboard Analytics**: Track total time, average session/daily duration, most/least productive days, and 8+ hour streaks.
- 📅 **History & Logs**: Review daily sessions with an hourly breakdown chart. Edit or delete individual sessions as needed.
- 💾 **Local-First Storage**: All data is securely stored in your browser's IndexedDB. No data leaves your device.
- 📤 **Data Portability**: Export your sessions to JSON or import existing data (with merge/replace options).
- 🌓 **Theme Support**: Light, Dark, and System modes (press `D` anywhere to quickly toggle).
- 📱 **PWA Ready**: Installable on desktop and mobile, with offline support and automatic background updates.

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 + `tw-animate-css`
- **UI Components**: shadcn/ui (built on `@base-ui/react`)
- **State Management**: Zustand (persisted to IndexedDB via Dexie)
- **Charts**: Recharts
- **Date Handling**: `date-fns` + `react-day-picker`
- **PWA**: `vite-plugin-pwa` (Workbox)

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [pnpm](https://pnpm.io/) (or npm/yarn)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/orbit.git
   cd orbit