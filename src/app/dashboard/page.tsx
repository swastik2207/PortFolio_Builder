'use client'

import React, { useEffect, useState } from 'react'
import NavbarSection from './_components/NavbarPage'
import PersonalInfoSection from './_components/PersonalInfoSection'
import SkillsSection from './_components/SkillsSection'
import ProjectsSection from './_components/ProjectsSection'
import ExperienceSection from './_components/ExperienceSection'
import EducationSection from './_components/EducationSection'
import CertificationsSection from './_components/CertificationsSection'
import { useUser } from '@clerk/nextjs'
import { usePortfolio } from '@/context/PortfolioContext'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { Portfolio } from '@/types/portfolio'
import { Metadata } from 'next'

// Section interface for type safety
interface Section {
  id: string
  title: string
  component: React.ComponentType<{
    portfolio: Portfolio
    onUpdate: (data: Partial<Portfolio>) => Promise<void>
  }>
  description: string
}

function Dashboard() {
  const user = useUser()
  console.log('User data:', user)

  const { portfolio, loading, error, updatePortfolio, refreshPortfolio } = usePortfolio()
  const [currentSection, setCurrentSection] = useState<number>(0)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 
  const username = user.user?.username || 'user'
  const publicUrl = `${baseUrl}/public-portfolio/${portfolio?.username || username}`
  const [copied, setCopied] = useState(false)


  const sections: Section[] = [
    {
      id: 'personal',
      title: 'Personal Info',
      component: PersonalInfoSection,
      description: 'Basic information and bio'
    },
    {
      id: 'skills',
      title: 'Skills',
      component: SkillsSection,
      description: 'Technical and soft skills'
    },
    {
      id: 'projects',
      title: 'Projects',
      component: ProjectsSection,
      description: 'Portfolio projects'
    },
    {
      id: 'experience',
      title: 'Experience',
      component: ExperienceSection,
      description: 'Work experience'
    },
    {
      id: 'education',
      title: 'Education',
      component: EducationSection,
      description: 'Educational background'
    },
    {
      id: 'certifications',
      title: 'Certifications',
      component: CertificationsSection,
      description: 'Certificates and achievements'
    }
  ]

  useEffect(() => {
    if (!user.isSignedIn && user.isLoaded) {
      window.location.href = '/sign-in'
    }
  }, [user.isSignedIn, user.isLoaded])

  const goToSection = (index: number): void => {
    setCurrentSection(index)
  }

  const nextSection = (): void => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const prevSection = (): void => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleRetry = async (): Promise<void> => {
    try {
      await refreshPortfolio()
    } catch (err) {
      console.error('Retry failed:', err)
      // Fallback to page reload if refresh fails
      window.location.reload()
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavbarSection />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading your portfolio...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavbarSection />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h1 className="text-2xl font-bold text-red-600 mb-2">
                Error Loading Portfolio
              </h1>
              <p className="text-red-700 mb-4">
                {error || 'Portfolio not found'}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="default"
                >
                  Reload Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const CurrentComponent = sections[currentSection].component

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarSection />
      {/* Welcome Banner */}
      <div className="container mx-auto px-4 pt-8">
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-900 mb-1">
              Welcome, {user.user?.fullName || user.user?.firstName || user.user?.username || 'User'}
            </h1>
            <p className="text-blue-700 text-sm">
              {user.user?.emailAddresses?.[0]?.emailAddress || 'No email found'}
            </p>
          </div>

          {/* Public URL Section */}
          <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end">
            <label className="text-sm font-medium text-blue-900 mb-1">
              Your public portfolio link
            </label>
            <div className="flex items-center gap-2 bg-white border border-blue-200 rounded px-3 py-2">
              <span className="text-sm text-blue-800">{publicUrl}</span>
              <Button
                onClick={handleCopy}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        </div>
      </div>


      <div className="container mx-auto px-4 py-8">
        {/* Error Banner (if there's an error while portfolio is loaded) */}
        {error && portfolio && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-yellow-600">⚠️</span>
                <span className="text-yellow-800 text-sm">
                  {error}
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.location.reload()}
                className="text-yellow-700 border-yellow-300"
              >
                Refresh
              </Button>
            </div>
          </div>
        )}

        {/* Section Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {sections.map((section, index) => (
              <Button
                key={section.id}
                variant={currentSection === index ? "default" : "outline"}
                size="sm"
                onClick={() => goToSection(index)}
                className="text-xs"
              >
                {index + 1}. {section.title}
              </Button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-black h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Current Section */}
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              {sections[currentSection].title}
            </h2>
            <p className="text-gray-600">{sections[currentSection].description}</p>
          </div>

          <CurrentComponent
            portfolio={portfolio}
            onUpdate={updatePortfolio}
          />
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevSection}
            disabled={currentSection === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <span className="text-sm text-gray-500">
            {currentSection + 1} of {sections.length}
          </span>

          <Button
            onClick={nextSection}
            disabled={currentSection === sections.length - 1}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard