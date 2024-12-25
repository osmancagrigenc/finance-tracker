'use client'

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import type { Account } from '@/types'

interface AccountFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Account, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  initialData?: Account
}

const accountTypes = [
  { id: 'cash' as const, name: 'Nakit' },
  { id: 'bank' as const, name: 'Banka' },
  { id: 'credit' as const, name: 'Kredi Kartı' },
  { id: 'investment' as const, name: 'Yatırım' },
] as const

type AccountType = typeof accountTypes[number]['id']

export function AccountForm({ isOpen, onClose, onSubmit, initialData }: AccountFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<{
    name: string
    type: AccountType
    balance: string
  }>({
    name: initialData?.name || '',
    type: (initialData?.type as AccountType) || 'bank',
    balance: initialData?.balance.toString() || '0',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit({
        name: formData.name,
        type: formData.type,
        balance: parseFloat(formData.balance),
      })
      onClose()
    } catch (error) {
      console.error('Hesap kaydedilirken hata:', error)
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
            {initialData ? 'Hesabı Düzenle' : 'Yeni Hesap Ekle'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Hesap Adı
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Hesap Türü
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as AccountType })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                {accountTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="balance" className="block text-sm font-medium text-gray-700">
                Bakiye
              </label>
              <input
                type="number"
                id="balance"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
                step="0.01"
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