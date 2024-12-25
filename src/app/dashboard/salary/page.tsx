'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase/config'
import { SalaryForm } from '@/components/salary/salary-form'
import type { Salary, Account } from '@/types'

export default function SalaryPage() {
  const [salaries, setSalaries] = useState<(Salary & { account: Account })[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedSalary, setSelectedSalary] = useState<Salary | undefined>()

  useEffect(() => {
    loadSalaries()
  }, [])

  async function loadSalaries() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('salaries')
        .select(`
          *,
          account:accounts (
            id,
            name,
            type
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setSalaries(data)
    } catch (error) {
      console.error('Maaş bilgileri yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSalary = async (data: Omit<Salary, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('salaries')
        .insert([{ ...data, user_id: user.id }])

      if (error) throw error
      await loadSalaries()
    } catch (error) {
      console.error('Maaş bilgisi eklenirken hata:', error)
      throw error
    }
  }

  const handleUpdateSalary = async (data: Omit<Salary, 'id' | 'user_id' | 'created_at'>) => {
    if (!selectedSalary) return

    try {
      const { error } = await supabase
        .from('salaries')
        .update(data)
        .eq('id', selectedSalary.id)

      if (error) throw error
      await loadSalaries()
    } catch (error) {
      console.error('Maaş bilgisi güncellenirken hata:', error)
      throw error
    }
  }

  const handleDeleteSalary = async (salary: Salary) => {
    if (!confirm('Bu maaş bilgisini silmek istediğinize emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('salaries')
        .delete()
        .eq('id', salary.id)

      if (error) throw error
      await loadSalaries()
    } catch (error) {
      console.error('Maaş bilgisi silinirken hata:', error)
    }
  }

  const openEditForm = (salary: Salary) => {
    setSelectedSalary(salary)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setSelectedSalary(undefined)
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
        <h1 className="text-2xl font-semibold text-gray-900">Maaş Yönetimi</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Yeni Maaş Bilgisi
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hesap
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ödeme Günü
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
            {salaries.map((salary) => (
              <tr key={salary.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {salary.account.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Her ayın {salary.payment_day}. günü
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                  {new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY',
                  }).format(salary.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => openEditForm(salary)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSalary(salary)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {salaries.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Henüz maaş bilgisi eklenmemiş. Yeni maaş bilgisi eklemek için yukarıdaki butonu kullanın.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Maaş Ödemeleri Nasıl Çalışır?</h2>
        <div className="prose prose-sm text-gray-500">
          <p>
            Maaş bilgilerinizi ekledikten sonra, sistem her ay belirttiğiniz günde otomatik olarak
            maaş tutarını seçtiğiniz hesaba gelir olarak ekleyecektir.
          </p>
          <p className="mt-2">
            Örneğin, maaş gününüz ayın 15'i olarak belirlenmişse, her ayın 15'inde otomatik olarak
            bir gelir işlemi oluşturulacak ve hesap bakiyeniz güncellenecektir.
          </p>
          <p className="mt-2">
            Not: Otomatik maaş ödemeleri için sistemin çalışması gerekir. Eğer sistem kapalıysa veya
            bir sorun oluşursa, maaş ödemesi bir sonraki kontrol zamanında gerçekleştirilecektir.
          </p>
        </div>
      </div>

      <SalaryForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={selectedSalary ? handleUpdateSalary : handleAddSalary}
        initialData={selectedSalary}
      />
    </div>
  )
} 