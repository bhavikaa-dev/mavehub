import { useState } from 'react'

const TITLES = {
  dashboard: 'Dashboard', employees: 'Employees', hierarchy: 'Hierarchy',
  payroll: 'Payroll', admissions: 'Admissions', performance: 'Performance',
  targets: 'Targets', expenses: 'Expenses', ats: 'ATS', reminders: 'Reminders',
}
const SUBTITLES = {
  dashboard: 'OVERVIEW', employees: 'TEAM DIRECTORY', hierarchy: 'ORG TREE',
  payroll: 'SALARY & INCENTIVES', admissions: 'ENROLMENTS', performance: 'METRICS',
  targets: 'TEAM GOALS', expenses: 'COST MANAGEMENT', ats: 'APPLICANT TRACKING', reminders: 'TASKS',
}

export default function Header({ activeSection, onApplyFilter, onClearFilter }) {
  const [from, setFrom] = useState('')
  const [to,   setTo]   = useState('')

  return (
    <header className="header">
      <div>
        <span className="header-title">{TITLES[activeSection]}</span>
        <span className="header-subtitle">{SUBTITLES[activeSection]}</span>
      </div>
      <div style={{ flex: 1 }} />
      <div className="gf-wrap">
        <span>📅</span>
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
        <span className="gf-sep">→</span>
        <input type="date" value={to} onChange={e => setTo(e.target.value)} />
        <button className="btn-filter" onClick={() => onApplyFilter(from, to)}>Filter</button>
        <button className="btn-filter clear" onClick={() => { setFrom(''); setTo(''); onClearFilter(); }}>Clear</button>
      </div>
    </header>
  )
}
