import { useState, useEffect } from 'react'
import Sidebar     from './components/Sidebar'
import Header      from './components/Header'
import Toast       from './components/Toast'
import Dashboard   from './components/Dashboard'
import Employees   from './components/Employees'
import Hierarchy   from './components/Hierarchy'
import Payroll     from './components/Payroll'
import Admissions  from './components/Admissions'
import Performance from './components/Performance'
import Targets     from './components/Targets'
import Expenses    from './components/Expenses'
import ATS         from './components/ATS'
import Reminders   from './components/Reminders'
import Leaderboard from './components/Leaderboard'
import { useStore } from './hooks/useStore'


// ✅ Supabase services
import { getEmployees } from './services/employeeService'
import { getTeams } from './services/teamService'
import { getAdmissions } from './services/admissionService'
import { getTargets } from './services/targetService' // 🔥 ADD THIS

export default function App() {
  const [section, setSection] = useState('dashboard')
  const store = useStore()

  const pendingReminders = store.reminders.filter(r => !r.done).length

  function handleApplyFilter(from, to) {
    store.setFilter({ from: from || null, to: to || null })
  }

  function handleClearFilter() {
    store.setFilter({ from: null, to: null })
  }

  // 🔥 LOAD EMPLOYEES
  const loadEmployees = async () => {
    try {
      const data = await getEmployees()
      store.replaceEmployees(data || [])
    } catch (err) {
      console.error('LOAD EMP ERROR:', err)
    }
  }

  // 🔥 LOAD TEAMS
  const loadTeams = async () => {
    try {
      const data = await getTeams()
      store.replaceTeams(data || [])
    } catch (err) {
      console.error('LOAD TEAM ERROR:', err)
    }
  }

  // 🔥 LOAD ADMISSIONS
  const loadAdmissions = async () => {
    try {
      const data = await getAdmissions()
      store.replaceAdmissions(data || [])
    } catch (err) {
      console.error('LOAD ADMISSION ERROR:', err)
    }
  }

  // 🔥 LOAD TARGETS (NEW)
  const loadTargets = async () => {
    try {
      const data = await getTargets()
      store.replaceTargets(data || [])
    } catch (err) {
      console.error('LOAD TARGET ERROR:', err)
    }
  }

  // 🔥 INITIAL LOAD (ALL DATA)
  useEffect(() => {
    loadEmployees()
    loadTeams()
    loadAdmissions()
    loadTargets() // 🔥 ADD THIS
  }, [])

  // 🔥 PASS TO ALL PAGES
  const sectionProps = {
    store,
    refreshEmployees: loadEmployees,
    refreshTeams: loadTeams,
    refreshAdmissions: loadAdmissions,
    refreshTargets: loadTargets, // 🔥 ADD THIS
  }

  const sections = {
    dashboard:   <Dashboard   {...sectionProps} />,
    employees:   <Employees   {...sectionProps} />,
    hierarchy:   <Hierarchy   {...sectionProps} />,
    payroll:     <Payroll     {...sectionProps} />,
    admissions:  <Admissions  {...sectionProps} />,
    performance: <Performance {...sectionProps} />,
    targets:     <Targets     {...sectionProps} />,
    expenses:    <Expenses    {...sectionProps} />,
    ats:         <ATS         {...sectionProps} />,
    reminders:   <Reminders   {...sectionProps} />,
    leaderboard: <Leaderboard {...sectionProps} />,
  }

  return (
    <div className="app">
      <Sidebar
        activeSection={section}
        onNavigate={setSection}
        pendingReminders={pendingReminders}
      />

      <div className="main">
        <Header
          activeSection={section}
          onApplyFilter={handleApplyFilter}
          onClearFilter={handleClearFilter}
        />

        <div className="content">
          {sections[section]}
        </div>
      </div>

      <Toast />
    </div>
  )
}