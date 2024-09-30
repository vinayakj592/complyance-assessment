import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Layout from '../components/Layout'
import { Transaction } from '../types/transaction'

export default function ManagerDashboard() {
  const { data: session } = useSession()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session && session.user.role === 'manager') {
      fetchTransactions()
    }
  }, [session])

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/manager/transactions')
      if (!res.ok) {
        throw new Error('Failed to fetch transactions')
      }
      const data = await res.json()
      setTransactions(data)
    } catch (err) {
      setError('Failed to load transactions. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTransactionAction = async (transactionId: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch(`/api/manager/transactions/${transactionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (!res.ok) {
        throw new Error(`Failed to ${action} transaction`)
      }

      // Update the local state
      setTransactions(prevTransactions =>
        prevTransactions.map(t =>
          t._id === transactionId ? { ...t, status: action === 'approve' ? 'approved' : 'rejected' } : t
        )
      )
    } catch (err) {
      setError(`Failed to ${action} transaction. Please try again.`)
    }
  }

  if (!session || session.user.role !== 'manager') {
    return (
      <Layout>
        <p>Access denied. This page is only available to managers.</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Manager Dashboard</h2>
        {isLoading ? (
          <p>Loading transactions...</p>
        ) : error ? (
          <p className="text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {transaction.userEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {transaction.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {transaction.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {transaction.status === 'pending' && (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleTransactionAction(transaction._id, 'approve')}
                            className="text-green-600 hover:text-green-900 dark:hover:text-green-400"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleTransactionAction(transaction._id, 'reject')}
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}