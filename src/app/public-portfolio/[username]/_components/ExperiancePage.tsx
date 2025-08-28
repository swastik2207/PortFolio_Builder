'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { staggerContainerVariants, fadeUpVariants } from '@/lib/animations'
import { Portfolio } from '@/types/portfolio'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineOppositeContent, {
    timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent'
import { Briefcase, ExternalLink, MapPin, Calendar, User, Building } from 'lucide-react'
import Image from 'next/image'

interface ExperiencePageProps {
    portfolio: Portfolio
    username?: string
}

function formatDate(date: string | Date | null): string {
    if (!date) return 'PRESENT'
    if (typeof date === 'string') return date
    return new Date(date).toISOString().slice(0, 7)
}

function formatDisplayDate(date: string | Date | null): string {
    if (!date) return 'Present'
    if (typeof date === 'string') {
        // If it's already a formatted string, return as is
        if (date === 'PRESENT') return 'Present'
        // Try to parse if it's a date string
        const parsed = new Date(date)
        if (!isNaN(parsed.getTime())) {
            return parsed.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short'
            })
        }
        return date
    }
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
    })
}

const ExperienceCard: React.FC<{ exp: any; idx: number }> = ({ exp, idx }) => (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-blue-500/50 group mb-6">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
                <div className="bg-white rounded-full mr-3 w-12 h-12 flex items-center justify-center border border-blue-400/40 overflow-hidden">
                    {exp.companyLogoUrl ? (
                        <Image
                            src={exp.companyLogoUrl}
                            alt={exp.companyName}
                            width={48}
                            height={48}
                            className="object-contain"
                        />
                    ) : (
                        <span className="text-xs text-gray-400">No Logo</span>
                    )}
                </div>

                <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                        {exp.companyName}
                    </h3>
                    <div className="flex items-center text-gray-300 mt-1">
                        <Building className="w-4 h-4 mr-1" />
                        <span className="font-medium">{exp.title}</span>
                    </div>
                </div>
            </div>
            {exp.companyWebsite && (
                <a
                    href={exp.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors p-2 hover:bg-blue-500/20 rounded-lg"
                    title="Visit Company Website"
                >
                    <ExternalLink className="w-4 h-4" />
                </a>
            )}
        </div>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-3 mt-4">
            {exp.employeeType && (
                <div className="flex items-center text-sm text-gray-400">
                    <User className="w-4 h-4 mr-2 text-green-400" />
                    <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs">
                        {exp.employeeType}
                    </span>
                </div>
            )}
            {exp.locationType && (
                <div className="flex items-center text-sm text-gray-400">
                    <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                    <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs">
                        {exp.locationType}
                    </span>
                </div>
            )}
            {exp.location && (
                <div className="flex items-center text-sm text-gray-400">
                    <MapPin className="w-4 h-4 mr-2 text-orange-400" />
                    <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full text-xs">
                        {exp.location}
                    </span>
                </div>
            )}
        </div>

        {/* Duration Section for Mobile */}
        <div className="flex justify-between shadow-lg mt-4">
            <div className="flex items-center justify-center mb-2">
                <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">Duration</span>
            </div>
            <div className="text-center">
                <span className="text-white font-semibold">
                    {formatDisplayDate(exp.startDate)}
                </span>
                <span className="text-gray-300 text-sm mx-2">to</span>
                <span className="text-white font-semibold">
                    {exp.endDate === 'PRESENT' || !exp.endDate ? 'Present' : formatDisplayDate(exp.endDate)}
                </span>
            </div>
        </div>
    </div>
)

const ExperiencePage: React.FC<ExperiencePageProps> = ({ portfolio }) => {
    const sortedExperiences = [...(portfolio.experiences || [])].sort((a, b) => {
        const dateA = new Date(a.startDate ?? '').getTime()
        const dateB = new Date(b.startDate ?? '').getTime()
        return dateB - dateA
    })

    return (
        <section className="py-8 text-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className={`font-geisSans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-purple-500`}>
                        Experiences
                    </h2>
                    <p className="text-gray-400 text-lg">
                        A timeline of my professional experiences and career growth
                    </p>
                </div>

                {/* Mobile View - Card Layout */}
                <motion.div
                    className="block md:hidden"
                    variants={staggerContainerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {sortedExperiences.map((exp, idx) => (
                        <motion.div
                            key={idx}
                            variants={fadeUpVariants}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <ExperienceCard exp={exp} idx={idx} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Desktop View - Timeline Layout */}
                <motion.div
                    className="hidden md:block"
                    variants={staggerContainerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <Timeline
                        sx={{
                            [`& .${timelineOppositeContentClasses.root}`]: {
                                flex: 0.3,
                                paddingLeft: 0,
                                paddingRight: '24px',
                            },
                            '& .MuiTimelineItem-root': {
                                '&:before': {
                                    flex: 0,
                                    padding: 0,
                                },
                            },
                        }}
                    >
                        {sortedExperiences.map((exp, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeUpVariants}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <TimelineItem>
                                    <TimelineOppositeContent>
                                        <div className="text-right">
                                            <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4 shadow-lg">
                                                <div className="flex items-center justify-end mb-2">
                                                    <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                                                    <span className="text-sm font-medium text-blue-300">Duration</span>
                                                </div>
                                                <div className="text-white font-semibold">
                                                    {formatDisplayDate(exp.startDate)}
                                                </div>
                                                <div className="text-gray-300 text-sm">to</div>
                                                <div className="text-white font-semibold">
                                                    {exp.endDate === 'PRESENT' || !exp.endDate ? 'Present' : formatDisplayDate(exp.endDate)}
                                                </div>
                                            </div>
                                        </div>
                                    </TimelineOppositeContent>

                                    <TimelineSeparator>
                                        <TimelineDot
                                            sx={{
                                                bgcolor: idx === 0 ? '#3b82f6' : '#6366f1',
                                                width: 16,
                                                height: 16,
                                                border: '3px solid rgba(59, 130, 246, 0.3)',
                                                boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                                            }}
                                        />
                                        {idx !== sortedExperiences.length - 1 && (
                                            <TimelineConnector
                                                sx={{
                                                    bgcolor: 'rgba(99, 102, 241, 0.3)',
                                                    width: 2,
                                                    minHeight: 60,
                                                }}
                                            />
                                        )}
                                    </TimelineSeparator>

                                    <TimelineContent>
                                        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-blue-500/50 group">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center">
                                                    <div className="bg-white rounded-full mr-3 w-12 h-12 flex items-center justify-center border border-blue-400/40 overflow-hidden">
                                                        {exp.companyLogoUrl ? (
                                                            <Image
                                                                src={exp.companyLogoUrl}
                                                                alt={exp.companyName}
                                                                width={48}
                                                                height={48}
                                                                className="object-contain"
                                                            />
                                                        ) : (
                                                            <span className="text-xs text-gray-400">No Logo</span>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                                                            {exp.companyName}
                                                        </h3>
                                                        <div className="flex items-center text-gray-300 mt-1">
                                                            <Building className="w-4 h-4 mr-1" />
                                                            <span className="font-medium">{exp.title}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {exp.companyWebsite && (
                                                    <a
                                                        href={exp.companyWebsite}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:text-blue-300 transition-colors p-2 hover:bg-blue-500/20 rounded-lg"
                                                        title="Visit Company Website"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                                                {exp.employeeType && (
                                                    <div className="flex items-center text-sm text-gray-400">
                                                        <User className="w-4 h-4 mr-2 text-green-400" />
                                                        <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs">
                                                            {exp.employeeType}
                                                        </span>
                                                    </div>
                                                )}
                                                {exp.locationType && (
                                                    <div className="flex items-center text-sm text-gray-400">
                                                        <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                                                        <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs">
                                                            {exp.locationType}
                                                        </span>
                                                    </div>
                                                )}
                                                {exp.location && (
                                                    <div className="flex items-center text-sm text-gray-400">
                                                        <MapPin className="w-4 h-4 mr-2 text-orange-400" />
                                                        <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full text-xs">
                                                            {exp.location}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </TimelineContent>
                                </TimelineItem>
                            </motion.div>
                        ))}
                    </Timeline>
                </motion.div>

                {/* Empty State */}
                {sortedExperiences.length === 0 && (
                    <div className="text-center py-12">
                        <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50">
                            <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                            <p className="text-gray-400 text-lg">No experiences added yet.</p>
                            <p className="text-gray-500 text-sm mt-2">
                                Your professional journey will appear here once you add your experiences.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default ExperiencePage