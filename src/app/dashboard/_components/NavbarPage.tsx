'use client'

import { SignOutButton } from '@clerk/nextjs'

export default function NavbarSection() {
  return (
    <nav className="absolute backdrop-blur-sm border-b sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand section */}
          <div className="flex items-center">
            <div className="text-xl font-bold text-gray-900">
              Portfolio Platform
            </div>
          </div>

          {/* Navigation items */}
          <div className="flex items-center space-x-4">
            <SignOutButton redirectUrl="/sign-in">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>
    </nav>
  )
}