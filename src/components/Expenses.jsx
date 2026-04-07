import { useState } from 'react'
import Modal from './Modal'
import { toast } from './Toast'
import { fmt, today } from '../hooks/utils'

function ExpModal({ exp, onSave, onClose }) {
  const [form, setForm] = useState({
    date:   exp?.date   || today(),
    name:   exp?.name   || '',
    type:   exp?.type   || 'monthly',
    branch: exp?.branch || '',
    amount: exp?.amount || '',
    notes:  exp?.notes  || '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function handleSave() {
    if (!form.name.trim() || !form.date) { toast('Fill required fields', true); return }
    onSave({ ...form, amount: +form.amount || 0 })
    onClose()
    toast(exp ? 'Expense updated' : 'Expense added')
  }

  return (
    <Modal title={exp ? 'Edit Expense' : 'Add Expense'} onClose={onClose}>
      <div className="form-grid">
        <div className="form-group">
          <label>Date</label>
          <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Expense Name</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Office Rent" />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select value={form.type} onChange={e => set('type', e.target.value)}>
            <option value="monthly">Monthly</option>
            <option value="one-time">One-Time</option>
          </select>
        </div>
        <div className="form-group">
          <label>Branch</label>
          <input value={form.branch} onChange={e => set('branch', e.target.value)} placeholder="Mumbai HQ" />
        </div>
        <div className="form-group">
          <label>Amount (₹)</label>
          <input type="number" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="25000" />
        </div>
        <div className="form-group full">
          <label>Notes</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Additional notes…" />
        </div>
      </div>
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>Save Expense</button>
      </div>
    </Modal>
  )
}

export default function Expenses({ store }) {
  const [modal,   setModal]   = useState(null)   // null | 'add' | expObj

  const exps     = store.filteredExpenses()
  const monthly  = exps.filter(e => e.type === 'monthly').reduce((s, e) => s + e.amount, 0)
  const oneTime  = exps.filter(e => e.type === 'one-time').reduce((s, e) => s + e.amount, 0)
  const total    = monthly + oneTime

  function handleSave(form) {
    if (modal && modal.id) {
      store.updateExpense(modal.id, form)
    } else {
      store.addExpense(form)
    }
  }

  function handleDelete(id) {
    if (!window.confirm('Delete this expense?')) return
    store.deleteExpense(id)
    toast('Expense deleted')
  }

  return (
    <div className="fade-in">
      <div className="section-header">
        <div>
          <div className="section-title">Expenses</div>
          <div className="section-meta">{exps.length} ENTRIES</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('add')}>+ Add Expense</button>
      </div>

      <div className="cards-grid">
        <div className="card" style={{ '--accent-line': 'var(--accent4)' }}>
          <div className="card-icon">📊</div>
          <div className="card-label">Total Expenses</div>
          <div className="card-value">₹{fmt(total)}</div>
        </div>
        <div className="card" style={{ '--accent-line': 'var(--accent5)' }}>
          <div className="card-icon">🔄</div>
          <div className="card-label">Monthly</div>
          <div className="card-value" style={{ fontSize: 22 }}>₹{fmt(monthly)}</div>
        </div>
        <div className="card" style={{ '--accent-line': 'var(--accent2)' }}>
          <div className="card-icon">⚡</div>
          <div className="card-label">One-Time</div>
          <div className="card-value" style={{ fontSize: 22 }}>₹{fmt(oneTime)}</div>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Date</th><th>Name</th><th>Type</th><th>Branch</th><th>Amount</th><th>Notes</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {exps.length ? [...exps].sort((a, b) => b.date.localeCompare(a.date)).map(e => (
              <tr key={e.id}>
                <td className="mono">{e.date}</td>
                <td><span className="name">{e.name}</span></td>
                <td>
                  <span className={`tag ${e.type === 'monthly' ? 'tag-blue' : 'tag-purple'}`}>{e.type}</span>
                </td>
                <td>{e.branch}</td>
                <td className="mono">₹{fmt(e.amount)}</td>
                <td style={{ fontSize: 11, color: 'var(--text3)' }}>{e.notes || '—'}</td>
                <td>
                  <button className="btn btn-ghost btn-xs" onClick={() => setModal(e)}>Edit</button>
                  {' '}
                  <button className="btn btn-danger btn-xs" onClick={() => handleDelete(e.id)}>Del</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={7}><div className="empty-state"><div className="icon">💸</div><p>No expenses yet</p></div></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <ExpModal
          exp={modal === 'add' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
