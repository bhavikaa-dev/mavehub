import { supabase } from './supabase'

// GET
export const getTargets = async () => {
  const { data, error } = await supabase
    .from('targets')
    .select('*')

  if (error) {
    console.error('TARGET FETCH ERROR:', error)
    return []
  }

  return data
}

// ADD
export const addTarget = async (data) => {
  const { error } = await supabase
    .from('targets')
    .upsert([
      {
        employee_id: data.employee_id,
        employee_name: data.employee_name,
        target: data.target,
        month: data.month
      }
    ])

  if (error) {
    console.error('TARGET ADD ERROR:', error)
    throw error
  }

  if (error) {
    console.error('TARGET ADD ERROR:', error)
    throw error
  }
}

// DELETE
export const deleteTarget = async (id) => {
  await supabase
    .from('targets')
    .delete()
    .eq('id', id)
}