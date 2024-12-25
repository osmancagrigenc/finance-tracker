'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import {
  HomeIcon,
  WalletIcon,
  ArrowTrendingUpIcon,
  CreditCardIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline'

const menuItems = [
  {
    name: 'Ana Sayfa',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Hesaplar',
    href: '/dashboard/accounts',
    icon: WalletIcon,
  },
  {
    name: 'Harcamalar',
    href: '/dashboard/transactions',
    icon: CreditCardIcon,
  },
  {
    name: 'Gelirler',
    href: '/dashboard/income',
    icon: ArrowTrendingUpIcon,
  },
  {
    name: 'Profil',
    href: '/dashboard/profile',
    icon: UserIcon,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout, session } = useAuth()

  return (
    <div className="flex flex-col h-full bg-white border-r">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">Finans Takip</h1>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-gray-500" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {session?.user?.email}
            </div>
            <div className="text-xs text-gray-500">
              {session?.user?.user_metadata?.name || 'Kullanıcı'}
            </div>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-md
                ${isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t">
        <button
          onClick={() => logout()}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
          Çıkış Yap
        </button>
      </div>
    </div>
  )
} 