'use client'

import React, { useEffect, useState } from 'react'
import { Portfolio, Skill } from '@/types/portfolio'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { MoveLeft } from 'lucide-react'

interface MongoNumber {
  $numberInt: string
}

interface ExtendedSkill extends Omit<Skill, 'confidence'> {
  confidence: number | MongoNumber
}

const SkillsPage: React.FC = () => {
  const { username } = useParams()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPortfolio = async () => {
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

    if (username) fetchPortfolio()
  }, [username])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
  if (error || !portfolio) return <div className="min-h-screen flex items-center justify-center text-red-400">{error || 'No portfolio found'}</div>

  const skills = (portfolio.skills as ExtendedSkill[]) || []
  if (skills.length === 0) return <section className="py-8 bg-gray-900 min-h-screen text-center text-gray-400">No skills added yet</section>

  const skillsByType = skills.reduce((acc, skill) => {
    if (!acc[skill.type]) acc[skill.type] = []
    acc[skill.type].push(skill)
    return acc
  }, {} as Record<string, ExtendedSkill[]>)

  Object.keys(skillsByType).forEach(type => {
    skillsByType[type].sort((a, b) => {
      const getVal = (conf: any) => typeof conf === 'object' ? parseInt(conf.$numberInt) : conf
      return getVal(b.confidence) - getVal(a.confidence)
    })
  })

  const getConfidenceValue = (confidence: number | MongoNumber) => typeof confidence === 'object' ? parseInt(confidence.$numberInt) : confidence
  const getConfidenceLevel = (confidence: number | MongoNumber): string => {
    const value = getConfidenceValue(confidence)
    if (value >= 80) return 'Expert'
    if (value >= 60) return 'Proficient'
    if (value >= 40) return 'Intermediate'
    return 'Beginner'
  }
  const getConfidenceColor = (confidence: number | MongoNumber) => {
    const value = getConfidenceValue(confidence)
    if (value >= 80) return { bg: 'rgba(16, 185, 129, 0.2)', border: 'rgba(16, 185, 129, 0.4)', text: '#10b981', progress: '#10b981' }
    if (value >= 60) return { bg: 'rgba(59, 130, 246, 0.2)', border: 'rgba(59, 130, 246, 0.4)', text: '#3b82f6', progress: '#3b82f6' }
    if (value >= 40) return { bg: 'rgba(192, 132, 252, 0.2)', border: 'rgba(192, 132, 252, 0.4)', text: '#c084fc', progress: '#c084fc' }
    return { bg: 'rgba(156, 163, 175, 0.2)', border: 'rgba(156, 163, 175, 0.4)', text: '#faedf3', progress: '#faedf3' }
  }

  const typeOrder = ['Programming Language', 'Framework', 'Database', 'Cloud Platform', 'DevOps']
  const sortedTypes = Object.keys(skillsByType).sort((a, b) => {
    const indexA = typeOrder.indexOf(a), indexB = typeOrder.indexOf(b)
    return indexA === -1 ? 1 : indexB === -1 ? -1 : indexA - indexB
  })

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-black to-gray-900 text-white">
      <section className="relative py-12 px-4 max-w-7xl mx-auto">
        <h1 className="text-4xl py-2 md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          {portfolio.fullName}'s Skills
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">Explore my technical expertise and proficiency levels</p>
        {sortedTypes.map(type => (
          <div key={type} className="mb-10">
            <h2 className="text-2xl font-bold mb-4">{type}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillsByType[type].map(skill => {
                const value = getConfidenceValue(skill.confidence)
                const colors = getConfidenceColor(skill.confidence)
                return (
                  <div key={skill.name} className="p-4 rounded-xl border backdrop-blur bg-gray-800/60 hover:scale-105 transition">
                    <div className="flex gap-4 items-center mb-3">
                      {skill.logo ? (
                        <Image src={skill.logo} alt={skill.name} width={32} height={32} className="rounded" />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full" />
                      )}
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold">{skill.name}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>{getConfidenceLevel(skill.confidence)}</span>
                      </div>
                    </div>
                    {skill.description && <p className="text-gray-300 text-sm mb-2">{skill.description}</p>}
                    <div className="text-sm text-gray-400 mb-1">Confidence: {value}%</div>
                    <div className="w-full bg-gray-700/40 h-2 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${value}%`, background: `linear-gradient(to right, ${colors.progress}, ${colors.progress}80)` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
        <Link href={`/public-portfolio/${username}`} className="fixed bottom-8 right-8 inline-block bg-gray-950 text-white px-6 py-2 rounded-full border border-gray-600 shadow hover:bg-black hover:border-white transition">
          <div className="flex items-center gap-2">
            <MoveLeft /> Back to Home
          </div>
        </Link>
      </section>
    </div>
  )
}

export default SkillsPage
