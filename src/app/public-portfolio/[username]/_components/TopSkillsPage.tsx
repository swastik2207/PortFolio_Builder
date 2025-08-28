import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Portfolio, Skill } from '@/types/portfolio'
import SkillSphere from '@/components/SkillSphere'

// Import from centralized animation system
import {
  fadeUpVariants,
  staggerContainerVariants,
  scaleUpVariants,
  fadeVariants,
  defaultViewport,
  cardHover,
  createStaggerContainer
} from '@/lib/animations'

interface MongoNumber {
  $numberInt: string
}

interface ExtendedSkill extends Omit<Skill, 'confidence'> {
  confidence: number | MongoNumber
}

interface TopSkillsPageProps {
  portfolio: Portfolio | null | undefined
  username?: string
}

const TopSkillsPage: React.FC<TopSkillsPageProps> = ({ portfolio, username }) => {
  // Custom stagger container for skills grid
  const skillsStaggerVariants = createStaggerContainer(0.08, 0.3)

  if (!portfolio) {
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
          '--theme-accent-hover': '#2563eb',
          backgroundColor: 'var(--theme-bg)'
        } as React.CSSProperties}
        variants={fadeVariants}
        initial="hidden"
        animate="show"
      >
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div 
            className="text-gray-500"
            variants={fadeUpVariants}
          >
            <p>Portfolio data not available</p>
          </motion.div>
        </div>
      </motion.section>
    )
  }

  const skills = (portfolio.skills as ExtendedSkill[]) || []
  const topSkills = skills.filter(skill => skill.top)

  if (skills.length === 0) {
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
          '--theme-accent-hover': '#2563eb',
          backgroundColor: 'var(--theme-bg)'
        } as React.CSSProperties}
        variants={fadeVariants}
        initial="hidden"
        animate="show"
      >
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h2 
            className={`font-geistSans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-purple-500`}
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="show"
            viewport={defaultViewport}
          >
            Top Skills
          </motion.h2>

          <motion.p 
            className="mb-4" 
            style={{ color: 'var(--theme-text-secondary)' }}
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="show"
            viewport={defaultViewport}
            transition={{ delay: 0.2 }}
          >
            My most proficient and frequently used technologies
          </motion.p>

          <motion.div 
            className="py-12" 
            style={{ color: 'var(--theme-text-muted)' }}
            variants={scaleUpVariants}
            initial="hidden"
            whileInView="show"
            viewport={defaultViewport}
            transition={{ delay: 0.4 }}
          >
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p>No skills added yet</p>
          </motion.div>
        </div>
      </motion.section>
    )
  }

  const sortedTopSkills = topSkills.sort((a, b) => {
    const confidenceA = typeof a.confidence === 'object' ? parseInt(a.confidence.$numberInt) : a.confidence
    const confidenceB = typeof b.confidence === 'object' ? parseInt(b.confidence.$numberInt) : b.confidence
    return confidenceB - confidenceA
  })

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
            Top Skills
          </motion.h2>

          <motion.p 
            className="mb-4" 
            style={{ color: 'var(--theme-text-secondary)' }}
            variants={fadeUpVariants}
          >
            My most proficient and frequently used technologies
          </motion.p>

          {username && (
            <motion.div variants={fadeUpVariants}>
              <Link
                href={`/public-portfolio/${username}/skills`}
                className="inline-flex items-center gap-2 font-medium transition-colors duration-200"
                style={{ color: 'var(--theme-accent)' }}
              >
                <motion.span
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex items-center gap-2"
                >
                  See All Skills
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.span>
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Animated Skills Grid */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={skillsStaggerVariants}
          initial="hidden"
          whileInView="show"
          viewport={defaultViewport}
        >
          {sortedTopSkills.map((skill, index) => {
            const confidenceValue = typeof skill.confidence === 'object' ? parseInt(skill.confidence.$numberInt) : skill.confidence

            return (
              <motion.div
                key={skill.name}
                variants={scaleUpVariants}
                whileHover={cardHover}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <SkillSphere
                  name={skill.name}
                  logo={skill.logo}
                  confidence={confidenceValue}
                />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Animated Empty State */}
        {sortedTopSkills.length === 0 && (
          <motion.div 
            className="text-center py-12"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="show"
            viewport={defaultViewport}
          >
            <motion.div 
              className="text-gray-400 mb-4"
              variants={scaleUpVariants}
              initial="hidden"
              whileInView="show"
              viewport={defaultViewport}
              transition={{ delay: 0.2 }}
            >
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </motion.div>
            
            <motion.p 
              className="text-gray-500"
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="show"
              viewport={defaultViewport}
              transition={{ delay: 0.4 }}
            >
              No top skills marked yet
            </motion.p>
            
            {username && (
              <motion.div
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="show"
                viewport={defaultViewport}
                transition={{ delay: 0.6 }}
              >
                <Link
                  href={`/public-portfolio/${username}/skills`}
                  className="inline-block mt-2"
                  style={{ color: 'var(--theme-accent)' }}
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    View all skills
                  </motion.span>
                </Link>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}

export default TopSkillsPage