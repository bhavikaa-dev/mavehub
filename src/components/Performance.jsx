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
        (a.employee || '').trim().toLowerCase() ===
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
        ? ((totalAdmissions / target) * 100).toFixed(1)
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
                <td>{e.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}