import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://klsjfqdpkygorcjunrrj.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsc2pmcWRwa3lnb3JjanVucnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MDU4MDksImV4cCI6MjA5MDA4MTgwOX0.pUX8m7zei6gul2b3YsfHryJGRddpvefiqF5X0DqLMf0"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)