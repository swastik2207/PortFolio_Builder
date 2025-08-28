import React, { useState } from 'react'
import { Portfolio } from '@/types/portfolio'
import Link from 'next/link'

interface PortfolioNavBarProps {
    portfolio: Portfolio
    username: string
}

const PortfolioNavBar: React.FC<PortfolioNavBarProps> = ({ portfolio, username }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navigationItems = [
        { name: 'About', href: '#about' },
        { name: 'Skills', href: '#skills' },
        { name: 'Projects', href: '#projects' },
        { name: 'Experience', href: '#experience' },
        { name: 'Education', href: '#education' },
        { name: 'Certifications', href: '#certifications' },
        { name: 'Contact', href: '#contact' }
    ]

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <div className="absolute backdrop-blur-sm border-b sticky top-0 z-50" style={{
            backgroundColor: 'rgba(26, 31, 46, 0.8)',
            borderColor: 'var(--theme-border)'
        }}>
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm" style={{
                            backgroundColor: 'var(--theme-accent)'
                        }}>
                            {portfolio.fullName?.[0]?.toUpperCase() || username[0].toUpperCase()}
                        </div>
                        <div>
                            <h1 className="font-semibold" style={{ color: 'var(--theme-text-primary)' }}>
                                {portfolio.fullName || username}
                            </h1>
                            <p className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>Portfolio</p>
                        </div>
                    </div>

                    {/* Desktop Navigation Pills */}
                    <nav className="hidden md:flex items-center gap-2">
                        {navigationItems.map(item => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="px-3 py-1.5 text-sm rounded-lg transition-all duration-200"
                                style={{ color: 'var(--theme-text-secondary)' }}
                                onMouseEnter={(e) => {
                                    const el = e.currentTarget as HTMLAnchorElement
                                    el.style.color = 'var(--theme-accent)'
                                    el.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'
                                }}
                                onMouseLeave={(e) => {
                                    const el = e.currentTarget as HTMLAnchorElement
                                    el.style.color = 'var(--theme-text-secondary)'
                                    el.style.backgroundColor = 'transparent'
                                }}
                            >
                                {item.name}
                            </Link>

                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg transition-all duration-200"
                        style={{ color: 'var(--theme-text-secondary)' }}
                        onClick={toggleMobileMenu}
                        onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLButtonElement;
                            el.style.color = 'var(--theme-accent)';
                            el.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLButtonElement;
                            el.style.color = 'var(--theme-text-secondary)';
                            el.style.backgroundColor = 'transparent';
                        }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={`md:hidden mt-4 pb-4 border-t pt-4 ${isMobileMenuOpen ? 'block' : 'hidden'}`} style={{ borderColor: 'var(--theme-border)' }}>
                    <nav className="flex flex-wrap gap-2">
                        {navigationItems.map(item => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="px-3 py-1.5 text-sm rounded-lg transition-all duration-200"
                                style={{ color: 'var(--theme-text-secondary)' }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                onMouseEnter={(e) => {
                                    const el = e.currentTarget as HTMLAnchorElement;
                                    el.style.color = 'var(--theme-accent)';
                                    el.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    const el = e.currentTarget as HTMLAnchorElement;
                                    el.style.color = 'var(--theme-text-secondary)';
                                    el.style.backgroundColor = 'transparent';
                                }}
                            >
                                {item.name}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default PortfolioNavBar