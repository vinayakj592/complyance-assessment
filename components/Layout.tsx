import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Moon, Sun, LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Complyance
          </Link>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/submit-transaction" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Submit Transaction
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-red-600 dark:text-red-400 hover:underline flex items-center"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign In
              </button>
            )}
            <button
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400">
          © 2023 Complyance - Internal Company Tool. All rights reserved.
        </div>
      </footer>
    </div>
  )
}