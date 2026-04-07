// Central in-memory store + seed data

let _id = 100

export function nextId() {
  return _id++
}

function makeDate(monthsAgo) {
  const d = new Date()
  d.setMonth(d.getMonth() - monthsAgo)
  return d.toISOString().slice(0, 10)
}

function currentMonth() {
  return new Date().toISOString().slice(0, 7)
}

function prevMonth() {
  const d = new Date()
  d.setMonth(d.getMonth() - 1)
  return d.toISOString().slice(0, 7)
}

export const SEED_EMPLOYEES = [
  { id: 1, name: 'Riya Sharma',   role: 'Senior Counselor', team: 'Alpha', manager: 'Amit Patel',  reporting: 'CEO',       doj: '2022-03-15', salary: 55000, oldManager: null },
  { id: 2, name: 'Karan Mehta',   role: 'Counselor',        team: 'Alpha', manager: 'Amit Patel',  reporting: 'Amit Patel',doj: '2023-01-10', salary: 40000, oldManager: null },
  { id: 3, name: 'Priya Nair',    role: 'Team Lead',        team: 'Beta',  manager: 'Sneha Roy',   reporting: 'CEO',       doj: '2021-07-20', salary: 65000, oldManager: null },
  { id: 4, name: 'Arjun Verma',   role: 'Counselor',        team: 'Beta',  manager: 'Sneha Roy',   reporting: 'Sneha Roy', doj: '2023-06-01', salary: 38000, oldManager: null },
  { id: 5, name: 'Neha Joshi',    role: 'Senior Counselor', team: 'Gamma', manager: 'Raj Kumar',   reporting: 'CEO',       doj: '2022-11-05', salary: 52000, oldManager: null },
  { id: 6, name: 'Vikram Singh',  role: 'Counselor',        team: 'Gamma', manager: 'Raj Kumar',   reporting: 'Raj Kumar', doj: '2024-02-14', salary: 36000, oldManager: null },
]

export const SEED_ADMISSIONS = [
  { id: nextId(), empId: 1, date: makeDate(0), university: 'Oxford',    points: 15, revenue: 250000, payment: 'Bank Transfer' },
  { id: nextId(), empId: 2, date: makeDate(0), university: 'Harvard',   points: 12, revenue: 200000, payment: 'UPI' },
  { id: nextId(), empId: 3, date: makeDate(0), university: 'MIT',       points: 18, revenue: 320000, payment: 'Card' },
  { id: nextId(), empId: 4, date: makeDate(1), university: 'Stanford',  points: 10, revenue: 180000, payment: 'Cash' },
  { id: nextId(), empId: 5, date: makeDate(0), university: 'Cambridge', points: 20, revenue: 350000, payment: 'Bank Transfer' },
  { id: nextId(), empId: 6, date: makeDate(1), university: 'LSE',       points: 8,  revenue: 140000, payment: 'UPI' },
  { id: nextId(), empId: 1, date: makeDate(1), university: 'Imperial',  points: 14, revenue: 230000, payment: 'Card' },
  { id: nextId(), empId: 3, date: makeDate(2), university: 'Yale',      points: 16, revenue: 280000, payment: 'Bank Transfer' },
]

export const SEED_PAYROLL = []
SEED_EMPLOYEES.forEach(e => {
  [currentMonth(), prevMonth()].forEach(mn => {
    SEED_PAYROLL.push({
      id: nextId(),
      empId: e.id,
      month: mn,
      fixed: e.salary,
      paid: e.salary,
      incentive: Math.floor(Math.random() * 5000),
    })
  })
})

export const SEED_TARGETS = []
SEED_EMPLOYEES.forEach(e => {
  SEED_TARGETS.push({ id: nextId(), empId: e.id, month: currentMonth(), target: 300000, points: 80 })
})

export const SEED_EXPENSES = [
  { id: nextId(), date: makeDate(0), name: 'Office Rent', type: 'monthly',  branch: 'Mumbai HQ', amount: 80000, notes: 'Monthly office lease' },
  { id: nextId(), date: makeDate(0), name: 'Marketing',   type: 'one-time', branch: 'Delhi',     amount: 35000, notes: 'Social media campaign' },
  { id: nextId(), date: makeDate(1), name: 'Utilities',   type: 'monthly',  branch: 'Mumbai HQ', amount: 12000, notes: '' },
]

export const SEED_CANDIDATES = [
  { id: nextId(), name: 'Ananya Das',  contact: '+91 9876543210', email: 'ananya@mail.com', position: 'Counselor',        manager: 'Amit Patel', date: makeDate(0), status: 'Interview', currSalary: 35000, expSalary: 50000, score: 7.5 },
  { id: nextId(), name: 'Rohit Gupta', contact: '+91 9012345678', email: 'rohit@mail.com',  position: 'Senior Counselor', manager: 'Sneha Roy',  date: makeDate(0), status: 'Screening', currSalary: 48000, expSalary: 65000, score: 8.2 },
]

const today = new Date().toISOString().slice(0, 10)

export const SEED_REMINDERS = [
  { id: nextId(), title: 'Review Q1 performance reports', date: today, type: 'one-time',  notes: '',                    done: false },
  { id: nextId(), title: 'Payroll processing deadline',   date: today, type: 'recurring', notes: 'Process before 25th', done: false },
]
