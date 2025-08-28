'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import PersonalInfoPage from './_components/PersonalInfoPage'
import TopSkillsPage from './_components/TopSkillsPage'
import ExperiancePage from './_components/ExperiancePage'
import EducationPage from './_components/EducationPage'
import CertificationPage from './_components/CertificationPage'
import TopProjectsPage from './_components/TopProjectsPage'
import PortfolioNavBar from './_components/PortfolioNavBar'
import { ChatbotFAB } from '@/components/PortfolioChatbot'
import { Portfolio } from '@/types/portfolio'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
    AlertTriangle,
    FileText,
    Home,
    RefreshCw,
    ArrowUp,
    Heart,
    Loader2
} from 'lucide-react'
import Link from 'next/link'
import ContactPage from './_components/ContactPage'

const PublicPortfolioPage = () => {
    const params = useParams()
    const username = params.username as string
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

    const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Fetch portfolio data by username
    useEffect(() => {
        const fetchPortfolio = async () => {
            if (!username) {
                setError('Username is required')
                setLoading(false)
                return
            }

            setLoading(true)
            setError(null)

            try {
                const response = await fetch(`/api/fetch-portfolio/${username}`)

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(`Portfolio for "${username}" not found`)
                    }
                    throw new Error('Failed to fetch portfolio data')
                }

                const data = await response.json()
                setPortfolio(data.portfolio)
            } catch (error) {
                console.error('Error fetching portfolio:', error)
                setError(error instanceof Error ? error.message : 'Unknown error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchPortfolio()
    }, [username])

    // Loading State with shadcn components
    if (loading) {
        return (
            <div
                className="min-h-screen"
                style={{
                    '--theme-bg': '#0a0f1a',
                    '--theme-card': '#1a1f2e',
                    '--theme-card-hover': '#242938',
                    '--theme-border': '#2a2f3e',
                    '--theme-text-primary': '#e2e8f0',
                    '--theme-text-secondary': '#94a3b8',
                    '--theme-text-muted': '#64748b',
                    '--theme-accent': '#3b82f6',
                    '--theme-accent-hover': '#2563eb',
                    backgroundColor: 'var(--theme-bg)'
                } as React.CSSProperties}
            >
                <div className="max-w-5xl mx-auto px-4 py-16">
                    <div className="text-center mb-16">
                        <div className="flex justify-center mb-4">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--theme-text-primary)' }}>
                            Loading Portfolio
                        </h2>
                        <p style={{ color: 'var(--theme-text-secondary)' }}>
                            Please wait while we fetch the latest information...
                        </p>
                    </div>

                    {/* Loading Skeleton using shadcn */}
                    <div className="space-y-8">
                        {[1, 2, 3, 4].map(i => (
                            <Card key={i} className="border-gray-700 bg-gray-800/50">
                                <CardHeader>
                                    <Skeleton className="h-6 w-1/4 bg-gray-700" />
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Skeleton className="h-4 w-3/4 bg-gray-700" />
                                    <Skeleton className="h-4 w-1/2 bg-gray-700" />
                                    <Skeleton className="h-4 w-2/3 bg-gray-700" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // Error State with shadcn components
    if (error) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{
                    '--theme-bg': '#0a0f1a',
                    '--theme-card': '#1a1f2e',
                    '--theme-card-hover': '#242938',
                    '--theme-border': '#0a0f1a',
                    '--theme-text-primary': '#e2e8f0',
                    '--theme-text-secondary': '#94a3b8',
                    '--theme-text-muted': '#64748b',
                    '--theme-accent': '#3b82f6',
                    '--theme-accent-hover': '#2563eb',
                    backgroundColor: 'var(--theme-bg)'
                } as React.CSSProperties}
            >
                <div className="max-w-md mx-auto px-4">
                    <Card className="border-red-800 bg-red-900/10">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                                    <AlertTriangle className="w-8 h-8 text-red-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl text-red-300 mb-2">
                                        Portfolio Not Found
                                    </CardTitle>
                                    <CardDescription className="text-red-200">
                                        {error}
                                    </CardDescription>
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="destructive"
                                        onClick={() => window.location.reload()}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Try Again
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        asChild
                                        className="bg-gray-600 hover:bg-gray-700"
                                    >
                                        <a href="/">
                                            <Home className="w-4 h-4 mr-2" />
                                            Go Home
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    // No Portfolio State with shadcn components
    if (!portfolio) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{
                    '--theme-bg': '#0a0f1a',
                    '--theme-card': '#1a1f2e',
                    '--theme-card-hover': '#242938',
                    '--theme-border': '#0a0f1a',
                    '--theme-text-primary': '#e2e8f0',
                    '--theme-text-secondary': '#94a3b8',
                    '--theme-text-muted': '#64748b',
                    '--theme-accent': '#3b82f6',
                    '--theme-accent-hover': '#2563eb',
                    backgroundColor: 'var(--theme-bg)'
                } as React.CSSProperties}
            >
                <div className="max-w-md mx-auto px-4">
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                                    <FileText className="w-8 h-8 text-gray-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl text-gray-100 mb-2">
                                        Portfolio Not Available
                                    </CardTitle>
                                    <CardDescription className="text-gray-300">
                                        The portfolio for "{username}" could not be found.
                                    </CardDescription>
                                </div>
                                <Button
                                    asChild
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <a href="/">
                                        <Home className="w-4 h-4 mr-2" />
                                        Go Home
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div
            className="min-h-screen relative"
            style={{
                '--theme-bg': '#0a0f1a',
                '--theme-card': '#1a1f2e',
                '--theme-card-hover': '#242938',
                '--theme-border': '#0a0f1a',
                '--theme-text-primary': '#e2e8f0',
                '--theme-text-secondary': '#94a3b8',
                '--theme-text-muted': '#64748b',
                '--theme-accent': '#3b82f6',
                '--theme-accent-hover': '#2563eb'
            } as React.CSSProperties}
        >
            {/* Navigation Bar */}
            <PortfolioNavBar portfolio={portfolio} username={username} />

            {/* Personal Info Section */}
            <section id="about" className="-mt-10">
                <div className="backdrop-blur-sm bg-transparent border-none">
                    <PersonalInfoPage portfolio={portfolio} />
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
                <div className="space-y-12">
                    {/* Top Skills Section */}
                    <section id="skills" className="scroll-mt-20">
                        <div className="backdrop-blur-sm bg-transparent border-none">
                            <TopSkillsPage portfolio={portfolio} username={username} />
                        </div>
                    </section>

                    {/* Projects Section */}
                    <section id="projects" className="scroll-mt-20">
                        <div className="backdrop-blur-sm bg-transparent border-none">
                            <TopProjectsPage portfolio={portfolio} username={username} />
                        </div>
                    </section>

                    {/* Experience Section */}
                    <section id="experience" className="scroll-mt-20">
                        <div className="backdrop-blur-sm bg-transparent border-none">
                            <ExperiancePage portfolio={portfolio} />
                        </div>
                    </section>

                    {/* Education Section */}
                    <section id="education" className="scroll-mt-20">
                        <div className="backdrop-blur-sm bg-transparent border-none">
                            <EducationPage portfolio={portfolio} />
                        </div>
                    </section>

                    {/* Certification Section */}
                    <section id="certifications" className="scroll-mt-20">
                        <div className="backdrop-blur-sm bg-transparent border-none">
                            <CertificationPage portfolio={portfolio} />
                        </div>
                    </section>

                    {/* Contact Section */}
                    <section id="contact" className="scroll-mt-20">
                        <div className="backdrop-blur-sm bg-transparent border-none">
                            <ContactPage portfolio={portfolio} />
                        </div>
                    </section>
                </div>
            </main>
            {/* Footer */}
            <footer className="bg-black backdrop-blur-sm mt-16 py-8 w-auto">
                <p className="text-sm text-gray-400 flex items-center justify-center">
                    Built with <Heart className="w-4 h-4 mx-1 text-red-400" fill="currentColor" /> using{' '}
                    <Link
                        href={baseUrl || "/"}
                        target="_blank"
                        className="text-blue-400 hover:underline ml-1"
                    >
                        Portfolio Platform
                    </Link>
                </p>

            </footer>

            {/* Floating Back to Top Button */}
            <Button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 left-6 w-12 h-12 rounded-full bg-gray-950 border-gray-600 hover:bg-black hover:border-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                variant="outline"
                size="icon"
                aria-label="Back to top"
            >
                <ArrowUp className="w-8 h-8 text-white transform group-hover:-translate-y-0.5 transition-transform duration-300" />
            </Button>

            {/* Portfolio Chatbot */}
            <ChatbotFAB username={username} />
        </div>
    )
}

export default PublicPortfolioPage