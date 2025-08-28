'use client'
import * as React from 'react'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import { Portfolio } from '@/types/portfolio'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

import {
  fadeUpVariants,
  staggerContainerVariants,
  scaleUpVariants,
  fadeVariants,
  slideLeftVariants,
  slideRightVariants,
  defaultViewport,
  cardHover,
  createStaggerContainer,
  createSlideVariant,
  timelineStaggerVariants,
  timelineDotVariants,
  connectorVariants
} from '@/lib/animations'


interface TopProjectsTimelineProps {
  portfolio: Portfolio | null | undefined
  username?: string
}

const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

const TopProjectsPage: React.FC<TopProjectsTimelineProps> = ({ portfolio, username }) => {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!portfolio) {
    return (
      <section className="py-8" style={{
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
      } as React.CSSProperties}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-gray-500">
            <p>Portfolio data not available</p>
          </div>
        </div>
      </section>
    )
  }

 const topProjects = (portfolio.projects || [])
  .filter((p) => p.top)
  .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());


  if (topProjects.length === 0) {
    return (
      <section className="py-8" style={{
        '--theme-bg': '#0a0f1a',
        '--theme-card': '#1a1f2e',
        '--theme-card-hover': '#242938',
        '--theme-border': '#0a0f1a',
        '--theme-text-primary': '#e2e8f0',
        '--theme-text-secondary': '#94a3b8',
        '--theme-text-muted': '#64748b',
        '--theme-accent': '#3b82f6',
        '--theme-accent-hover': '#2563eb'
      } as React.CSSProperties}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className={`font-geisSans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-purple-500`}>
            Top Projects
          </h2>
          <p className="mb-4 text-sm md:text-base" style={{ color: 'var(--theme-text-secondary)' }}>My most significant and impactful work</p>

          <div className="py-12" style={{ color: 'var(--theme-text-muted)' }}>
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-sm md:text-base">No top projects added yet</p>
          </div>
        </div>
      </section>
    )
  }

  // Mobile layout - stack everything vertically
  if (isMobile) {
    return (
      <motion.section
        className="py-8"
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
        variants={fadeVariants}
        initial="hidden"
        whileInView="show"
        viewport={defaultViewport}
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-8"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={defaultViewport}
          >
            <motion.h2
              className={`font-geisSans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-purple-500`}
              variants={fadeUpVariants}
            >
              Top Projects
            </motion.h2>
            <motion.p
              className="text-base mb-4"
              style={{ color: 'var(--theme-text-secondary)' }}
              variants={fadeUpVariants}
            >
              My most significant and impactful work
            </motion.p>

            {username && (
              <motion.div variants={fadeUpVariants}>
                <Link
                  href={`/public-portfolio/${username}/projects`}
                  className="inline-flex items-center gap-2 font-medium transition-colors duration-200 text-sm"
                  style={{ color: 'var(--theme-accent)' }}
                >
                  <motion.span
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex items-center gap-2"
                  >
                    See All Projects
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.span>
                </Link>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            className="space-y-6"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={defaultViewport}
          >
            {topProjects.map((project, idx) => {
              const videoId = project.videoLink ? getYouTubeId(project.videoLink) : null
              const mediaVariants = idx % 2 === 0 ? slideLeftVariants : slideRightVariants
              const cardVariants = idx % 2 === 0 ? slideRightVariants : slideLeftVariants
              return (
                <motion.div
                  key={idx}
                  className="rounded-lg p-4 shadow-lg transition-all duration-300 hover:shadow-xl border"
                  style={{
                    backgroundColor: 'var(--theme-card)',
                    borderColor: 'var(--theme-border)'
                  }}
                  variants={cardVariants}
                  whileHover={cardHover}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--theme-card-hover)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--theme-card)'
                  }}
                >
                  {/* Mobile: Video/Image first */}
                  <motion.div className="mb-4" variants={mediaVariants}>
                    {videoId ? (
                      <div
                        className="aspect-video w-full rounded-lg overflow-hidden shadow-lg"
                        style={{
                          backgroundColor: 'var(--theme-card)',
                          border: '1px solid var(--theme-border)'
                        }}
                      >
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={project.name}
                          frameBorder="0"
                          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                      </div>
                    ) : project.thumbnail ? (
                      <div
                        className="aspect-video w-full rounded-lg overflow-hidden shadow-lg"
                        style={{
                          backgroundColor: 'var(--theme-card)',
                          border: '1px solid var(--theme-border)'
                        }}
                      >
                        <Image
                          src={project.thumbnail}
                          alt={project.name}
                          width={1920}
                          height={1080}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="aspect-video w-full rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: 'var(--theme-card)',
                          border: '1px solid var(--theme-border)'
                        }}
                      >
                        <div className="text-center">
                          <motion.svg
                            className="w-12 h-12 mx-auto mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: 'var(--theme-text-muted)' }}
                            variants={scaleUpVariants}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </motion.svg>
                          <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>No preview</p>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Mobile: Project Info */}
                  <motion.div variants={fadeUpVariants}>
                    <motion.h3
                      className="font-bold text-lg mb-2"
                      style={{ color: 'var(--theme-text-primary)' }}
                      variants={fadeUpVariants}
                    >
                      {project.name}
                    </motion.h3>

                    {/* Date Range */}
                    {(project.startDate || project.endDate) && (
                      <motion.div className="flex items-center gap-2 mb-3" variants={fadeUpVariants}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--theme-text-muted)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium" style={{ color: 'var(--theme-text-muted)' }}>
                          {project.startDate && new Date(project.startDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short'
                          })}
                          {project.startDate && ' - '}
                          {project.endDate ? new Date(project.endDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short'
                          }) : (project.startDate ? 'Present' : '')}
                        </span>
                      </motion.div>
                    )}

                    <motion.p
                      className="text-sm leading-relaxed mb-4 line-clamp-3"
                      style={{ color: 'var(--theme-text-secondary)' }}
                      variants={fadeUpVariants}
                    >
                      {project.description}
                    </motion.p>

                    {/* Skills Used */}
                    {project.skills && project.skills.length > 0 && (
                      <motion.div className="mb-4" variants={fadeUpVariants}>
                        <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--theme-text-secondary)' }}>Technologies Used</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.skills.map((skill: any, skillIdx: number) => (
                            <span
                              key={skillIdx}
                              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium bg-white/90 border border-gray-600/50 text-black"
                            >
                              {skill.logo && (
                                <Image
                                  width={12}
                                  height={12}
                                  src={skill.logo}
                                  alt={skill.name}
                                  className="rounded"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              )}
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <motion.div className="flex flex-wrap gap-3" variants={fadeUpVariants}>
                      {project.liveLink && (
                        <Link
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200 hover:opacity-80 hover:underline"
                          style={{ color: 'var(--theme-accent)' }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Live Demo
                        </Link>
                      )}
                      {project.githubLink && (
                        <Link
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200 hover:opacity-80 hover:underline"
                          style={{ color: 'var(--theme-text-secondary)' }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          GitHub
                        </Link>
                      )}
                    </motion.div>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </motion.section>
    )
  }

  // Desktop layout - keep original timeline
  return (
    <motion.section
      className="py-8"
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
      variants={fadeVariants}
      initial="hidden"
      whileInView="show"
      viewport={defaultViewport}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Animated Header Section */}
        <motion.div
          className="text-center mb-12"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={defaultViewport}
        >
          <motion.h2
            className={`font-geisSans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-purple-500`}
            variants={fadeUpVariants}
          >
            Top Projects
          </motion.h2>

          <motion.p
            className="text-lg mb-4"
            style={{ color: 'var(--theme-text-secondary)' }}
            variants={fadeUpVariants}
          >
            My most significant and impactful work
          </motion.p>

          {username && (
            <motion.div variants={fadeUpVariants}>
              <Link
                href={`/public-portfolio/${username}/projects`}
                className="inline-flex items-center gap-2 font-medium transition-colors duration-200"
                style={{ color: 'var(--theme-accent)' }}
              >
                <motion.span
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex items-center gap-2"
                >
                  See All Projects
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.span>
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Animated Timeline */}
        <motion.div
          variants={timelineStaggerVariants}
          initial="hidden"
          whileInView="show"
          viewport={defaultViewport}
        >
          <Timeline
            position="alternate"
            sx={{
              '& .MuiTimelineItem-root': {
                '&:before': {
                  content: 'none',
                },
              },
              '& .MuiTimelineConnector-root': {
                backgroundColor: 'var(--theme-accent)',
                width: '1px',
                borderRadius: '999px',
                opacity: 1,
                zIndex: 4,
              },
              '& .MuiTimelineDot-root': {
                backgroundColor: 'var(--theme-accent)',
                border: '3px solid var(--theme-card)',
                boxShadow: '0 0 0 4px var(--theme-accent-hover)',
                width: '20px',
                height: '20px',
              },
              '& .MuiTimelineContent-root': {
                padding: '16px 20px',
              },
              '& .MuiTimelineOppositeContent-root': {
                padding: '16px 20px',
              },
            }}
          >
            {topProjects.map((project, idx) => {
              const videoId = project.videoLink ? getYouTubeId(project.videoLink) : null
              const isEven = idx % 2 === 0

              // Alternating slide animations based on position
              const mediaVariants = isEven ? slideLeftVariants : slideRightVariants
              const contentVariants = isEven ? slideRightVariants : slideLeftVariants

              return (
                <TimelineItem key={idx} sx={{ minHeight: '140px' }}>
                  {/* LEFT: YouTube preview or thumbnail */}
                  <TimelineOppositeContent sx={{ flex: 1 }}>
                    <motion.div
                      variants={mediaVariants}
                      initial="hidden"
                      whileInView="show"
                      viewport={defaultViewport}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {videoId ? (
                        <div
                          className="aspect-video w-full rounded-lg overflow-hidden shadow-lg transition-transform duration-300"
                          style={{
                            backgroundColor: 'var(--theme-card)',
                            border: '1px solid var(--theme-border)'
                          }}
                        >
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={project.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        </div>
                      ) : project.thumbnail ? (
                        <div
                          className="aspect-video w-full rounded-lg overflow-hidden shadow-lg transition-transform duration-300"
                          style={{
                            backgroundColor: 'var(--theme-card)',
                            border: '1px solid var(--theme-border)'
                          }}
                        >
                          <Image
                            src={project.thumbnail}
                            alt={project.name}
                            width={1920}
                            height={1080}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className="aspect-video w-full rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: 'var(--theme-card)',
                            border: '1px solid var(--theme-border)'
                          }}
                        >
                          <div className="text-center">
                            <motion.svg
                              className="w-12 h-12 mx-auto mb-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              style={{ color: 'var(--theme-text-muted)' }}
                              variants={scaleUpVariants}
                              initial="hidden"
                              whileInView="show"
                              viewport={defaultViewport}
                              transition={{ delay: 0.2 }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </motion.svg>
                            <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>No preview</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </TimelineOppositeContent>

                  {/* TIMELINE SEPARATOR */}
                  <TimelineSeparator>
                    <motion.div
                      variants={timelineDotVariants}
                      initial="hidden"
                      whileInView="show"
                      viewport={defaultViewport}
                    >
                      <TimelineDot sx={{
                        bgcolor: idx === 0 ? '#3b82f6' : '#6366f1',
                        width: 16,
                        height: 16,
                        border: '3px solid rgba(59, 130, 246, 0.3)',
                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                      }} />
                    </motion.div>
                    {idx < topProjects.length - 1 && (
                      
                        <TimelineConnector sx={{
                          backgroundColor: 'var(--theme-accent)',
                          borderRadius: '999px',
                          opacity: 1,
                          boxShadow: '0 0 0 2px var(--theme-accent-hover)',
                        }} />
                    )}
                  </TimelineSeparator>

                  {/* RIGHT: Project Info */}
                  <TimelineContent sx={{ flex: 1 }}>
                    <motion.div
                      className="rounded-lg p-6 shadow-lg transition-all duration-300 border"
                      style={{
                        backgroundColor: 'var(--theme-card)',
                        borderColor: 'var(--theme-border)'
                      }}
                      variants={contentVariants}
                      initial="hidden"
                      whileInView="show"
                      viewport={defaultViewport}
                      whileHover={cardHover}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--theme-card-hover)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--theme-card)'
                      }}
                    >
                      <motion.h3
                        className="font-bold text-xl mb-3"
                        style={{ color: 'var(--theme-text-primary)' }}
                        variants={fadeUpVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={defaultViewport}
                        transition={{ delay: 0.1 }}
                      >
                        {project.name}
                      </motion.h3>

                      {/* Date Range */}
                      {(project.startDate || project.endDate) && (
                        <motion.div
                          className={`flex gap-2 mb-3 ${isEven ? 'justify-start' : 'justify-end'}`}
                          variants={fadeUpVariants}
                          initial="hidden"
                          whileInView="show"
                          viewport={defaultViewport}
                          transition={{ delay: 0.2 }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--theme-text-muted)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-medium" style={{ color: 'var(--theme-text-muted)' }}>
                            {project.startDate && new Date(project.startDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short'
                            })}
                            {project.startDate && ' - '}
                            {project.endDate ? new Date(project.endDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short'
                            }) : (project.startDate ? 'Present' : '')}
                          </span>
                        </motion.div>
                      )}

                      <motion.p
                        className="text-sm leading-relaxed mb-4 line-clamp-3"
                        style={{ color: 'var(--theme-text-secondary)' }}
                        variants={fadeUpVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={defaultViewport}
                        transition={{ delay: 0.3 }}
                      >
                        {project.description}
                      </motion.p>

                      {/* Skills Used */}
                      {project.skills && project.skills.length > 0 && (
                        <motion.div
                          className={`gap-2 mb-3 ${isEven ? 'justify-start' : 'justify-end'}`}
                          variants={fadeUpVariants}
                          initial="hidden"
                          whileInView="show"
                          viewport={defaultViewport}
                          transition={{ delay: 0.4 }}
                        >
                          <h4 className="font-semibold text-sm text-gray-300 mb-2">Technologies Used</h4>
                          <div className={`flex flex-wrap gap-2 mb-3 ${isEven ? 'justify-start' : 'justify-end'}`}>
                            {project.skills.map((skill: any, skillIdx: number) => (
                              <motion.span
                                key={skillIdx}
                                className="inline-flex items-center gap-2 rounded-lg px-3 py-1 text-xs font-medium bg-white/90 border border-gray-600/50 text-black-300"
                                variants={scaleUpVariants}
                                initial="hidden"
                                whileInView="show"
                                viewport={defaultViewport}
                                transition={{ delay: 0.5 + (skillIdx * 0.05) }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {skill.logo && (
                                  <Image
                                    width={16}
                                    height={16}
                                    src={skill.logo}
                                    alt={skill.name}
                                    className="rounded"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                    }}
                                  />
                                )}
                                {skill.name}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      <motion.div
                        className={`flex gap-2 mb-3 ${isEven ? 'justify-start' : 'justify-end'}`}
                        variants={fadeUpVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={defaultViewport}
                        transition={{ delay: 0.6 }}
                      >
                        {project.liveLink && (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <Link
                              href={project.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-medium transition-colors duration-200 hover:opacity-80 hover:underline"
                              style={{ color: 'var(--theme-accent)' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Live Demo
                            </Link>
                          </motion.div>
                        )}
                        {project.githubLink && (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <Link
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-medium transition-colors duration-200 hover:opacity-80 hover:underline"
                              style={{ color: 'var(--theme-text-secondary)' }}
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                              </svg>
                              GitHub
                            </Link>
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.div>
                  </TimelineContent>
                </TimelineItem>
              )
            })}
          </Timeline>
        </motion.div>
      </div>
    </motion.section>
  )
}


export default TopProjectsPage