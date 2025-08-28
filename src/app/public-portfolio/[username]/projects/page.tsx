'use client'

import React, { useEffect, useState } from 'react'
import { Portfolio, Project } from '@/types/portfolio'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { MoveLeft, Play, Github, ExternalLink, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const ProjectsPage: React.FC = () => {
  const { username } = useParams()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)

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

  // Function to extract YouTube video ID from URL
  const getYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  // Utility to format date for display
  const formatDate = (date: string | Date): string => {
    if (!date) return ''
    if (typeof date === 'string') return date
    if (date instanceof Date) return date.toISOString().slice(0, 7)
    return String(date)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
  if (error || !portfolio) return <div className="min-h-screen flex items-center justify-center text-red-400">{error || 'No portfolio found'}</div>

  const projects = portfolio.projects || []
  if (projects.length === 0) return <section className="py-8 bg-gray-900 min-h-screen text-center text-gray-400">No projects added yet</section>

  const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
    const videoId = project.videoLink ? getYouTubeId(project.videoLink) : null
    const isPlaying = playingVideo === `${index}-${project.name}`

    return (
      <Card className="bg-gray-800/60 border-gray-700/50 backdrop-blur hover:bg-gray-800/80 transition-all duration-300 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col">
            {/* Image Section */}
            <div className="relative">
              {isPlaying && videoId ? (
                <div className="relative w-full h-56">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                    title={`${project.name} - Video Demo`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute inset-0"
                  />
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      onClick={() => setPlayingVideo(null)}
                      className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-colors duration-200"
                      title="Close video"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-56 group">
                  <Image
                    src={project.thumbnail}
                    alt={project.name}
                    width={1920}
                    height={1080}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Play Button Overlay */}
                  {videoId && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => setPlayingVideo(`${index}-${project.name}`)}
                        className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200"
                        title="Play video demo"
                      >
                        <Play className="w-6 h-6" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                  {project.name}
                </h3>
              </div>

              <p className="text-gray-300 mb-4 leading-relaxed text-sm">
                {project.description}
              </p>

              {/* Project Duration */}
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                {formatDate(project.startDate)} - {project.endDate === 'PRESENT' ? 'Present' : formatDate(project.endDate)}
              </div>

              {/* Skills Used */}
              {project.skills && project.skills.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-300 mb-2">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill: any, skillIdx: number) => (
                      <span
                        key={skillIdx}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium bg-gray-700/50 border border-gray-600/50 text-gray-300"
                      >
                        {skill.logo && (
                          <Image
                            src={skill.logo}
                            alt={skill.name}
                            width={16}
                            height={16}
                            className="w-4 h-4 rounded"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        )}
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Contributions */}
              {project.contributions && (
                <div className="mb-6">
                  <h4 className="font-semibold text-sm text-gray-300 mb-2">Key Contributions</h4>
                  <ul className="space-y-1">
                    {project.contributions.split('\n').filter(Boolean).map((contribution, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-blue-500"></span>
                        <span>{contribution.replace(/^•\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Links */}
              <div className="flex flex-wrap gap-3">
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-black to-gray-900 text-white">
      <section className="relative py-12 px-4 max-w-7xl mx-auto">
        <h1 className="text-4xl py-2 md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          {portfolio.fullName}'s Projects
        </h1>
        <p className="text-center text-xl text-gray-300 my-12">Explore my portfolio of creative work and technical projects</p>

        {/* Projects Summary */}
        <div className="my-12 bg-gray-800/40 backdrop-blur border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-200">Projects Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400">{projects.length}</div>
              <div className="text-sm text-gray-400">Total Projects</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">
                {projects.filter(p => p.liveLink).length}
              </div>
              <div className="text-sm text-gray-400">Live Demos</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-400">
                {projects.filter(p => p.githubLink).length}
              </div>
              <div className="text-sm text-gray-400">Open Source</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-400">
                {projects.filter(p => p.videoLink && getYouTubeId(p.videoLink)).length}
              </div>
              <div className="text-sm text-gray-400">Video Demos</div>
            </div>
          </div>
        </div>

        {/* Projects Grid - 2 columns on desktop, 1 column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, idx) => (
            <ProjectCard key={idx} project={project} index={idx} />
          ))}
        </div>

        <Link href={`/public-portfolio/${username}`} className="fixed bottom-8 right-8 inline-block bg-gray-950 text-white px-6 py-2 rounded-full border border-gray-600 shadow hover:bg-black hover:border-white transition">
          <div className="flex items-center gap-2">
            <MoveLeft /> Back to Home
          </div>
        </Link>
      </section>
    </div>
  )
}

export default ProjectsPage