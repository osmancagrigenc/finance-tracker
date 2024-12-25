export interface User {
  id: string
  email: string
  created_at: string
}

export interface Account {
  id: string
  user_id: string
  name: string
  type: 'cash' | 'bank' | 'credit' | 'investment'
  balance: number
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  account_id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string
  created_at: string
}

export interface RecurringTransaction {
  id: string
  user_id: string
  account_id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  start_date: string
  end_date?: string
  created_at: string
}

export interface Salary {
  id: string
  user_id: string
  account_id: string
  amount: number
  payment_day: number
  created_at: string
} 