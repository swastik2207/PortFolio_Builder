// src/context/PortfolioContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Portfolio, PortfolioContextType } from '@/types/portfolio'

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export const PortfolioProvider = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useUser()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPortfolio = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/init-portfolio')
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      
      const data = await res.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setPortfolio(data.portfolio)
    } catch (err) {
      console.error('Error loading portfolio:', err)
      setError(err instanceof Error ? err.message : 'Failed to load portfolio')
    } finally {
      setLoading(false)
    }
  }

  const updatePortfolio = async (updatedData: Partial<Portfolio>) => {
    try {
      setError(null)
      
      // Optimistic update
      if (portfolio) {
        setPortfolio(prev => prev ? { ...prev, ...updatedData } : null)
      }

      // Send update to server
      const res = await fetch('/api/update-portfolio', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      // Update with server response (in case server modifies data)
      if (data.portfolio) {
        setPortfolio(data.portfolio)
      }

      console.log('Portfolio updated successfully!')
      
    } catch (err) {
      console.error('Error updating portfolio:', err)
      setError(err instanceof Error ? err.message : 'Failed to update portfolio')
      
      // Revert optimistic update on error
      await fetchPortfolio()
      
      throw err // Re-throw so component can handle it
    }
  }

  const refreshPortfolio = async () => {
    await fetchPortfolio()
  }

  useEffect(() => {
    if (!isSignedIn) {
      setPortfolio(null)
      setLoading(false)
      return
    }

    fetchPortfolio()
  }, [isSignedIn])

  return (
    <PortfolioContext.Provider value={{ 
      portfolio, 
      loading, 
      error,
      updatePortfolio,
      refreshPortfolio
    }}>
      {children}
    </PortfolioContext.Provider>
  )
}

export const usePortfolio = () => {
  const context = useContext(PortfolioContext)
  if (!context) throw new Error('usePortfolio must be used within PortfolioProvider')
  return context
}