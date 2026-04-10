import { useEffect, useState } from 'react'
import { getEmployees } from '../services/employeeService'
import { getAdmissions } from '../services/admissionService'
import { getTargets } from '../services/targetService'
import { fmt } from '../hooks/utils'

export default function Performance() {
  const [employees, setEmployees] = useState([])
  const [admissions, setAdmissions] = useState([])
  const [targets, setTargets] = useState([])

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

  const data = (employees || []).map(e => {
    const empAdm = (admissions || []).filter(
      a =>
        (a.employee_name || '').trim().toLowerCase() ===
        (e.name || '').trim().toLowerCase()
    )

    const empTarget = (targets || []).find(
      t => Number(t.employee_id) === Number(e.id)
    )

    const totalAdmissions = empAdm.length

    const revenue = empAdm.reduce(
      (s, a) => s + Number(a.revenue || 0),
      0
    )

    const points = empAdm.reduce(
      (s, a) => s + Number(a.points || 0),
      0
    )

    const target = Number(empTarget?.target || 0)

    const percentage =
      target > 0
        ? Math.round((totalAdmissions / target) * 100)
        : 0

    return {
      ...e,
      admissions: totalAdmissions,
      revenue,
      points,
      target,
      percentage
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
            {data.map(e => (
              <tr key={e.id}>
                <td>{e.name || '-'}</td>
                <td>{e.team || '-'}</td>
                <td>{e.admissions}</td>
                <td>₹{fmt ? fmt(e.revenue) : e.revenue}</td>
                <td>{e.points}</td>
                <td>{e.target}</td>
                <td>
  {(() => {
    const percent = Number(e.percentage || 0)

    let color = '#ef4444' // red

    if (percent > 75) color = '#22c55e'      // green
    else if (percent > 50) color = '#eab308' // yellow
    else if (percent > 35) color = '#f97316' // orange

    return (
      <div style={{
        width: '120px',
        background: '#1f2937',
        borderRadius: '6px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percent}%`,
          background: color,
          padding: '4px 0',
          textAlign: 'center',
          fontSize: '12px',
          color: 'white'
        }}>
          {percent}%
        </div>
      </div>
    )
  })()}
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}