import { useEffect, useState } from 'react'
import { getEmployees } from '../services/employeeService'
import { getAdmissions } from '../services/admissionService'
import { fmt } from '../hooks/utils'

export default function Leaderboard() {
  const [employees, setEmployees] = useState([])
  const [admissions, setAdmissions] = useState([])

  useEffect(() => {
    const load = async () => {
      const [emp, adm] = await Promise.all([
        getEmployees(),
        getAdmissions()
      ])

      setEmployees(emp || [])
      setAdmissions(adm || [])
    }

    load()
  }, [])

  const leaderboard = (employees || []).map(e => {

    const empAdm = (admissions || []).filter(
      a =>
        (a?.employee_name || '').trim().toLowerCase() ===
        (e?.name || '').trim().toLowerCase()
    )

    const revenue = empAdm.reduce(
      (s, a) => s + Number(a?.revenue || 0),
      0
    )

    const points = empAdm.reduce(
      (s, a) => s + Number(a?.points || 0),
      0
    )

    return {
      ...e,
      revenue,
      points,
      admissions: empAdm.length
    }
  })
  .sort((a, b) => b.admissions - a.admissions)

  return (
    <div className="fade-in">

      <div className="section-header">
        <div>
          <div className="section-title">Leaderboard 🏆</div>
          <div className="section-meta">TOP PERFORMERS</div>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Team</th>
              <th>Admissions</th>
              <th>Revenue</th>
              <th>Points</th>
            </tr>
          </thead>

          <tbody>
            {leaderboard.map((e, i) => (
              <tr key={e.id}>
                <td>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </td>
                <td>{e.name}</td>
                <td>{e.team}</td>
                <td>{e.admissions}</td>
                <td>₹{fmt(e.revenue)}</td>
                <td>{e.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}