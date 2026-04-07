import { useState } from 'react'
import Modal from './Modal'
import { toast } from './Toast'
import { today } from '../hooks/utils'

function RemModal({ onSave, onClose }) {
  const [title, setTitle] = useState('')
  const [date,  setDate]  = useState(today())
  const [type,  setType]  = useState('one-time')
  const [notes, setNotes] = useState('')

  function handleSave() {
    if (!title.trim() || !date) { toast('Fill required fields', true); return }
    onSave({ title, date, type, notes })
    onClose()
    toast('Reminder added')
  }

  return (
    <Modal title="Add Reminder / Task" onClose={onClose}>
      <div className="form-grid cols-1">
        <div className="form-group">
          <label>Task Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Follow up with candidate" />
        </div>
        <div className="form-group">
          <label>Due Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="one-time">One-Time</option>
            <option value="recurring">Recurring</option>
          </select>
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional context…" />
        </div>
      </div>
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>Add Task</button>
      </div>
    </Modal>
  )
}

function ReminderItem({ r, onToggle, onDelete }) {
  return (
    <div className={`reminder-item ${r.done ? 'done' : ''}`}>
      <div className={`reminder-check ${r.done ? 'checked' : ''}`} onClick={() => onToggle(r.id)}>
        {r.done ? '✓' : ''}
      </div>
      <div style={{ flex: 1 }}>
        <div className="reminder-title">{r.title}</div>
        {r.notes && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{r.notes}</div>}
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="reminder-meta">{r.date}</div>
        <span className="reminder-recur">{r.type}</span>
      </div>
      <button className="btn btn-danger btn-xs" onClick={() => onDelete(r.id)}>×</button>
    </div>
  )
}

export default function Reminders({ store }) {
  const [modalOpen, setModalOpen] = useState(false)

  const pending   = store.reminders.filter(r => !r.done)
  const completed = store.reminders.filter(r => r.done)

  function handleDelete(id) {
    store.deleteReminder(id)
    toast('Reminder removed')
  }

  return (
    <div className="fade-in">
      <div className="section-header">
        <div>
          <div className="section-title">Reminders</div>
          <div className="section-meta">TASKS & FOLLOW-UPS</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>+ Add Task</button>
      </div>

      {store.reminders.length === 0 ? (
        <div className="empty-state">
          <div className="icon">✅</div>
          <p>No reminders yet. Add a task!</p>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <>
              <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: 'var(--text3)', letterSpacing: 1, marginBottom: 8 }}>
                PENDING ({pending.length})
              </div>
              {pending.map(r => (
                <ReminderItem key={r.id} r={r} onToggle={store.toggleReminder} onDelete={handleDelete} />
              ))}
            </>
          )}
          {completed.length > 0 && (
            <>
              <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: 'var(--text3)', letterSpacing: 1, marginBottom: 8, marginTop: 20 }}>
                COMPLETED ({completed.length})
              </div>
              {completed.map(r => (
                <ReminderItem key={r.id} r={r} onToggle={store.toggleReminder} onDelete={handleDelete} />
              ))}
            </>
          )}
        </>
      )}

      {modalOpen && (
        <RemModal onSave={store.addReminder} onClose={() => setModalOpen(false)} />
      )}
    </div>
  )
}
