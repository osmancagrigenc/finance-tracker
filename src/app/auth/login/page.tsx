'use client'

import { useState } from 'react'
import { AuthContainer } from '@/components/ui/auth-container'
import { useAuth } from '@/hooks/use-auth'

export default function LoginPage() {
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formTouched, setFormTouched] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormTouched(true)
    
    if (!email || !password) {
      return
    }

    await login(email, password)
  }

  const isEmailValid = email.includes('@') && email.includes('.')
  const isPasswordValid = password.length >= 6

  return (
    <AuthContainer
      title="Giriş Yap"
      description="Hesabınıza giriş yaparak finansal takibinize devam edin"
      linkText="Hesabınız yok mu? Kayıt olun"
      linkHref="/auth/register"
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email" className="sr-only">
              E-posta
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setFormTouched(true)
              }}
              className={`
                appearance-none rounded-none relative block w-full px-3 py-2 border
                placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none
                focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm
                ${formTouched && !isEmailValid ? 'border-red-300' : 'border-gray-300'}
              `}
              placeholder="E-posta adresi"
            />
            {formTouched && !isEmailValid && (
              <p className="mt-1 text-sm text-red-600">
                Geçerli bir e-posta adresi giriniz
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Şifre
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setFormTouched(true)
              }}
              className={`
                appearance-none rounded-none relative block w-full px-3 py-2 border
                placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none
                focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm
                ${formTouched && !isPasswordValid ? 'border-red-300' : 'border-gray-300'}
              `}
              placeholder="Şifre"
            />
            {formTouched && !isPasswordValid && (
              <p className="mt-1 text-sm text-red-600">
                Şifre en az 6 karakter olmalıdır
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Beni hatırla
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Şifremi unuttum
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading || (formTouched && (!isEmailValid || !isPasswordValid))}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </div>
      </form>
    </AuthContainer>
  )
} 