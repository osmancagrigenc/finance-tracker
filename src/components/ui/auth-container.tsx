import { ReactNode } from 'react'
import Link from 'next/link'

interface AuthContainerProps {
  children: ReactNode
  title: string
  description: string
  linkText: string
  linkHref: string
}

export function AuthContainer({
  children,
  title,
  description,
  linkText,
  linkHref,
}: AuthContainerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm">
        <div>
          <Link href="/" className="block text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Finans Takip</h2>
          </Link>
          <h2 className="text-center text-2xl font-bold text-gray-900">{title}</h2>
          <p className="mt-2 text-center text-sm text-gray-600">{description}</p>
        </div>
        {children}
        <div className="text-center">
          <Link href={linkHref} className="text-sm text-blue-600 hover:text-blue-500">
            {linkText}
          </Link>
        </div>
      </div>
    </div>
  )
} 