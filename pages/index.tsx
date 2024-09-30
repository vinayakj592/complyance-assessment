import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Complyance</h1>
      {session ? (
        <div>
          <p className="mb-4">Hello, {session.user?.name}</p>
          <Link
            href="/transactions"
            className="bg-primary text-white px-4 py-2 rounded-md"
          >
            View Transactions
          </Link>
        </div>
      ) : (
        <p>Please sign in to access your transactions.</p>
      )}
    </div>
  )
}