import { useState, useCallback } from 'react'

export function useStore() {

  // 🔥 ALL DATA FROM SUPABASE
  const [employees, setEmployees] = useState([])
  const [admissions, setAdmissions] = useState([])
  const [payroll, setPayroll] = useState([])
  const [targets, setTargets] = useState([])
  const [expenses, setExpenses] = useState([])
  const [candidates, setCandidates] = useState([])
  const [reminders, setReminders] = useState([])
  const [teams, setTeams] = useState([])

  const [filter, setFilter] = useState({ from: null, to: null })

  // ───────── DATE FILTER ─────────
  const inDateRange = useCallback((dateStr) => {
    if (!filter.from && !filter.to) return true

    const d = new Date(dateStr)

    if (filter.from && d < new Date(filter.from)) return false
    if (filter.to && d > new Date(filter.to)) return false

    return true
  }, [filter])

  const filteredAdmissions = useCallback(
    () => admissions.filter(a => inDateRange(a.date)),
    [admissions, inDateRange]
  )

  const filteredExpenses = useCallback(
    () => expenses.filter(e => inDateRange(e.date)),
    [expenses, inDateRange]
  )

  // ───────── REPLACE FUNCTIONS (SUPABASE LOAD) ─────────
  const replaceEmployees = (data) => setEmployees(data || [])
  const replaceAdmissions = (data) => setAdmissions(data || [])
  const replacePayroll = (data) => setPayroll(data || [])
  const replaceTargets = (data) => setTargets(data || [])
  const replaceExpenses = (data) => setExpenses(data || [])
  const replaceCandidates = (data) => setCandidates(data || [])
  const replaceReminders = (data) => setReminders(data || [])
  const replaceTeams = (data) => setTeams(data || [])

  // ───────── OPTIONAL LOCAL FALLBACK (SAFE) ─────────
  const addAdmissionLocal = (adm) =>
    setAdmissions(prev => [...prev, { ...adm, id: Date.now() }])

  const deleteAdmissionLocal = (id) =>
    setAdmissions(prev => prev.filter(a => a.id !== id))

  // ───────── RETURN ─────────
  return {
    employees,
    admissions,
    payroll,
    targets,
    expenses,
    candidates,
    reminders,
    filter,
    teams,
    replaceTeams,

    setFilter,

    filteredAdmissions,
    filteredExpenses,

    // 🔥 SUPABASE SYNC
    replaceEmployees,
    replaceAdmissions,
    replacePayroll,
    replaceTargets,
    replaceExpenses,
    replaceCandidates,
    replaceReminders,

    // fallback
    addAdmissionLocal,
    deleteAdmissionLocal,
  }
}