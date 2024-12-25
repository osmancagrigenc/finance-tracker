import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL ve Anon Key tanımlanmamış!')
}

console.log('Supabase URL:', supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: {
      getItem: (key) => {
        try {
          return document.cookie.split('; ')
            .find(row => row.startsWith(`${key}=`))
            ?.split('=')[1]
        } catch {
          return null
        }
      },
      setItem: (key, value) => {
        try {
          document.cookie = `${key}=${value}; path=/; max-age=604800; secure; samesite=strict`
        } catch {
          return
        }
      },
      removeItem: (key) => {
        try {
          document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        } catch {
          return
        }
      },
    },
  },
}) 