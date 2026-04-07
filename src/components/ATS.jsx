import { useState } from 'react'
import Modal from './Modal'
import { toast } from './Toast'
import { fmt, today } from '../hooks/utils'

const STATUSES = ['All', 'Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected']
const STATUS_TAG = { Applied: 'tag-blue', Screening: 'tag-yellow', Interview: 'tag-purple', Offer: 'tag-green', Hired: 'tag-green', Rejected: 'tag-red' }

function AtsModal({ managers, candidate, onSave, onClose }) {
  const [form, setForm] = useState({
    name:       candidate?.name       || '',
    contact:    candidate?.contact    || '',
    email:      candidate?.email      || '',
    position:   candidate?.position   || '',
    manager:    candidate?.manager    || managers[0] || '',
    date:       candidate?.date       || today(),
    status:     candidate?.status     || 'Applied',
    currSalary: candidate?.currSalary || '',
    expSalary:  candidate?.expSalary  || '',
    score:      candidate?.score      || '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function handleSave() {
    if (!form.name.trim() || !form.position.trim()) { toast('Fill required fields', true); return }
    onSave({ ...form, currSalary: +form.currSalary || 0, expSalary: +form.expSalary || 0, score: +form.score || 0 })
    onClose()
    toast(candidate ? 'Candidate updated' : 'Candidate added')
  }

  return (
    <Modal title={candidate ? 'Edit Candidate' : 'Add Candidate'} onClose={onClose}>
      <div className="form-grid">
        <div className="form-group">
          <label>Full Name</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="John Doe" />
        </div>
        <div className="form-group">
          <label>Contact</label>
          <input type="tel" value={form.contact} onChange={e => set('contact', e.target.value)} placeholder="+91 9876543210" />
        </div>
        <div className="form-group full">
          <label>Email</label>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@example.com" />
        </div>
        <div className="form-group">
          <label>Position Applied</label>
          <input value={form.position} onChange={e => set('position', e.target.value)} placeholder="Senior Counselor" />
        </div>
        <div className="form-group">
          <label>Assigned Manager</label>
          <select value={form.manager} onChange={e => set('manager', e.target.value)}>
            {managers.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Application Date</label>
          <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}>
            {STATUSES.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Current Salary (₹)</label>
          <input type="number" value={form.currSalary} onChange={e => set('currSalary', e.target.value)} placeholder="40000" />
        </div>
        <div className="form-group">
          <label>Expected Salary (₹)</label>
          <input type="number" value={form.expSalary} onChange={e => set('expSalary', e.target.value)} placeholder="60000" />
        </div>
        <div className="form-group">
          <label>Evaluation Score (0–10)</label>
          <input type="number" value={form.score} onChange={e => set('score', e.target.value)} placeholder="7.5" min="0" max="10" step="0.1" />
        </div>
      </div>
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>Save Candidate</button>
      </div>
    </Modal>
  )
}

export default function ATS({ store }) {
  const [filter,    setFilter]    = useState('All')
  const [modal,     setModal]     = useState(null)

  const managers = [...new Set(store.employees.map(e => e.manager))]

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = s === 'All' ? store.candidates.length : store.candidates.filter(c => c.status === s).length
    return acc
  }, {})

  const list = filter === 'All' ? store.candidates : store.candidates.filter(c => c.status === filter)

  function handleSave(form) {
    if (modal && modal.id) {
      store.updateCandidate(modal.id, form)
    } else {
      store.addCandidate(form)
    }
  }

  function handleDelete(id) {
    if (!window.confirm('Remove this candidate?')) return
    store.deleteCandidate(id)
    toast('Candidate removed')
  }

  return (
    <div className="fade-in">
      <div className="section-header">
        <div>
          <div className="section-title">ATS</div>
          <div className="section-meta">APPLICANT TRACKING</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('add')}>+ Add Candidate</button>
      </div>

      <div className="status-pipeline">
        {STATUSES.map(s => (
          <div key={s} className={`status-pill ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s} <span style={{ fontSize: 9, opacity: 0.7 }}>({counts[s]})</span>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Candidate</th><th>Position</th><th>Manager</th><th>Date</th>
              <th>Status</th><th>Curr Salary</th><th>Exp Salary</th><th>Score</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length ? list.map(c => (
              <tr key={c.id}>
                <td>
                  <span className="name">{c.name}</span><br />
                  <span style={{ fontSize: 10, color: 'var(--text3)' }}>{c.email}</span>
                </td>
                <td>{c.position}</td>
                <td>{c.manager}</td>
                <td className="mono">{c.date}</td>
                <td><span className={`tag ${STATUS_TAG[c.status] || 'tag-blue'}`}>{c.status}</span></td>
                <td className="mono">₹{fmt(c.currSalary)}</td>
                <td className="mono">₹{fmt(c.expSalary)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="mono" style={{ fontSize: 12, fontWeight: 700 }}>{c.score}</span>
                    <div className="perf-bar" style={{ width: 60 }}>
                      <div className="perf-fill" style={{ width: `${c.score * 10}%`, background: 'var(--accent5)' }} />
                    </div>
                  </div>
                </td>
                <td>
                  <select
                    className="btn btn-ghost btn-xs"
                    style={{ padding: '3px 6px', cursor: 'pointer' }}
                    value={c.status}
                    onChange={e => { store.updateCandidate(c.id, { status: e.target.value }); toast('Status updated') }}
                  >
                    {STATUSES.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}
                  </select>
                  <br />
                  <button className="btn btn-ghost btn-xs" style={{ marginTop: 4 }} onClick={() => setModal(c)}>Edit</button>
                  {' '}
                  <button className="btn btn-danger btn-xs" style={{ marginTop: 4 }} onClick={() => handleDelete(c.id)}>Del</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={9}><div className="empty-state"><div className="icon">🎯</div><p>No candidates in this stage</p></div></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <AtsModal
          managers={managers}
          candidate={modal === 'add' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
