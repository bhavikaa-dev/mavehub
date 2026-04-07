import { supabase } from './supabase'

// ✅ GET (FROM GOOGLE SHEET via SheetDB)
export const getAdmissions = async () => {
  try {
    const res = await fetch('https://sheetdb.io/api/v1/lead8d6irhoxv')
    const data = await res.json()

    return data.map((row, index) => ({
      id: index + 1, 
      employee: row.Employee,
      date: row.Date,
      university: row.University,
      points: Number(row.Points),
      revenue: Number(row.Revenue),
      payment: row.Payment,
      team: row.Team
    }))
  } catch (error) {
    console.error('SHEET GET ERROR:', error)
    return []
  }
}

// ADD (UNCHANGED - SUPABASE)
export const addAdmission = async (payload) => {
  const { data, error } = await supabase
    .from('admissions')
    .insert([payload])
    .select()

  if (error) {
    console.error('ADD ERROR:', error)
    throw error
  }

  return data
}

// UPDATE (UNCHANGED)
export const updateAdmission = async (id, payload) => {
  const { data, error } = await supabase
    .from('admissions')
    .update(payload)
    .eq('id', id)
    .select()

  if (error) {
    console.error('UPDATE ERROR:', error)
    throw error
  }

  return data
}

// DELETE (UNCHANGED)
export const deleteAdmission = async (id) => {
  const { error } = await supabase
    .from('admissions')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('DELETE ERROR:', error)
  }
}