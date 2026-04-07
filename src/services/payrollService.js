import { supabase } from './supabase'

// GET ALL
export const getPayroll = async () => {
  const { data, error } = await supabase
    .from('payroll')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('PAYROLL FETCH ERROR:', error)
    return []
  }

  return data
}

// ADD
export const addPayroll = async (entry) => {
  const { data, error } = await supabase
    .from('payroll')
    .insert([{
      employee_id: Number(entry.employee_id),
      date: entry.date,
      salary_paid: Number(entry.salary_paid || 0),
      incentive: Number(entry.incentive || 0),
      notes: entry.notes || ''
    }])
    .select()

  if (error) {
    console.error('PAYROLL ADD ERROR:', error)
    return null
  }

  return data
}

// DELETE
export const deletePayroll = async (id) => {
  const { error } = await supabase
    .from('payroll')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('PAYROLL DELETE ERROR:', error)
  }
}