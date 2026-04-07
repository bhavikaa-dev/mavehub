// 🔥 EMPLOYEE STATS
export const getEmployeeStats = (employeeId, admissions) => {
  const data = admissions.filter(a => a.employee_id === employeeId)

  return {
    totalAdmissions: data.length,
    totalRevenue: data.reduce((s, a) => s + (a.revenue || 0), 0),
    totalPoints: data.reduce((s, a) => s + (a.points || 0), 0),
  }
}


// 🔥 TEAM STATS
export const getTeamStats = (team, employees, admissions) => {
  const teamEmployees = employees.filter(e => e.team === team)

  let totalRevenue = 0
  let totalPoints = 0
  let totalAdmissions = 0

  teamEmployees.forEach(emp => {
    const stats = getEmployeeStats(emp.id, admissions)

    totalRevenue += stats.totalRevenue
    totalPoints += stats.totalPoints
    totalAdmissions += stats.totalAdmissions
  })

  return {
    totalRevenue,
    totalPoints,
    totalAdmissions
  }
}


// 🔥 MANAGER STATS (RECURSIVE)
export const getManagerStats = (managerId, employees, admissions) => {

  const getAllSubordinates = (id) => {
    const direct = employees.filter(e => e.manager_id === id)

    return direct.flatMap(e => [
      e,
      ...getAllSubordinates(e.id)
    ])
  }

  const team = getAllSubordinates(managerId)

  let totalRevenue = 0
  let totalPoints = 0
  let totalAdmissions = 0

  team.forEach(emp => {
    const stats = getEmployeeStats(emp.id, admissions)

    totalRevenue += stats.totalRevenue
    totalPoints += stats.totalPoints
    totalAdmissions += stats.totalAdmissions
  })

  return {
    totalRevenue,
    totalPoints,
    totalAdmissions
  }
}