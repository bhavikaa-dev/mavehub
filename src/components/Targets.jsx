import { useEffect, useState } from 'react'
import Modal from './Modal'
import { toast } from './Toast'

import { getEmployees } from '../services/employeeService'
import { getTargets, addTarget, deleteTarget } from '../services/targetService'

export default function Targets() {
  const [targets, setTargets] = useState([])
  const [employees, setEmployees] = useState([])
  const [open, setOpen] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState('')

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

  // ✅ AUTO LATEST MONTH
  useEffect(() => {
    if (targets.length > 0) {
      const latest = [...targets]
        .sort((a, b) => b.month.localeCompare(a.month))[0]

      setSelectedMonth(latest.month)
    }
  }, [targets])

  return (
    <div className="fade-in">

      <div className="section-header">
        <div>
          <div className="section-title">Targets</div>
          <div className="section-meta">{targets.length} ASSIGNED</div>
        </div>

        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ marginRight: '10px' }}
        />

        <button className="btn btn-primary" onClick={() => setOpen('new')}>
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
              const empTargets = targets.filter(
                t => Number(t.employee_id) === Number(emp.id)
              )

              const target = selectedMonth
                ? empTargets.find(t => t.month === selectedMonth)
                : empTargets.sort((a, b) =>
                    b.month.localeCompare(a.month)
                  )[0]

              return (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{target?.target || '-'}</td>
                  <td>{target?.month || '-'}</td>
                  <td style={{ display: 'flex', gap: '10px' }}>
                    <span
                      style={{ color: 'blue', cursor: 'pointer' }}
                      onClick={() => setOpen(emp.id)}
                    >
                      {target ? 'Edit' : 'Add'}
                    </span>

                    {target && (
                      <span
                        style={{ color: 'red', cursor: 'pointer' }}
                        onClick={async () => {
                          await deleteTarget(target.id)
                          toast('Deleted')
                          load()
                        }}
                      >
                        Delete
                      </span>
                    )}
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
          selectedMonth={selectedMonth}
        />
      )}
    </div>
  )
}


// ================= MODAL =================

function TargetModal({
  onClose,
  refresh,
  employees,
  selectedEmployee,
  selectedMonth
}) {
  const [form, setForm] = useState({
    employee_id:
      selectedEmployee === 'new'
        ? employees[0]?.id || ''
        : selectedEmployee,
    target: '',
    month: selectedMonth || ''
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.employee_id) {
      toast('Select employee', true)
      return
    }

    if (!form.target) {
      toast('Enter target', true)
      return
    }

    if (!form.month) {
      toast('Select month', true)
      return
    }

    try {
      const selectedEmp = employees.find(
        e => Number(e.id) === Number(form.employee_id)
      )

      if (!selectedEmp) {
        toast('Employee not found', true)
        return
      }

      await addTarget({
        employee_id: selectedEmp.id,
        employee_name: selectedEmp.name,
        target: Number(form.target),
        month: form.month
      })

      toast('Saved')
      refresh()
      onClose()

    } catch (err) {
      console.error(err)
      toast('Error saving target', true)
    }
  }

  return (
    <Modal title="Set Target" onClose={onClose}>
      <div className="form-grid">

        <div className="form-group full">
          <label>Employee</label>
          <select
            value={form.employee_id}
            onChange={(e) =>
              set('employee_id', Number(e.target.value))
            }
          >
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
        <button className="btn btn-ghost" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          Save
        </button>
      </div>

    </Modal>
  )
}