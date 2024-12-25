export interface DashboardStats {
  totalBalance: number
  monthlyIncome: number
  monthlyExpense: number
  activeAccounts: number
  incomeChange: number
  expenseChange: number
  balanceChange: number
}

export interface Transaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  date: string
  category: string
  user_id: string
  account_id: string
}

export interface Account {
  id: string
  name: string
  type: string
  balance: number
  user_id: string
  created_at: string
}

export interface User {
  id: string
  email: string
  name: string
  preferences: {
    currency: string
    notifications: {
      email: boolean
      expenses: boolean
      bills: boolean
    }
  }
}

export interface Salary {
  id: string
  user_id: string
  account_id: string
  amount: number
  payment_day: number
  created_at: string
} 