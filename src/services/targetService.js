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
export const addTarget = async (payload) => {
  const { error } = await supabase
    .from('targets')
    .insert([payload])

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