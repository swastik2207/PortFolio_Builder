import React from 'react'
import { Portfolio } from '@/types/portfolio'
import MatterFollower from '@/components/MatterFollower'
import Link from 'next/link'
import Image from 'next/image'

interface PersonalInfoPageProps {
    portfolio: Portfolio
}

const PersonalInfoPage: React.FC<PersonalInfoPageProps> = ({ portfolio }) => {
    return (
        <section className="relative flex items-center justify-center min-h-[80vh] sm:min-h-screen bg-gray-900 text-white px-2 sm:px-4 md:px-8 overflow-hidden pointer-events-none">
            <MatterFollower />
            {/* <DarkParticleFollower /> */}
            <div className="relative w-full max-w-6xl flex flex-col md:flex-row gap-8 md:gap-16 items-center text-center md:text-left py-16 md:py-24">
                {/* Only render the image if profilePicUrl is truthy */}
                {portfolio.profilePicUrl && (
                    <Image
                        src={portfolio.profilePicUrl}
                        alt={portfolio.fullName || portfolio.username}
                        width={200}
                        height={200}
                        className="w-60 h-60 sm:w-60 sm:h-60 md:w-80 md:h-80 rounded-lg object-cover border-4 border-primary shadow-lg mb-4 md:mb-0"
                    />
                )}
                <div className="w-full">
                    <h1 className="text-2xl sm:text-3xl font-bold sm:mb-4">
                        Hi, I&apos;m
                    </h1>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold leading-tight py-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {portfolio.fullName}
                    </h1>

                    <p className="text-white font-semibold mb-2 sm:mb-4 text-base sm:text-lg break-words">{portfolio.bio}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3 mb-2 sm:mb-4">
                        <span className="bg-gray-800/70 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium text-gray-200 shadow-sm">
                            {portfolio.city}{portfolio.city && portfolio.state ? ',' : ''} {portfolio.state}{portfolio.state && portfolio.country ? ',' : ''} {portfolio.country}
                        </span>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-4 mt-2 pointer-events-auto">
                        {(portfolio.socialLinks || []).map(link => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 bg-gray-700/50 hover:bg-gray-600/80 rounded-lg transition-all duration-200 text-gray-200 hover:text-white shadow-sm text-xs sm:text-sm"
                            >
                                <Image src={link.logo} alt={link.name} width={16} height={16} className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="font-medium">{link.name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
            <Link
                href="#skills"
                className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-950 text-white px-4 py-2 rounded-full border border-gray-600 shadow-lg hover:bg-black hover:border-white hover:-translate-y-1 transition-all duration-300 pointer-events-auto hidden md:block"
                style={{ textDecoration: 'none' }}
            >
                Click to Scroll
            </Link>

            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 pointer-events-auto hidden md:block">
                <div className="bg-gray-400 w-px h-16"></div>
            </div>

        </section>
    )
}

export default PersonalInfoPage
