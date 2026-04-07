import { useEffect, useState } from 'react'
import Modal from './Modal'
import { toast } from './Toast'
import { fmt } from '../hooks/utils'

import { getEmployees } from '../services/employeeService'
import { getPayroll, addPayroll, deletePayroll } from '../services/payrollService'

export default function Payroll() {
  const [employees, setEmployees] = useState([])
  const [payroll, setPayroll] = useState([])
  const [open, setOpen] = useState(false)

  const load = async () => {
    const [emp, pay] = await Promise.all([
      getEmployees(),
      getPayroll()
    ])

    setEmployees(emp || [])
    setPayroll(pay || [])
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="fade-in">

      <div className="section-header">
        <div>
          <div className="section-title">Payroll</div>
          <div className="section-meta">{payroll.length} ENTRIES</div>
        </div>

        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          + Add Payroll
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Salary</th>
              <th>Incentive</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {payroll.map(p => {
              const emp = employees.find(e => e.id === p.employee_id)

              return (
                <tr key={p.id}>
                  <td>{emp?.name || '-'}</td>
                  <td>{p.date}</td>
                  <td>₹{fmt(p.salary_paid)}</td>
                  <td>₹{fmt(p.incentive)}</td>
                  <td>₹{fmt((p.salary_paid || 0) + (p.incentive || 0))}</td>
                  <td>
                    <span
                      style={{ cursor: 'pointer', color: 'red' }}
                      onClick={async () => {
                        await deletePayroll(p.id)
                        toast('Deleted')
                        load()
                      }}
                    >
                      Del
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {open && (
        <PayrollModal
          employees={employees}
          onClose={() => setOpen(false)}
          refresh={load}
        />
      )}
    </div>
  )
}


// MODAL
function PayrollModal({ onClose, refresh, employees }) {
  const [form, setForm] = useState({
    employee_id: '',
    date: '',
    salary_paid: '',
    incentive: '',
    notes: ''
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.employee_id) {
      toast('Select employee', true)
      return
    }

    try {
      await addPayroll(form)
      toast('Saved')
      refresh()
      onClose()
    } catch (err) {
      console.error(err)
      toast('Error saving', true)
    }
  }

  return (
    <Modal title="Add Payroll" onClose={onClose}>
      <div className="form-grid">

        <div className="form-group full">
          <label>Employee</label>
          <select onChange={e => set('employee_id', e.target.value)}>
            <option value="">Select</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input type="date" onChange={e => set('date', e.target.value)} />
        </div>

        <div className="form-group">
          <label>Salary Paid</label>
          <input type="number" onChange={e => set('salary_paid', e.target.value)} />
        </div>

        <div className="form-group">
          <label>Incentive</label>
          <input type="number" onChange={e => set('incentive', e.target.value)} />
        </div>

      </div>

      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>Save</button>
      </div>
    </Modal>
  )
}