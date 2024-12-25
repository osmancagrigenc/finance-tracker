'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/config'
import {
  WalletIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline'
import type { DashboardStats, Transaction } from '@/types'

export default function DashboardPage() {
  const { session } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    activeAccounts: 0,
    incomeChange: 0,
    expenseChange: 0,
    balanceChange: 0,
  })
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    if (session?.user?.id) {
      loadDashboardData()
    }
  }, [session?.user?.id])

  async function loadDashboardData() {
    try {
      setLoading(true)
      const userId = session?.user?.id

      // Hesapları yükle
      const { data: accounts } = await supabase
        .from('accounts')
        .select('balance')
        .eq('user_id', userId)

      // Bu ay ve geçen ayın işlemlerini yükle
      const today = new Date()
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)

      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .gte('date', firstDayOfLastMonth.toISOString())
        .order('date', { ascending: false })

      if (transactions && accounts) {
        // Toplam bakiye
        const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0)

        // Bu ayın işlemleri
        const thisMonthTransactions = transactions.filter(
          tx => new Date(tx.date) >= firstDayOfMonth
        )

        // Geçen ayın işlemleri
        const lastMonthTransactions = transactions.filter(
          tx => new Date(tx.date) >= firstDayOfLastMonth && new Date(tx.date) < firstDayOfMonth
        )

        // Bu ayın gelir/giderleri
        const thisMonthIncome = thisMonthTransactions
          .filter(tx => tx.type === 'income')
          .reduce((sum, tx) => sum + tx.amount, 0)

        const thisMonthExpense = thisMonthTransactions
          .filter(tx => tx.type === 'expense')
          .reduce((sum, tx) => sum + tx.amount, 0)

        // Geçen ayın gelir/giderleri
        const lastMonthIncome = lastMonthTransactions
          .filter(tx => tx.type === 'income')
          .reduce((sum, tx) => sum + tx.amount, 0)

        const lastMonthExpense = lastMonthTransactions
          .filter(tx => tx.type === 'expense')
          .reduce((sum, tx) => sum + tx.amount, 0)

        // Değişim yüzdeleri
        const incomeChange = lastMonthIncome ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0
        const expenseChange = lastMonthExpense ? ((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100 : 0
        const balanceChange = totalBalance ? ((totalBalance - (totalBalance - (thisMonthIncome - thisMonthExpense))) / totalBalance) * 100 : 0

        setStats({
          totalBalance,
          monthlyIncome: thisMonthIncome,
          monthlyExpense: thisMonthExpense,
          activeAccounts: accounts.length,
          incomeChange,
          expenseChange,
          balanceChange,
        })

        // Son işlemleri ayarla
        setRecentTransactions(transactions.slice(0, 5))
      }
    } catch (error) {
      console.error('Dashboard verisi yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const dashboardStats = [
    {
      name: 'Toplam Varlık',
      value: new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(stats.totalBalance),
      change: `${stats.balanceChange > 0 ? '+' : ''}${stats.balanceChange.toFixed(1)}%`,
      changeType: stats.balanceChange >= 0 ? 'positive' : 'negative',
      icon: BanknotesIcon,
    },
    {
      name: 'Aylık Gelir',
      value: new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(stats.monthlyIncome),
      change: `${stats.incomeChange > 0 ? '+' : ''}${stats.incomeChange.toFixed(1)}%`,
      changeType: stats.incomeChange >= 0 ? 'positive' : 'negative',
      icon: ArrowTrendingUpIcon,
    },
    {
      name: 'Aylık Gider',
      value: new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(stats.monthlyExpense),
      change: `${stats.expenseChange > 0 ? '+' : ''}${stats.expenseChange.toFixed(1)}%`,
      changeType: stats.expenseChange >= 0 ? 'negative' : 'positive',
      icon: ArrowTrendingDownIcon,
    },
    {
      name: 'Aktif Hesap',
      value: stats.activeAccounts.toString(),
      change: '0',
      changeType: 'neutral' as const,
      icon: WalletIcon,
    },
  ]

  return (
    <div>
      {/* Başlık */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Hoş Geldin, {session?.user?.user_metadata?.name || 'Kullanıcı'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          İşte finansal durumunun genel görünümü
        </p>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-blue-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
              <p
                className={`
                  ml-2 flex items-baseline text-sm font-semibold
                  ${
                    item.changeType === 'positive'
                      ? 'text-green-600'
                      : item.changeType === 'negative'
                      ? 'text-red-600'
                      : 'text-gray-500'
                  }
                `}
              >
                {item.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Son İşlemler */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Son İşlemler</h2>
        <div className="mt-4 bg-white shadow rounded-lg">
          {recentTransactions.length > 0 ? (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Açıklama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tutar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.category}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium
                        ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {new Intl.NumberFormat('tr-TR', {
                          style: 'currency',
                          currency: 'TRY'
                        }).format(Math.abs(transaction.amount))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-sm text-gray-500 text-center">
              Henüz işlem bulunmuyor
            </div>
          )}
        </div>
      </div>

      {/* Grafikler */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Gelir/Gider Grafiği */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Gelir/Gider Analizi</h3>
          <div className="mt-4 h-64 flex items-center justify-center text-sm text-gray-500">
            Grafik yakında eklenecek
          </div>
        </div>

        {/* Kategori Dağılımı */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Kategori Dağılımı</h3>
          <div className="mt-4 h-64 flex items-center justify-center text-sm text-gray-500">
            Grafik yakında eklenecek
          </div>
        </div>
      </div>
    </div>
  )
} 