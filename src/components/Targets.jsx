import { useEffect, useState } from 'react'
import Modal from './Modal'
import { toast } from './Toast'

import { getEmployees } from '../services/employeeService'
import { getTargets, addTarget, deleteTarget } from '../services/targetService'

export default function Targets() {
  const [targets, setTargets] = useState([])
  const [employees, setEmployees] = useState([])
  const [open, setOpen] = useState(null)

  const load = async () => {
    const [t, e] = await Promise.all([
      getTargets(),
      getEmployees()
    ])

    setTargets(t || [])
    setEmployees(e || [])
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="fade-in">

      <div className="section-header">
        <div>
          <div className="section-title">Targets</div>
          <div className="section-meta">{targets.length} ASSIGNED</div>
        </div>

        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          + Add Target
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Target</th>
              <th>Month</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
  {employees.map(emp => {
    const target = targets.find(t => t.employee_id === emp.id)

    return (
      <tr key={emp.id}>
        <td>{emp.name}</td>
        <td>{target?.target || '-'}</td>
        <td>{target?.month || '-'}</td>
        <td>
          <span
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() => setOpen(emp.id)}
          >
            {target ? 'Edit' : 'Add'}
          </span>
        </td>
      </tr>
    )
  })}
</tbody>
        </table>
      </div>

      {open && (
        <TargetModal
          onClose={() => setOpen(null)}
          refresh={load}
          employees={employees}
          selectedEmployee={open}
        />
      )}
    </div>
  )
}


// MODAL
function TargetModal({ onClose, refresh, employees, selectedEmployee }) {
  const [form, setForm] = useState({
    employee_id: selectedEmployee || '',
    target: '',
    month: ''
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.employee_id) {
      toast('Select employee', true)
      return
    }

    try {
      await addTarget({
        employee_id: Number(form.employee_id),
        target: Number(form.target),
        month: form.month
      })

      toast('Added')
      refresh()
      onClose()

    } catch {
      toast('Error', true)
    }
  }

return (
  <Modal title="Set Target" onClose={onClose}>
    <div className="form-grid">

      <div className="form-group full">
        <label>Employee</label>
        <select value={form.employee_id} disabled>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Target</label>
        <input
          type="number"
          value={form.target}
          onChange={(e) => set('target', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Month</label>
        <input
          type="month"
          value={form.month}
          onChange={(e) => set('month', e.target.value)}
        />
      </div>

    </div>

    <div className="form-actions">
      <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
      <button className="btn btn-primary" onClick={handleSave}>Save</button>
    </div>

  </Modal>
)
}