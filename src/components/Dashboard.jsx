import { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'
import { fmt } from '../hooks/utils'

import { getEmployees } from '../services/employeeService'
import { getAdmissions } from '../services/admissionService'
import {getTargets } from '../services/targetService'

const CHART_DEFAULTS = {
  color: '#374151',
  gridColor: '#272d45',
  tickColor: '#556085',
  font: 'DM Mono',
}

function StatCard({ label, value, sub, icon, color }) {
  return (
    <div className="card" style={{ '--accent-line': color }}>
      <div className="card-icon">{icon}</div>
      <div className="card-label">{label}</div>
      <div className="card-value">{value}</div>
      <div className="card-sub">{sub}</div>
    </div>
  )
}

function ChartCard({ title, children }) {
  return (
    <div className="chart-box">
      <h3>{title}</h3>
      {children}
    </div>
  )
}

export default function Dashboard() {
  const [employees, setEmployees] = useState([])
  const [admissions, setAdmissions] = useState([])
  const totalAdmissions = admissions.length
  const [targets, setTargets] = useState([])

  const revenueRef = useRef(null)
  const admissionsRef = useRef(null)
  const targetRef = useRef(null)

  const revenueChart = useRef(null)
  const admissionsChart = useRef(null)
  const targetChart = useRef(null)

  // ✅ LOAD DATA
  useEffect(() => {
    const load = async () => {
      const [emp, adm, tar] = await Promise.all([
        getEmployees(),
        getAdmissions(),
        getTargets()
      ])
      setTargets(tar || [])
      setEmployees(emp || [])
      setAdmissions(adm || [])
    }

    load()
  }, [])

  // ✅ CALCULATIONS
// 🔥 ADMISSIONS BY TEAM
const admissionsByTeam = employees.map(e => {
  const empAdm = admissions.filter(
    a => (a.employee || '').trim().toLowerCase() === (e.name || '').trim().toLowerCase()
  )

  return {
    team: e.team,
    admissions: empAdm.length
  }
})

const teamData = Object.values(
  admissionsByTeam.reduce((acc, curr) => {
    if (!acc[curr.team]) {
      acc[curr.team] = { team: curr.team, admissions: 0 }
    }
    acc[curr.team].admissions += curr.admissions
    return acc
  }, {})
)


// 🔥 ADMISSIONS THIS MONTH
const currentMonth = new Date().getMonth()
const currentYear = new Date().getFullYear()

const admissionsThisMonth = admissions.filter(a => {
  if (!a.date) return false

const parts = a.date.includes('-')
  ? a.date.split('-')
  : a.date.split('/')

const d = new Date(parts[2], parts[1] - 1, parts[0])
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
})


  const monthlyData = employees.map(e => {
  const empAdm = admissionsThisMonth.filter(
    a => (a.employee || '').trim().toLowerCase() === (e.name || '').trim().toLowerCase()
  )

  return {
    name: e.name,
    admissions: empAdm.length
  }
})
  const totalRev = admissions.reduce((s, a) => s + (a.revenue || 0), 0)
  const totalPts = admissions.reduce((s, a) => s + (a.points || 0), 0)

  const stats = [
    { label: 'Total Employees', value: employees.length, sub: 'Across teams', icon: '👥', color: 'var(--accent)' },
    { label: 'Total Revenue', value: '₹' + fmt(totalRev), sub: admissions.length + ' admissions', icon: '💰', color: 'var(--accent3)' },
    { label: 'Total Points', value: totalPts, sub: 'Across all teams', icon: '⭐', color: 'var(--accent5)' },
 {   
     label: 'Total Admissions',
     value: admissions.length,
     sub: 'All admissions',
     icon: '🎓',
     color: 'var(--accent2)'
 }, 
  ]

  const teams = ['Team Praveen', 'Team Anuj', 'Team Sapna']
  const teamColors = ['#4d9fff', '#a78bfa', '#10e8a8']

  // ✅ TEAM REVENUE
  const teamRevenue = teams.map(t => {
    const ids = employees.filter(e => e.team === t).map(e => e.id)

    return admissions
      .filter(a => ids.includes(a.employee_id))
      .reduce((s, a) => s + (a.revenue || 0), 0)
  })

  // ✅ EMPLOYEE ADMISSIONS
  const empAdm = employees
    .map(e => ({
      name: e.name?.split(' ')[0],
      count: admissions.filter(a => a.employee_id === e.id).length
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)

  // ✅ TEMP TARGET
  const teamTarget = teams.map(t => {
  const ids = employees.filter(e => e.team === t).map(e => e.id)

  return targets
    .filter(tg => ids.includes(tg.employee_id))
    .reduce((s, tg) => s + (tg.target || 0), 0)
})

  // ✅ CHARTS (SAFE)
  useEffect(() => {
    if (!employees.length || !revenueRef.current) return

    revenueChart.current?.destroy()

revenueChart.current = new Chart(revenueRef.current, {
  type: 'doughnut',
  data: {
    labels: teamData.map(t => t.team),
    datasets: [{
      data: teamData.map(t => t.admissions),
      backgroundColor: teamColors,
      borderWidth: 0
    }]
  },
  options: {
    plugins: {
      legend: {
        labels: { color: CHART_DEFAULTS.color }
      }
    },
    cutout: '65%',
  }
})

    // Admissions Chart
    if (admissionsRef.current) {
  admissionsChart.current?.destroy()

  admissionsChart.current = new Chart(admissionsRef.current, {
    type: 'bar',
    data: {
      labels: monthlyData.map(d => d.name),
      datasets: [{
        label: 'Admissions',
        data: monthlyData.map(d => d.admissions),
        backgroundColor: '#4fd1ff',
        borderRadius: 6
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: CHART_DEFAULTS.color }
        }
      },
      scales: {
        x: {
          ticks: { color: CHART_DEFAULTS.color }
        },
        y: {
          ticks: { color: CHART_DEFAULTS.color },
          beginAtZero: true
        }
      }
    }
  })
}

    // Target Chart
    if (targetRef.current) {
      targetChart.current?.destroy()
      targetChart.current = new Chart(targetRef.current, {
        type: 'bar',
        data: {
          labels: teams,
          datasets: [
            { label: 'Target', data: teamTarget, backgroundColor: 'rgba(255,94,122,0.4)' },
            { label: 'Achieved', data: teamRevenue, backgroundColor: 'rgba(16,232,168,0.6)' },
          ],
        },
      })
    }

    return () => {
      revenueChart.current?.destroy()
      admissionsChart.current?.destroy()
      targetChart.current?.destroy()
    }

  }, [employees, admissions])

  return (
    <div className="fade-in">

      <div className="section-header">
        <div>
          <div className="section-title">Welcome back 👋</div>
          <div className="section-meta">REAL-TIME OVERVIEW</div>
        </div>
      </div>

      <div className="cards-grid">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="two-col">
        <ChartCard title="Revenue by Team">
          <canvas ref={revenueRef} />
        </ChartCard>

        <ChartCard title="Admissions This Month">
          <canvas ref={admissionsRef} />
        </ChartCard>
      </div>

      <ChartCard title="Team Performance vs Target">
        <canvas ref={targetRef} />
      </ChartCard>

    </div>
  )
}