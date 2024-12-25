'use client'

import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { supabase } from '@/lib/supabase/config'
import type { Account, Salary } from '@/types'

interface SalaryFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Salary, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  initialData?: Salary
}

export function SalaryForm({ isOpen, onClose, onSubmit, initialData }: SalaryFormProps) {
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [formData, setFormData] = useState({
    account_id: initialData?.account_id || '',
    amount: initialData?.amount.toString() || '',
    payment_day: initialData?.payment_day.toString() || '1',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit({
        account_id: formData.account_id,
        amount: parseFloat(formData.amount),
        payment_day: parseInt(formData.payment_day),
      })
      onClose()
    } catch (error) {
      console.error('Maaş kaydedilirken hata:', error)
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
            {initialData ? 'Maaş Bilgisini Düzenle' : 'Yeni Maaş Bilgisi Ekle'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                Maaş Tutarı
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
              <label htmlFor="payment_day" className="block text-sm font-medium text-gray-700">
                Ödeme Günü
              </label>
              <input
                type="number"
                id="payment_day"
                value={formData.payment_day}
                onChange={(e) => setFormData({ ...formData, payment_day: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
                min="1"
                max="31"
              />
              <p className="mt-1 text-sm text-gray-500">
                Her ayın hangi gününde maaş ödemesi yapılacak? (1-31 arası)
              </p>
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