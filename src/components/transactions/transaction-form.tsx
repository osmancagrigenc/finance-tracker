'use client'

import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { supabase } from '@/lib/supabase/config'
import type { Account, Transaction } from '@/types'

interface TransactionFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  initialData?: Transaction
}

const transactionTypes = [
  { id: 'income' as const, name: 'Gelir' },
  { id: 'expense' as const, name: 'Gider' },
] as const

const categories = [
  // Gelir kategorileri
  { id: 'salary', name: 'Maaş', type: 'income' },
  { id: 'investment', name: 'Yatırım Geliri', type: 'income' },
  { id: 'other_income', name: 'Diğer Gelirler', type: 'income' },
  // Gider kategorileri
  { id: 'food', name: 'Yemek', type: 'expense' },
  { id: 'transportation', name: 'Ulaşım', type: 'expense' },
  { id: 'rent', name: 'Kira', type: 'expense' },
  { id: 'utilities', name: 'Faturalar', type: 'expense' },
  { id: 'entertainment', name: 'Eğlence', type: 'expense' },
  { id: 'shopping', name: 'Alışveriş', type: 'expense' },
  { id: 'health', name: 'Sağlık', type: 'expense' },
  { id: 'education', name: 'Eğitim', type: 'expense' },
  { id: 'other_expense', name: 'Diğer Giderler', type: 'expense' },
]

type TransactionType = typeof transactionTypes[number]['id']

export function TransactionForm({ isOpen, onClose, onSubmit, initialData }: TransactionFormProps) {
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [formData, setFormData] = useState({
    account_id: initialData?.account_id || '',
    type: initialData?.type || 'expense',
    amount: initialData?.amount.toString() || '',
    category: initialData?.category || '',
    description: initialData?.description || '',
    date: initialData?.date.split('T')[0] || new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    async function loadAccounts() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
          .from('accounts')
          .select('*')
          .eq('user_id', user.id)
          .order('name')

        if (data) setAccounts(data)
      } catch (error) {
        console.error('Hesaplar yüklenirken hata:', error)
      }
    }

    loadAccounts()
  }, [])

  const filteredCategories = categories.filter(
    (category) => category.type === formData.type
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit({
        account_id: formData.account_id,
        type: formData.type as TransactionType,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        date: new Date(formData.date).toISOString(),
      })
      onClose()
    } catch (error) {
      console.error('İşlem kaydedilirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6">
          <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
            {initialData ? 'İşlemi Düzenle' : 'Yeni İşlem Ekle'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                İşlem Türü
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    type: e.target.value as TransactionType,
                    category: '', // Kategoriyi sıfırla
                  })
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                {transactionTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="account" className="block text-sm font-medium text-gray-700">
                Hesap
              </label>
              <select
                id="account"
                value={formData.account_id}
                onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">Hesap Seçin</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Tutar
              </label>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Kategori
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">Kategori Seçin</option>
                {filteredCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Açıklama
              </label>
              <input
                type="text"
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Tarih
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
} 