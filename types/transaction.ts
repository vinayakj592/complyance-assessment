export interface Transaction {
    _id: string
    amount: number
    description: string
    category: string
    userEmail: string
    createdAt: string
    status: 'pending' | 'approved' | 'rejected'
  }