import React, { ReactNode, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { Transition } from '@headlessui/react'

type LayoutProps = {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <nav className="bg-primary dark:bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-white font-bold text-xl">
                Complyance
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {session ? (
                  <>
                    <Link href="/transactions" className="text-white hover:bg-primary-dark dark:hover:bg-secondary-dark px-3 py-2 rounded-md text-sm font-medium">
                      Transactions
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="bg-white text-primary hover:bg-gray-200 dark:bg-gray-800 dark:text-secondary dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => signIn('google')}
                    className="bg-white text-primary hover:bg-gray-200 dark:bg-gray-800 dark:text-secondary dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
                  >
                    Sign in with Google
                  </button>
                )}
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="text-white hover:bg-primary-dark dark:hover:bg-secondary-dark p-2 rounded-md"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-6 w-6" />
                  ) : (
                    <Moon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="bg-primary dark:bg-secondary inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-dark dark:hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <X className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        <Transition
          show={isOpen}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {session ? (
              <>
                <Link href="/transactions" className="text-white hover:bg-primary-dark dark:hover:bg-secondary-dark block px-3 py-2 rounded-md text-base font-medium">
                  Transactions
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left bg-white text-primary hover:bg-gray-200 dark:bg-gray-800 dark:text-secondary dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="w-full text-left bg-white text-primary hover:bg-gray-200 dark:bg-gray-800 dark:text-secondary dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                Sign in with Google
              </button>
            )}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-full text-left text-white hover:bg-primary-dark dark:hover:bg-secondary-dark block px-3 py-2 rounded-md text-base font-medium"
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </Transition>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}

export default Layout
