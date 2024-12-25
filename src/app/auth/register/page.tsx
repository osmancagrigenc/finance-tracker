'use client'

import { useState } from 'react'
import { AuthContainer } from '@/components/ui/auth-container'
import { useAuth } from '@/hooks/use-auth'

export default function RegisterPage() {
  const { register, loading, error } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formTouched, setFormTouched] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormTouched(true)
    
    if (!isFormValid) {
      return
    }

    await register(email, password, name)
  }

  const isNameValid = name.length >= 2
  const isEmailValid = email.includes('@') && email.includes('.')
  const isPasswordValid = password.length >= 6
  const isConfirmPasswordValid = password === confirmPassword
  const isFormValid = isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid

  return (
    <AuthContainer
      title="Kayıt Ol"
      description="Yeni bir hesap oluşturarak finansal takibinize başlayın"
      linkText="Zaten hesabınız var mı? Giriş yapın"
      linkHref="/auth/login"
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        
        <div className="rounded-md shadow-sm space-y-4">
          <div>
            <label htmlFor="name" className="sr-only">
              Ad Soyad
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setFormTouched(true)
              }}
              className={`
                appearance-none relative block w-full px-3 py-2 border
                placeholder-gray-500 text-gray-900 rounded-md focus:outline-none
                focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm
                ${formTouched && !isNameValid ? 'border-red-300' : 'border-gray-300'}
              `}
              placeholder="Ad Soyad"
            />
            {formTouched && !isNameValid && (
              <p className="mt-1 text-sm text-red-600">
                Ad soyad en az 2 karakter olmalıdır
              </p>
            )}
          </div>
          
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
                appearance-none relative block w-full px-3 py-2 border
                placeholder-gray-500 text-gray-900 rounded-md focus:outline-none
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
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setFormTouched(true)
              }}
              className={`
                appearance-none relative block w-full px-3 py-2 border
                placeholder-gray-500 text-gray-900 rounded-md focus:outline-none
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
          
          <div>
            <label htmlFor="confirmPassword" className="sr-only">
              Şifre Tekrar
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setFormTouched(true)
              }}
              className={`
                appearance-none relative block w-full px-3 py-2 border
                placeholder-gray-500 text-gray-900 rounded-md focus:outline-none
                focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm
                ${formTouched && !isConfirmPasswordValid ? 'border-red-300' : 'border-gray-300'}
              `}
              placeholder="Şifre Tekrar"
            />
            {formTouched && !isConfirmPasswordValid && (
              <p className="mt-1 text-sm text-red-600">
                Şifreler eşleşmiyor
              </p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading || (formTouched && !isFormValid)}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </button>
        </div>
      </form>
    </AuthContainer>
  )
} 