'use client'

import { AuthContainer } from '@/components/ui/auth-container'

export default function VerifyPage() {
  return (
    <AuthContainer
      title="E-posta Doğrulama"
      description="Hesabınızı aktifleştirmek için e-posta adresinize gönderilen doğrulama bağlantısına tıklayın"
      linkText="Giriş sayfasına dön"
      linkHref="/auth/login"
    >
      <div className="mt-8 space-y-6">
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-blue-800">
                E-posta Doğrulama Gerekli
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Hesabınızı aktifleştirmek için e-posta adresinize gönderilen doğrulama
                  bağlantısına tıklayın. E-posta birkaç dakika içinde gelmezse spam
                  klasörünü kontrol edin.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-center text-gray-600">
          <p>
            E-posta almadınız mı?{' '}
            <button className="font-medium text-blue-600 hover:text-blue-500">
              Tekrar gönder
            </button>
          </p>
        </div>
      </div>
    </AuthContainer>
  )
} 