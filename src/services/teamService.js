import { supabase } from './supabase'

export const getTeams = async () => {
  const { data, error } = await supabase.from('teams').select('*')
  if (error) console.error(error)
  return data || []
}

export const addTeam = async (team) => {
  const { data, error } = await supabase.from('teams').insert([team])
  if (error) console.error(error)
  return data
}

export const updateTeam = async (id, name) => {
  const { data, error } = await supabase
    .from('teams')
    .update({ name })
    .eq('id', id)

  if (error) console.error(error)
  return data
}

export const deleteTeam = async (id) => {
  const { error } = await supabase
    .from('teams')
    .delete()
    .eq('id', id)

  if (error) console.error(error)
}