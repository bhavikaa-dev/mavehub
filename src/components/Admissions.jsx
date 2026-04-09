import { useState, useEffect } from 'react'
import Modal from './Modal'
import { toast } from './Toast'
import { fmt } from '../hooks/utils'

import { getEmployees } from '../services/employeeService'
import {
  getAdmissions,
  addAdmission,
  updateAdmission,
  deleteAdmission
} from '../services/admissionService'

export default function Admissions() {
  const [admissions, setAdmissions] = useState([])
  const [employees, setEmployees] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const load = async () => {
    const [admData, empData] = await Promise.all([
      getAdmissions(),
      getEmployees()
    ])
    setAdmissions(admData || [])
    setEmployees(empData || [])
  }

  useEffect(() => { load() }, [])

  return (
    <div className="fade-in">

      <div className="section-header">
        <div>
          <div className="section-title">Admissions</div>
          <div className="section-meta">{admissions.length} ENTRIES</div>
        </div>

        <button className="btn btn-primary" onClick={() => {
          setEditing(null)
          setOpen(true)
        }}>
          + Add Admission
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>University</th>
              <th>Points</th>
              <th>Revenue</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {admissions.map(a => {

              return (
                <tr key={a.id}>
                  <td>
                    {employees.find(e => e.id ===a.employee_id)?.name || '-'}
                  </td>
                  <td>{a.date}</td>
                  <td>{a.university}</td>
                  <td>{a.points}</td>
                  <td>₹{fmt(a.revenue)}</td>
                  <td>{a.payment}</td>
                  <td>
                    <span
                      style={{ cursor: 'pointer', marginRight: '10px' }}
                      onClick={() => {
                        setEditing(a)
                        setOpen(true)
                      }}
                    >
                      Edit
                    </span>

                    <span
                      style={{ cursor: 'pointer', color: 'red' }}
                      onClick={async () => {
                        await deleteAdmission(a.id)
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
        <AdmissionModal
          editing={editing}
          onClose={() => {
            setOpen(false)
            setEditing(null)
          }}
          refresh={load}
          employees={employees}
        />
      )}
    </div>
  )
}


// MODAL
function AdmissionModal({ editing, onClose, refresh, employees }) {
  const [form, setForm] = useState({
    employee_id: '',
    date: '',
    university: '',
    revenue: '',
    payment: '',
    points: ''
  })

  useEffect(() => {
    if (editing) {
      setForm({
        employee_id: editing.employee_id,
        date: editing.date || '',
        university: editing.university || '',
        revenue: editing.revenue || '',
        payment: editing.payment || '',
        points: editing.points || ''
      })
    }
  }, [editing])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.employee_name) {
      toast('Select employee', true)
      return
    }

    const payload = {
      employee_name: form.employee_namr,
      date: form.date,
      university: form.university,
      revenue: Number(form.revenue) || 0,
      payment: form.payment,
      points: Number(form.points) || 0
    }

    if (editing) {
      await updateAdmission(editing.id, payload)
      toast('Updated')
    } else {
      await addAdmission(payload)
      toast('Added')
    }

    refresh()
    onClose()
  }

  return (
    <Modal title={editing ? 'Edit Admission' : 'Add Admission'} onClose={onClose}>
      <div className="form-grid">

        <div className="form-group full">
          <label>Employee</label>
          <select value={form.employee_id} onChange={e => set('employee_id', e.target.value)}>
            <option value="">Select</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>

        <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
        <input placeholder="University" value={form.university} onChange={e => set('university', e.target.value)} />
        <input type="number" placeholder="Revenue" value={form.revenue} onChange={e => set('revenue', e.target.value)} />
        <input placeholder="Payment" value={form.payment} onChange={e => set('payment', e.target.value)} />
        <input type="number" placeholder="Points" value={form.points} onChange={e => set('points', e.target.value)} />

      </div>

      <div className="form-actions">
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleSave}>Save</button>
      </div>
    </Modal>
  )
}