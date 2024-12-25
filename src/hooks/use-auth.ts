import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/config'
import { Session } from '@supabase/supabase-js'

export function useAuth() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    // İlk yüklemede session'ı kontrol et
    const checkSession = async () => {
      try {
        // Session'ı yenile
        await supabase.auth.getSession()
        
        // Session'ı tekrar kontrol et
        const { data: { session: currentSession }, error } = await supabase.auth.getSession()
        
        if (error) throw error
        
        console.log('Current session:', currentSession?.user?.email)
        setSession(currentSession)

        // Session varsa ve login sayfasındaysak dashboard'a yönlendir
        if (currentSession && window.location.pathname === '/auth/login') {
          router.push('/dashboard')
        }
      } catch (err) {
        console.error('Session check error:', err)
      }
    }

    checkSession()

    // Auth state değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', event, currentSession?.user?.email)
      setSession(currentSession)

      switch (event) {
        case 'SIGNED_IN':
          await router.push('/dashboard')
          break
        case 'SIGNED_OUT':
          await router.push('/auth/login')
          break
        case 'USER_UPDATED':
          setSession(currentSession)
          break
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Login attempt:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Login error:', error)
        throw error
      }

      if (data?.user) {
        console.log('Login successful:', data.user.email)
        setSession(data.session)
        // Yönlendirmeyi auth state change event'i yapacak
      } else {
        throw new Error('Kullanıcı bilgileri alınamadı')
      }
    } catch (err) {
      console.error('Login error:', err)
      let errorMessage = 'Giriş yapılırken bir hata oluştu'
      
      if (err instanceof Error) {
        switch (err.message) {
          case 'Invalid login credentials':
            errorMessage = 'Geçersiz e-posta veya şifre'
            break
          case 'Email not confirmed':
            errorMessage = 'E-posta adresiniz henüz doğrulanmamış'
            break
          default:
            errorMessage = err.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true)
      setError(null)

      console.log('Register attempt:', email)

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      })

      if (signUpError) throw signUpError

      if (data?.user) {
        console.log('Register successful:', data.user.email)
        await router.push('/auth/verify')
      } else {
        throw new Error('Kullanıcı oluşturulamadı')
      }
    } catch (err) {
      console.error('Register error:', err)
      let errorMessage = 'Kayıt olurken bir hata oluştu'
      
      if (err instanceof Error) {
        switch (err.message) {
          case 'User already registered':
            errorMessage = 'Bu e-posta adresi zaten kayıtlı'
            break
          case 'Password should be at least 6 characters':
            errorMessage = 'Şifre en az 6 karakter olmalıdır'
            break
          default:
            errorMessage = err.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setSession(null)
      // Yönlendirmeyi auth state change event'i yapacak
    } catch (err) {
      console.error('Logout error:', err)
      setError(err instanceof Error ? err.message : 'Çıkış yapılırken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return {
    login,
    register,
    logout,
    loading,
    error,
    session,
    isAuthenticated: !!session,
  }
} 