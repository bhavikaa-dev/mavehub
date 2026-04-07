import React from 'react'

const NAV = [
  { section: 'dashboard',   icon: '◈', label: 'Dashboard',   group: 'Core' },
  { section: 'employees',   icon: '◉', label: 'Employees',   group: 'Core' },
  { section: 'hierarchy',   icon: '⬡', label: 'Hierarchy',   group: 'Core' },
  { section: 'payroll',     icon: '◎', label: 'Payroll',     group: 'Core' },

  { section: 'admissions',  icon: '⊕', label: 'Admissions',  group: 'Operations' },
  { section: 'performance', icon: '◈', label: 'Performance', group: 'Operations' },

  // 🔥 LEADERBOARD (PLACED CORRECTLY)
  { section: 'leaderboard', icon: '🏆', label: 'Leaderboard', group: 'Operations' },

  { section: 'targets',     icon: '◎', label: 'Targets',     group: 'Operations' },
  { section: 'expenses',    icon: '⊞', label: 'Expenses',    group: 'Operations' },

  { section: 'ats',         icon: '⊛', label: 'ATS',         group: 'Recruitment' },
  { section: 'reminders',   icon: '◷', label: 'Reminders',   group: 'Productivity', badge: true },
]

export default function Sidebar({ activeSection, onNavigate, pendingReminders }) {
  const groups = [...new Set(NAV.map(n => n.group))]

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">MH</div>
        <div>
          <div className="logo-text">MaveHub</div>
          <div className="logo-sub">HR Intelligence</div>
        </div>
      </div>

      {groups.map(group => (
        <React.Fragment key={group}>
          <div className="sidebar-section-label">{group}</div>
          {NAV.filter(n => n.group === group).map(item => (
            <div
              key={item.section}
              className={`nav-item ${activeSection === item.section ? 'active' : ''}`}
              onClick={() => onNavigate(item.section)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.badge && pendingReminders > 0 && (
                <span className="nav-badge">{pendingReminders}</span>
              )}
            </div>
          ))}
        </React.Fragment>
      ))}

      <div className="sidebar-footer">
        <div className="avatar-sm">AD</div>
        <div className="footer-info">
          <div className="fn">Admin</div>
          <div className="role">Super Admin</div>
        </div>
      </div>
    </aside>
  )
}