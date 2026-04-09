import { supabase } from './supabase'
export const getAdmissions = async () => {
  const { data, error } = await supabase
    .from('admissions')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('GET ERROR:', error)
    return []
  }

  return data
}

export const addAdmission = async (payload) => {
  const formattedDate = payload.date
    ? (() => {
        const [month, day, year] = payload.date.split('-')
        return `${year}-${month}-${day}`
      })()
    : null

  const { data, error } = await supabase
    .from('admissions')
    .insert([
      {
        ...payload,
        date: formattedDate
      }
    ])
    .select()

  if (error) {
    console.error('ADD ERROR:', error)
    throw error
  }

  return data
}

export const updateAdmission = async (id, payload) => {
  const formattedDate = payload.date
    ? (() => {
        const [month, day, year] = payload.date.split('-')
        return `${year}-${month}-${day}`
      })()
    : null

  const { data, error } = await supabase
    .from('admissions')
    .update({
      ...payload,
      date: formattedDate
    })
    .eq('id', id)
    .select()

  if (error) {
    console.error('UPDATE ERROR:', error)
    throw error
  }

  return data
}
// ✅ DELETE
export const deleteAdmission = async (id) => {
  const { error } = await supabase
    .from('admissions')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('DELETE ERROR:', error)
    throw error
  }

  return true
}