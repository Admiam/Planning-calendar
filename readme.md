# Timeline Calendar

A lightweight React + TypeScript app for managing and scheduling orders.

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Run in development**
   ```bash
   npm run dev
   ```
3. **Build for production**
   ```bash
   npm run build
   ```

## ⚙️ Available Scripts

- `npm run dev` — start dev server with HMR
- `npm run build` — bundle for production
- `npm run preview` — preview production build

## 📁 Project Structure

```
src/
├─ components/      # Calendar, modals, sidebar tree
├─ store/           # Zustand state (events/orders)
├─ utils/           # Date helpers
├─ App.tsx          # Layout & routing
└─ main.tsx         # Entrypoint (Bootstrap CSS import)
```

## ✨ Features

- Click calendar slots to **add/edit** events
- **Drag-and-drop** and selectable week/day/month views
- Color-coded by status: **new**, **in-prep**, **done**
- Sidebar: **collapsible** tree of events
- **Confirm before deletion** modal

## 📌 Customize

- Change colors in `eventPropGetter` (Calendar) or badge helpers (EventCards).
- Adjust date formats in `date-fns` calls.
- Extend store (e.g. add persistence).

---

Happy scheduling!

