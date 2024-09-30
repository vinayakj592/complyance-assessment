import { useSession, signIn } from 'next-auth/react'
import { FileText, CheckCircle, XCircle, ClipboardList, LogIn } from 'lucide-react'
import Layout from '../components/Layout'
import Link from 'next/link'

export default function Home() {
  const { data: session } = useSession()

  const handleSignIn = (role: 'employee' | 'manager') => {
    signIn('google', { 
      callbackUrl: role === 'manager' ? '/manager-dashboard' : '/transactions',
      role: role
    })
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Complyance: Internal Transaction Approval System</h2>
        <p className="text-xl text-center mb-12">
          Streamline our company's financial transaction approvals and auditing process.
        </p>

        {!session ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-12">
            <h3 className="text-2xl font-semibold mb-6">Access</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Log in with your Google account to access the Complyance system.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => handleSignIn('employee')}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
              >
                <LogIn className="mr-2" />
                Sign in with Google as Employee
              </button>
              <button
                onClick={() => handleSignIn('manager')}
                className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 flex items-center justify-center"
              >
                <LogIn className="mr-2" />
                Sign in with Google as Manager
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center space-x-4 mb-12">
            {session.user.role === 'employee' ? (
              <>
                <Link
                  href="/submit-transaction"
                  className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Submit Transaction
                </Link>
                <Link
                  href="/transactions"
                  className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                >
                  View Transactions
                </Link>
              </>
            ) : (
              <Link
                href="/manager-dashboard"
                className="py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300"
              >
                Manager Dashboard
              </Link>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="mr-2 text-blue-600 dark:text-blue-400" />
              Submit Transactions
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Easily submit financial transactions for approval within our company.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <CheckCircle className="mr-2 text-green-600 dark:text-green-400" />
              Approve Transactions
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Managers can efficiently review and approve submitted transactions.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <ClipboardList className="mr-2 text-yellow-600 dark:text-yellow-400" />
              Audit Logs
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Maintain comprehensive audit trails for all internal financial activities.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <XCircle className="mr-2 text-red-600 dark:text-red-400" />
              Reject Transactions
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Managers can reject transactions that don't align with company policies.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
