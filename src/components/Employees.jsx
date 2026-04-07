import { useState, useEffect } from 'react'
import Modal from './Modal'
import { toast } from './Toast'
import { fmt, today } from '../hooks/utils'
import {
getEmployees,
addEmployee,
updateEmployee,
deleteEmployee
} from '../services/employeeService'

const TEAMS = ['Team Praveen', 'Team Anuj', 'Team Sapna']

export default function Employees() {
const [employees, setEmployees] = useState([])
const [open, setOpen] = useState(false)
const [editing, setEditing] = useState(null)

const loadEmployees = async () => {
const data = await getEmployees()
setEmployees(data || [])
}

useEffect(() => {
loadEmployees()
}, [])

const handleDelete = async (id) => {
if (!window.confirm('Delete employee?')) return
await deleteEmployee(id)
toast('Deleted')
loadEmployees()
}

return (
<div className="fade-in">

  <div className="section-header">
    <div>
      <div className="section-title">Employees</div>
      <div className="section-meta">{employees.length} MEMBERS</div>
    </div>

    <button
      className="btn btn-primary"
      onClick={() => {
        setEditing(null)
        setOpen(true)
      }}
    >
      + Add Employee
    </button>
  </div>

  <div className="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Team</th>
          <th>Manager</th>
          <th>Joining</th>
          <th>Salary</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {employees.map(emp => (
          <tr key={emp.id}>
            <td>{emp.name}</td>
            <td>{emp.role}</td>
            <td>{emp.team}</td>
            <td>{emp.manager || '-'}</td>
            <td>{emp.joining_date}</td>
            <td>₹{fmt(emp.salary)}</td>
            <td>
              <span
                style={{ cursor: 'pointer', marginRight: '10px' }}
                onClick={() => {
                  setEditing(emp)
                  setOpen(true)
                }}
              >
                Edit
              </span>

              <span
                style={{ cursor: 'pointer', color: 'red' }}
                onClick={() => handleDelete(emp.id)}
              >
                Del
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {open && (
    <EmpModal
      emp={editing}
      onClose={() => setOpen(false)}
      refresh={loadEmployees}
      employees={employees}
    />
  )}
</div>

)
}

// ───────── MODAL ─────────
function EmpModal({ emp, onClose, refresh, employees }) {
const [form, setForm] = useState({
name: '',
role: '',
team: 'Alpha',
manager_id: '',
manager: '',
joining_date: today(),
salary: ''
})

// ✅ FIX: update form when editing changes
useEffect(() => {
if (emp) {
setForm({
name: emp.name || '',
role: emp.role || '',
team: emp.team || 'Alpha',
manager_id: emp.manager_id ?? '',
manager: emp.manager || '',
joining_date: emp.joining_date || today(),
salary: emp.salary || ''
})
} else {
setForm({
name: '',
role: '',
team: 'Alpha',
manager_id: '',
manager: '',
joining_date: today(),
salary: ''
})
}
}, [emp])

const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

const handleSave = async () => {
if (!form.name.trim()) {
toast('Name required', true)
return
}

const payload = {
  name: form.name,
  role: form.role,
  team: form.team,
  manager_id: form.manager_id ? Number(form.manager_id) : null,
  manager: form.manager,
  joining_date: form.joining_date || null,
  salary: form.salary ? Number(form.salary) : null,
}

try {
  if (emp) {
    await updateEmployee(emp.id, payload)
    toast('Updated')
  } else {
    await addEmployee(payload)
    toast('Added')
  }

  refresh()
  onClose()

} catch (err) {
  console.error("SAVE ERROR:", err)
  toast('Error saving', true)
}

}

return (
<Modal title={emp ? 'Edit Employee' : 'Add Employee'} onClose={onClose}>
<div className="form-grid">

    <div className="form-group full">
      <label>Name</label>
      <input value={form.name} onChange={e => set('name', e.target.value)} />
    </div>

    <div className="form-group">
      <label>Role</label>
      <input value={form.role} onChange={e => set('role', e.target.value)} />
    </div>

    <div className="form-group">
      <label>Team</label>
      <select value={form.team} onChange={e => set('team', e.target.value)}>
        {TEAMS.map(t => <option key={t}>{t}</option>)}
      </select>
    </div>

    <div className="form-group">
      <label>Manager</label>
      <select
        value={form.manager_id ?? ''}
        onChange={(e) => {
          const value = e.target.value
          const id = value ? Number(value) : null
          const selected = employees.find(x => x.id === id)

          setForm(f => ({
            ...f,
            manager_id: value === '' ? '' : id,
            manager: selected?.name || ''
          }))
        }}
      >
        <option value="">No Manager</option>
        {employees.map(e => (
          <option key={e.id} value={e.id}>
            {e.name}
          </option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label>Joining</label>
      <input
        type="date"
        value={form.joining_date}
        onChange={e => set('joining_date', e.target.value)}
      />
    </div>

    <div className="form-group">
      <label>Salary</label>
      <input
        type="number"
        value={form.salary}
        onChange={e => set('salary', e.target.value)}
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