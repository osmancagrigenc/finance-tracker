'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase/config'
import { AccountForm } from '@/components/accounts/account-form'
import type { Account } from '@/types'

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>()

  useEffect(() => {
    loadAccounts()
  }, [])

  async function loadAccounts() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setAccounts(data)
    } catch (error) {
      console.error('Hesaplar yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAccount = async (data: Omit<Account, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('accounts')
        .insert([{ ...data, user_id: user.id }])

      if (error) throw error
      await loadAccounts()
    } catch (error) {
      console.error('Hesap eklenirken hata:', error)
      throw error
    }
  }

  const handleUpdateAccount = async (data: Omit<Account, 'id' | 'user_id' | 'created_at'>) => {
    if (!selectedAccount) return

    try {
      const { error } = await supabase
        .from('accounts')
        .update(data)
        .eq('id', selectedAccount.id)

      if (error) throw error
      await loadAccounts()
    } catch (error) {
      console.error('Hesap güncellenirken hata:', error)
      throw error
    }
  }

  const handleDeleteAccount = async (account: Account) => {
    if (!confirm('Bu hesabı silmek istediğinize emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', account.id)

      if (error) throw error
      await loadAccounts()
    } catch (error) {
      console.error('Hesap silinirken hata:', error)
    }
  }

  const openEditForm = (account: Account) => {
    setSelectedAccount(account)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setSelectedAccount(undefined)
    setIsFormOpen(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Hesaplarım</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Yeni Hesap
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {accounts.map((account) => (
            <li key={account.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{account.name}</p>
                    <p className="text-sm text-gray-500">{account.type}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="text-sm font-medium text-gray-900">
                      {new Intl.NumberFormat('tr-TR', {
                        style: 'currency',
                        currency: 'TRY',
                      }).format(account.balance)}
                    </p>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditForm(account)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(account)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {accounts.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              Henüz hesap eklenmemiş. Yeni hesap eklemek için yukarıdaki butonu kullanın.
            </li>
          )}
        </ul>
      </div>

      <AccountForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={selectedAccount ? handleUpdateAccount : handleAddAccount}
        initialData={selectedAccount}
      />
    </div>
  )
} 