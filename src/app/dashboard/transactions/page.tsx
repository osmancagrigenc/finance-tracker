'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase/config'
import { TransactionForm } from '@/components/transactions/transaction-form'
import type { Transaction, Account } from '@/types'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<(Transaction & { account: Account })[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>()

  useEffect(() => {
    loadTransactions()
  }, [])

  async function loadTransactions() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          account:accounts (
            id,
            name,
            type
          )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) throw error
      if (data) setTransactions(data)
    } catch (error) {
      console.error('İşlemler yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTransaction = async (data: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // İşlemi ekle
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{ ...data, user_id: user.id }])

      if (transactionError) throw transactionError

      // Hesap bakiyesini güncelle
      const amount = data.type === 'income' ? data.amount : -data.amount
      const { error: accountError } = await supabase.rpc('update_account_balance', {
        p_account_id: data.account_id,
        p_amount: amount
      })

      if (accountError) throw accountError

      await loadTransactions()
    } catch (error) {
      console.error('İşlem eklenirken hata:', error)
      throw error
    }
  }

  const handleUpdateTransaction = async (data: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    if (!selectedTransaction) return

    try {
      // Eski işlem tutarını geri al
      const oldAmount = selectedTransaction.type === 'income' 
        ? -selectedTransaction.amount 
        : selectedTransaction.amount

      await supabase.rpc('update_account_balance', {
        p_account_id: selectedTransaction.account_id,
        p_amount: oldAmount
      })

      // Yeni işlemi kaydet
      const { error: transactionError } = await supabase
        .from('transactions')
        .update(data)
        .eq('id', selectedTransaction.id)

      if (transactionError) throw transactionError

      // Yeni tutarı ekle
      const newAmount = data.type === 'income' ? data.amount : -data.amount
      const { error: accountError } = await supabase.rpc('update_account_balance', {
        p_account_id: data.account_id,
        p_amount: newAmount
      })

      if (accountError) throw accountError

      await loadTransactions()
    } catch (error) {
      console.error('İşlem güncellenirken hata:', error)
      throw error
    }
  }

  const handleDeleteTransaction = async (transaction: Transaction) => {
    if (!confirm('Bu işlemi silmek istediğinize emin misiniz?')) return

    try {
      // İşlem tutarını geri al
      const amount = transaction.type === 'income' 
        ? -transaction.amount 
        : transaction.amount

      await supabase.rpc('update_account_balance', {
        p_account_id: transaction.account_id,
        p_amount: amount
      })

      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transaction.id)

      if (error) throw error
      await loadTransactions()
    } catch (error) {
      console.error('İşlem silinirken hata:', error)
    }
  }

  const openEditForm = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setSelectedTransaction(undefined)
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
        <h1 className="text-2xl font-semibold text-gray-900">İşlemler</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Yeni İşlem
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hesap
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
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(transaction.date).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.account.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <span
                    className={`font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {new Intl.NumberFormat('tr-TR', {
                      style: 'currency',
                      currency: 'TRY',
                    }).format(transaction.amount)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => openEditForm(transaction)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(transaction)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Henüz işlem eklenmemiş. Yeni işlem eklemek için yukarıdaki butonu kullanın.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={selectedTransaction ? handleUpdateTransaction : handleAddTransaction}
        initialData={selectedTransaction}
      />
    </div>
  )
} 