import { supabase } from './supabase'

// GET
export const getEmployees = async () => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('id', { ascending: false })

  if (error) {
    console.error('FETCH ERROR:', error)
    return []
  }

  return data
}

// ADD
export const addEmployee = async (emp) => {
  const { data, error } = await supabase
    .from('employees')
    .insert([{
      name: emp.name,
      role: emp.role,
      team: emp.team,
      manager_id: emp.manager_id ? Number(emp.manager_id) : null,
      manager: emp.manager || '',
      joining_date: emp.joining_date || null,
      salary: emp.salary ? Number(emp.salary) : null
    }])
    .select()

  if (error) {
    console.error('ADD ERROR:', error)
    return null
  }

  return data
}

// UPDATE
export const updateEmployee = async (id, emp) => {
  const { data, error } = await supabase
    .from('employees')
    .update({
      name: emp.name,
      role: emp.role,
      team: emp.team,
      manager_id: emp.manager_id ? Number(emp.manager_id) : null,
      manager: emp.manager || '',
      joining_date: emp.joining_date || null,
      salary: emp.salary ? Number(emp.salary) : null
    })
    .eq('id', id)
    .select()

  if (error) {
    console.error('UPDATE ERROR:', error)
    return null
  }

  return data
}

// DELETE
export const deleteEmployee = async (id) => {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('DELETE ERROR:', error)
  }
}