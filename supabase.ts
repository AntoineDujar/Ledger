import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://riswgkjcvonllivtkxhe.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpc3dna2pjdm9ubGxpdnRreGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExMzEzMjcsImV4cCI6MjAyNjcwNzMyN30.7KLRP65RfXDv0vhavrEOC8lBJF59vUekhqwaP8d7hX8"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})