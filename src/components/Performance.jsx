import { useEffect, useState } from 'react'
import { getEmployees } from '../services/employeeService'
import { getAdmissions } from '../services/admissionService'
import { getTargets } from '../services/targetService'
import { fmt } from '../hooks/utils'

export default function Performance() {
  const [employees, setEmployees] = useState([])
  const [admissions, setAdmissions] = useState([])
  const [targets, setTargets] = useState([])
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  // 🌍 IST DATE
  const now = new Date()
  const istDate = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  )

  const currentMonth = istDate.getMonth()
  const currentYear = istDate.getFullYear()

  // ✅ LOAD DATA
  useEffect(() => {
    const load = async () => {
      try {
        const [emp, adm, tar] = await Promise.all([
          getEmployees(),
          getAdmissions(),
          getTargets()
        ])

        setEmployees(emp || [])
        setAdmissions(adm || [])
        setTargets(tar || [])
      } catch (err) {
        console.error('LOAD ERROR:', err)
      }
    }

    load()
  }, [])

  // ✅ SET CURRENT MONTH RANGE
  useEffect(() => {
    const current = new Date()

    const ist = new Date(
      current.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    )

    const firstDay = new Date(ist.getFullYear(), ist.getMonth(), 1)
    const lastDay = new Date(ist.getFullYear(), ist.getMonth() + 1, 0)

    setFromDate(firstDay.toISOString().split('T')[0])
    setToDate(lastDay.toISOString().split('T')[0])
  }, [])

  // ✅ MAIN DATA LOGIC
  const data = (employees || []).map(e => {
    const empId = Number(e.id)

    const empAdmissions = (admissions || []).filter(a => {
      const d = new Date(a.date)

      return (
        Number(a.employee_id) === empId &&
        (!fromDate || d >= new Date(fromDate)) &&
        (!toDate || d <= new Date(toDate))
      )
    })

    const totalAdmissions = empAdmissions.length

    const totalRevenue = empAdmissions.reduce(
      (sum, a) => sum + Number(a.revenue || 0),
      0
    )

    const totalPoints = empAdmissions.reduce(
      (sum, a) => sum + Number(a.points || 0),
      0
    )

    const salary = Number(e.salary || 0)

    // 👉 TARGET (IMPORTANT)
    const empTarget = (targets || []).find(t =>
      Number(t.employee_id) === empId &&
      new Date(t.month).getMonth() === currentMonth &&
      new Date(t.month).getFullYear() === currentYear
    )

    const targetValue = Number(empTarget?.target || 0)

    // 👉 % ACHIEVED
    const percent = targetValue > 0
      ? (totalRevenue / targetValue) * 100
      : 0

    // 👉 PERFORMANCE COLOR
    let performance = 'red'

    if (salary > 0) {
      if (totalRevenue >= salary * 20) performance = 'green'
      else if (totalRevenue >= salary * 15) performance = 'orange'
      else if (totalRevenue >= salary * 10) performance = 'yellow'
    }

    return {
      ...e,
      admissions: totalAdmissions,
      revenue: totalRevenue,
      points: totalPoints,
      salary,
      performance,
      target: targetValue,
      percent
    }
  })

  return (
    <div className="fade-in">
      <div className="section-header">
        <div>
          <div className="section-title">Performance</div>
          <div className="section-meta">EMPLOYEE STATS</div>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Team</th>
              <th>Admissions</th>
              <th>Revenue</th>
              <th>Points</th>
              <th>Target</th>
              <th>% Achieved</th>
            </tr>
          </thead>

          <tbody>
            {data.map(e => {
              const percent = Number(e.percent || 0)

              let color = '#ef4444'
              if (percent >= 200) color = '#22c55e'
              else if (percent >= 150) color = '#f97316'
              else if (percent >= 100) color = '#eab308'

              const safePercent = percent === 0 ? 5 : Math.min(percent, 100)

              return (
                <tr key={e.id}>
                  <td>{e.name || '-'}</td>
                  <td>{e.team || '-'}</td>
                  <td>{e.admissions}</td>
                  <td>₹{fmt ? fmt(e.revenue) : e.revenue}</td>
                  <td>{e.points}</td>
                  <td>{e.target}</td>

                  <td>
                    <div style={{
                      width: '120px',
                      background: '#1f2937',
                      borderRadius: '6px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: safePercent + '%',
                        background: color,
                        padding: '4px 0',
                        textAlign: 'center',
                        fontSize: '12px',
                        color: 'white'
                      }}>
                        {Math.round(percent)}%
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>

        </table>
      </div>
    </div>
  )
}