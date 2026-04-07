# MaveHub — HR Intelligence Dashboard

A full React + Vite + Tailwind dark-themed HR dashboard.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher  
- **npm** v9 or higher  
  Check with: `node -v` and `npm -v`

---

### Step 1 — Install dependencies

Open a terminal in this folder and run:

```bash
npm install
```

This installs all packages listed in `package.json` including:
- React 18
- Vite 5
- Tailwind CSS 3
- Chart.js + react-chartjs-2

---

### Step 2 — Start the dev server

```bash
npm run dev
```

Open your browser at **http://localhost:5173**

---

### Step 3 — Build for production (optional)

```bash
npm run build
```

Output goes to the `dist/` folder. Preview it with:

```bash
npm run preview
```

---

## 📁 Project Structure

```
mavehub/
├── index.html                  # HTML entry point
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite config
├── tailwind.config.js          # Tailwind config
├── postcss.config.js           # PostCSS config
└── src/
    ├── main.jsx                # React root render
    ├── App.jsx                 # Main app — routing & layout
    ├── index.css               # Global styles + CSS variables
    ├── data/
    │   └── seedData.js         # Initial demo data
    ├── hooks/
    │   ├── useStore.js         # Central state management (useState)
    │   └── utils.js            # Helper functions (fmt, today, etc.)
    └── components/
        ├── Sidebar.jsx         # Left navigation sidebar
        ├── Header.jsx          # Top bar with date filter
        ├── Modal.jsx           # Reusable modal wrapper
        ├── Toast.jsx           # Toast notification system
        ├── Dashboard.jsx       # Overview with Chart.js charts
        ├── Employees.jsx       # Employee CRUD table
        ├── Hierarchy.jsx       # Org tree view
        ├── Payroll.jsx         # Payroll records + employee detail
        ├── Admissions.jsx      # Admission entries
        ├── Performance.jsx     # Team + employee performance metrics
        ├── Targets.jsx         # Team targets vs achieved
        ├── Expenses.jsx        # Expense tracking
        ├── ATS.jsx             # Applicant tracking system
        └── Reminders.jsx       # Tasks and reminders
```

---

## ✨ Features

- **10 sections**: Dashboard, Employees, Hierarchy, Payroll, Admissions, Performance, Targets, Expenses, ATS, Reminders
- **Dark theme** with vivid accent colours (blue, purple, teal, pink, amber)
- **Global date filter** — filter admissions and expenses by date range
- **Chart.js charts** — doughnut, bar, and grouped bar charts
- **Full CRUD** — add, edit, delete across all modules
- **Org tree** — visual hierarchy with manager → employee structure
- **ATS pipeline** — status pills to filter candidates by stage
- **Recurring reminders** — auto-reschedules next month on completion
- **Toast notifications** — lightweight feedback on every action

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 5 | Dev server + bundler |
| Tailwind CSS 3 | Utility classes (layout helpers) |
| Chart.js 4 | Charts on dashboard |
| react-chartjs-2 | React wrapper for Chart.js |
| CSS Variables | Design tokens (colours, spacing, shadows) |

---

## 📝 Notes

- All data is **in-memory only** — it resets on page refresh. To persist data, connect `useStore.js` to `localStorage` or a backend API.
- Fonts load from Google Fonts (requires internet). For offline use, self-host the `Syne` and `DM Mono` fonts.
