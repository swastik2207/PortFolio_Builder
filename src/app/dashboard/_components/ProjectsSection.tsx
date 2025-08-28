/*
 * CLOUDINARY SETUP REQUIRED:
 * 
 * Add these environment variables to your .env.local file:
 * NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
 * NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
 * 
 * To get these values:
 * 1. Create a free account at https://cloudinary.com
 * 2. Go to Dashboard to find your Cloud Name
 * 3. Go to Settings > Upload > Upload Presets to create an unsigned upload preset
 * 4. Make sure the upload preset is set to "Unsigned" mode
 */

'use client'

import React, { useState, useEffect, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Plus,
  Trash2,
  Upload,
  FolderOpen,
  Edit,
  Save,
  X,
  Calendar,
  ExternalLink,
  Github,
  Play,
  Image as ImageIcon,
  AlertCircle,
  Link,
  Code2,
  Users,
  Target,
  Star
} from 'lucide-react'

// Import types from your types file
import {
  Portfolio,
  Project,
  Skill,
  CloudinaryResponse,
  ProjectsSectionProps,
  ProjectSkill
} from '@/types/portfolio'
import Image from 'next/image'

function ProjectsSection({ portfolio, onUpdate }: ProjectsSectionProps) {
  const [formData, setFormData] = useState<{ projects: Project[] }>({
    projects: []
  })

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

  // Available skills from user's portfolio for the dropdown
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([])
  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillLogo, setCustomSkillLogo] = useState('');

  // Maximum number of top projects allowed
  const MAX_TOP_PROJECTS = 3

  useEffect(() => {
    if (portfolio) {
      const enhancedProjects = (portfolio.projects || []).map(project => {
        // Handle migration from string[] to ProjectSkill[]
        let projectSkills: ProjectSkill[] = []

        if (Array.isArray(project.skills)) {
          projectSkills = project.skills.map(skill => {
            // If it's already a ProjectSkill object, use it
            if (typeof skill === 'object' && skill.name && typeof skill.logo !== 'undefined') {
              return skill as ProjectSkill
            }
            // If it's a string (old format), convert it
            if (typeof skill === 'string') {
              const portfolioSkill = portfolio.skills?.find(s => s.name === skill)
              return {
                name: skill,
                logo: portfolioSkill?.logo || ''
              }
            }
            // Fallback
            return { name: String(skill), logo: '' }
          })
        }

        return {
          ...project,
          skills: projectSkills,
          contributions: project.contributions || '',
          top: project.top || false
        }
      })

      setFormData({
        projects: enhancedProjects
      })

      // Set available skills from portfolio
      setAvailableSkills(portfolio.skills || [])
    }
  }, [portfolio])

  // Auto-populate thumbnail with video thumbnail if videoLink is entered and thumbnail is empty
  useEffect(() => {
    if (!isEditing) return;
    formData.projects.forEach((project, idx) => {
      if (
        project.videoLink &&
        !project.thumbnail &&
        getVideoThumbnail(project.videoLink)
      ) {
        // Only update if thumbnail is empty and videoLink is valid
        updateProject(idx, 'thumbnail', getVideoThumbnail(project.videoLink) || '');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.projects, isEditing]);

  // Get count of top projects
  const topProjectsCount = formData.projects.filter(project => project.top).length

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }

    // Validate file size (max 5MB for project images)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB')
      return
    }

    setIsUploadingImage(true)
    setUploadingIndex(index)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '')
      formData.append('folder', 'portfolio/project-thumbnails')

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data: CloudinaryResponse = await response.json()

      // Update project thumbnail with the Cloudinary URL
      updateProject(index, 'thumbnail', data.secure_url)

    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setIsUploadingImage(false)
      setUploadingIndex(null)
      // Reset file input
      if (event.target) {
        event.target.value = ''
      }
    }
  }

  // 7. UPDATE: addProject function (ensure new projects have correct skill format)
  const addProject = (): void => {
    setFormData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          name: '',
          description: '',
          thumbnail: '',
          videoLink: '',
          startDate: '',
          endDate: '',
          liveLink: '',
          githubLink: '',
          skills: [], // This will now be ProjectSkill[] instead of string[]
          contributions: '',
          top: false
        }
      ]
    }))
  }

  const updateProject = (index: number, field: keyof Project, value: string | string[] | boolean | ProjectSkill[]): void => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === index ? { ...project, [field]: value } : project
      )
    }))
  }

  const removeProject = (index: number): void => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }))
  }

  const addSkillToProject = (projectIndex: number, skillName: string): void => {
    const project = formData.projects[projectIndex]
    const skillExists = project.skills.some(skill => skill.name === skillName)

    if (!skillExists) {
      const selectedSkill = availableSkills.find(s => s.name === skillName)
      const newSkill: ProjectSkill = {
        name: skillName,
        logo: selectedSkill?.logo || ''
      }
      // Fix: updateProject expects string | string[] | boolean, but ProjectSkill[] is needed for 'skills'.
      // Update the type of 'value' in updateProject to allow ProjectSkill[]
      updateProject(projectIndex, 'skills', [...project.skills, newSkill] as ProjectSkill[])
    }
  }

  const removeSkillFromProject = (projectIndex: number, skillName: string): void => {
    const project = formData.projects[projectIndex]
    updateProject(projectIndex, 'skills', project.skills.filter(skill => skill.name !== skillName) as ProjectSkill[])
  }

  const handleTopProjectToggle = (index: number, checked: boolean): void => {
    if (checked && topProjectsCount >= MAX_TOP_PROJECTS) {
      alert(`You can only select up to ${MAX_TOP_PROJECTS} top projects`)
      return
    }
    updateProject(index, 'top', checked)
  }

  const handleCurrentProjectToggle = (index: number, isCurrent: boolean): void => {
    updateProject(index, 'endDate', isCurrent ? 'PRESENT' : '')
  }

  const validateURL = (url: string): boolean => {
    if (!url.trim()) return true // Empty URLs are allowed
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const extractVideoId = (url: string): string | null => {
    if (!url) return null

    // YouTube video ID extraction
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(youtubeRegex)
    return match ? match[1] : null
  }

  const getVideoThumbnail = (videoLink: string): string | null => {
    const videoId = extractVideoId(videoLink)
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
  }

  const formatDate = (dateString: string): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate all projects
      for (let i = 0; i < formData.projects.length; i++) {
        const project = formData.projects[i]

        if (!project.name.trim()) {
          alert(`Project ${i + 1}: Name is required`)
          setIsSubmitting(false)
          return
        }

        if (!project.description.trim()) {
          alert(`Project ${i + 1}: Description is required`)
          setIsSubmitting(false)
          return
        }

        if (project.videoLink && !validateURL(project.videoLink)) {
          alert(`Project ${i + 1}: Invalid video URL`)
          setIsSubmitting(false)
          return
        }

        if (project.liveLink && !validateURL(project.liveLink)) {
          alert(`Project ${i + 1}: Invalid live link URL`)
          setIsSubmitting(false)
          return
        }

        if (project.githubLink && !validateURL(project.githubLink)) {
          alert(`Project ${i + 1}: Invalid GitHub URL`)
          setIsSubmitting(false)
          return
        }

        if (project.startDate && project.endDate && project.endDate !== '' && new Date(project.startDate) > new Date(project.endDate)) {
          alert(`Project ${i + 1}: Start date cannot be after end date`)
          setIsSubmitting(false)
          return
        }
      }

      // Filter out empty projects
      const filteredProjects = formData.projects
        .filter(project => project.name.trim() !== '')

      const updatedData: Partial<Portfolio> = {
        projects: filteredProjects
      }

      await onUpdate(updatedData)

      console.log('Projects updated successfully!')
      setIsEditing(false)

    } catch (error) {
      console.error('Error updating projects:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditToggle = (): void => {
    if (isEditing) {
      // If cancelling edit, reset form data to original portfolio data
      if (portfolio) {
        const enhancedProjects = (portfolio.projects || []).map(project => {
          // Handle migration from string[] to ProjectSkill[]
          let projectSkills: ProjectSkill[] = []

          if (Array.isArray(project.skills)) {
            projectSkills = project.skills.map(skill => {
              if (typeof skill === 'object' && skill.name) {
                return skill as ProjectSkill
              }
              if (typeof skill === 'string') {
                const portfolioSkill = portfolio.skills?.find(s => s.name === skill)
                return {
                  name: skill,
                  logo: portfolioSkill?.logo || ''
                }
              }
              return { name: String(skill), logo: '' }
            })
          }

          return {
            ...project,
            skills: projectSkills,
            contributions: project.contributions || '',
            top: project.top || false
          }
        })
        setFormData({
          projects: enhancedProjects
        })
      }
    }
    setIsEditing(!isEditing)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Projects & Portfolio
          </CardTitle>
          <Button
            type="button"
            variant={isEditing ? "outline" : "default"}
            size="sm"
            onClick={handleEditToggle}
            className="flex items-center gap-2"
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4" />
                Cancel
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                Edit
              </>
            )}
          </Button>
        </div>
        {topProjectsCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span>{topProjectsCount} of {MAX_TOP_PROJECTS} top projects selected</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Projects List */}
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Your Projects</Label>
              <p className="text-sm text-gray-600 mt-1">
                Showcase your best work, side projects, and contributions
              </p>
            </div>

            {/* Project Guidelines */}
            {isEditing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Project Guidelines</p>
                  <ul className="text-blue-700 mt-1 space-y-1">
                    <li>• Include your most impressive and relevant projects</li>
                    <li>• Mark your best projects as "Top Projects" (maximum {MAX_TOP_PROJECTS})</li>
                    <li>• Add clear descriptions highlighting your role and impact</li>
                    <li>• Select skills that were actually used in each project</li>
                    <li>• Provide live links and GitHub repositories when available</li>
                  </ul>
                </div>
              </div>
            )}

            {formData.projects.map((project, index) => (
              <Card key={index} className={`p-6 border-dashed border-2 ${project.top ? 'border-yellow-300 bg-yellow-50' : ''}`}>
                <div className="space-y-6">
                  {/* Top Project Toggle */}
                  {isEditing && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`top-project-${index}`}
                          checked={project.top || false}
                          onCheckedChange={(checked) => handleTopProjectToggle(index, checked as boolean)}
                          disabled={!project.top && topProjectsCount >= MAX_TOP_PROJECTS}
                        />
                        <Label htmlFor={`top-project-${index}`} className="text-sm font-normal">
                          Mark as top project
                        </Label>
                        {project.top && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      {!project.top && topProjectsCount >= MAX_TOP_PROJECTS && (
                        <p className="text-xs text-gray-500">
                          Maximum {MAX_TOP_PROJECTS} top projects allowed
                        </p>
                      )}
                    </div>
                  )}

                  {/* Display top project badge when not editing */}
                  {!isEditing && project.top && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Top Project
                      </span>
                    </div>
                  )}

                  {/* Project Header - Name and Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1 space-y-2">
                      <Label>Project Name *</Label>
                      <Input
                        type="text"
                        placeholder="My Awesome Project"
                        value={project.name}
                        onChange={(e) => updateProject(index, 'name', e.target.value)}
                        disabled={!isEditing}
                        className="font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Start Date
                      </Label>
                      <Input
                        type="month"
                        value={project.startDate}
                        onChange={(e) => updateProject(index, 'startDate', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        End Date
                      </Label>
                      <div className="space-y-2">
                        <Input
                          type="month"
                          value={project.endDate && project.endDate !== 'PRESENT' && typeof project.endDate === 'string' ? project.endDate : ''}
                          onChange={(e) => updateProject(index, 'endDate', e.target.value)}
                          disabled={!isEditing || project.endDate === 'PRESENT'}
                          placeholder="Leave blank if ongoing"
                        />
                        {isEditing && (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`current-project-${index}`}
                              checked={project.endDate === 'PRESENT'}
                              onCheckedChange={(checked) => handleCurrentProjectToggle(index, checked as boolean)}
                            />
                            <Label htmlFor={`current-project-${index}`} className="text-sm font-normal">
                              I'm currently working on this project
                            </Label>
                          </div>
                        )}
                      </div>
                      {!isEditing && project.startDate && (
                        <p className="text-xs text-gray-500">
                          {formatDate(
                            typeof project.startDate === 'string'
                              ? project.startDate
                              : project.startDate && Object.prototype.toString.call(project.startDate) === '[object Date]'
                                ? (project.startDate as Date).toISOString()
                                : ''
                          )} - {project.endDate === 'PRESENT' ? 'Present' : (project.endDate ? formatDate(
                            typeof project.endDate === 'string'
                              ? project.endDate
                              : project.endDate && Object.prototype.toString.call(project.endDate) === '[object Date]'
                                ? (project.endDate as Date).toISOString()
                                : ''
                          ) : 'Present')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Project Thumbnail */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Project Thumbnail
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Thumbnail Preview */}
                      <div className="space-y-2">
                        {(project.thumbnail || project.videoLink) && (
                          <div className="relative">
                            <Image
                              src={project.thumbnail || getVideoThumbnail(project.videoLink) || ''}
                              alt={project.name || 'Project thumbnail'}
                              width={400}
                              height={200}
                              className="w-full h-40 object-cover rounded-lg border"
                              onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik08NyA0OEw4NyA3Mkw5MyA3Mkw5MyA0OEw4NyA0OFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+'
                              }}
                            />
                          </div>
                        )}
                        {!project.thumbnail && !project.videoLink && (
                          <div className="w-full h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-sm">No thumbnail</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Upload Controls */}
                      {isEditing && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Upload Custom Thumbnail</Label>
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, index)}
                                disabled={isUploadingImage}
                                className="hidden"
                                id={`thumbnailUpload-${index}`}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById(`thumbnailUpload-${index}`)?.click()}
                                disabled={isUploadingImage}
                                className="flex items-center gap-2"
                              >
                                {isUploadingImage && uploadingIndex === index ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-4 h-4" />
                                    Upload Image
                                  </>
                                )}
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500">
                              Recommended: 16:9 aspect ratio, max 5MB
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Or Enter Image URL</Label>
                            <Input
                              type="url"
                              placeholder="https://example.com/image.jpg"
                              value={project.thumbnail}
                              onChange={(e) => updateProject(index, 'thumbnail', e.target.value)}
                              disabled={isUploadingImage && uploadingIndex === index}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project Description */}
                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Textarea
                      placeholder="Describe your project, your role, technologies used, and the impact it had. What problem did it solve? What did you learn?"
                      value={project.description}
                      onChange={(e) => updateProject(index, 'description', e.target.value)}
                      disabled={!isEditing}
                      className="min-h-[120px] resize-none"
                      maxLength={1000}
                    />
                    {isEditing && (
                      <p className="text-xs text-gray-500">
                        Be detailed and specific about your contributions ({project.description.length}/1000 characters)
                      </p>
                    )}
                  </div>

                  {/* Links Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Video Demo Link
                      </Label>
                      <Input
                        type="url"
                        placeholder="https://youtube.com/watch?v=..."
                        value={project.videoLink}
                        onChange={(e) => updateProject(index, 'videoLink', e.target.value)}
                        disabled={!isEditing}
                      />
                      {isEditing && (
                        <p className="text-xs text-gray-500">
                          YouTube, Vimeo, or other video platform links
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Live Demo Link
                      </Label>
                      <Input
                        type="url"
                        placeholder="https://myproject.com"
                        value={project.liveLink}
                        onChange={(e) => updateProject(index, 'liveLink', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        GitHub Repository
                      </Label>
                      <Input
                        type="url"
                        placeholder="https://github.com/username/repo"
                        value={project.githubLink}
                        onChange={(e) => updateProject(index, 'githubLink', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {/* Display Links when not editing */}
                  {!isEditing && (project.videoLink || project.liveLink || project.githubLink) && (
                    <div className="flex flex-wrap gap-2">
                      {project.videoLink && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(project.videoLink, '_blank')}
                          className="flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          Watch Demo
                        </Button>
                      )}
                      {project.liveLink && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(project.liveLink, '_blank')}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live Demo
                        </Button>
                      )}
                      {project.githubLink && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(project.githubLink, '_blank')}
                          className="flex items-center gap-2"
                        >
                          <Github className="w-4 h-4" />
                          View Code
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Skills Used */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Code2 className="w-4 h-4" />
                      Skills & Technologies Used
                    </Label>

                    {/* Skills Dropdown */}
                    {isEditing && availableSkills.length > 0 && (
                      <div className="space-y-2">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              addSkillToProject(index, e.target.value)
                              e.target.value = ''
                            }
                          }}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                          defaultValue=""
                        >
                          <option value="">Select skills from your portfolio...</option>
                          {availableSkills
                            .filter(skill => !project.skills.some(projectSkill => projectSkill.name === skill.name))
                            .map(skill => (
                              <option key={skill.name} value={skill.name}>
                                {skill.name} ({skill.type})
                              </option>
                            ))
                          }
                        </select>
                        <div className="flex flex-col gap-2 mt-2">
                          <div className="flex flex-row gap-1">
                            <input
                            type="text"
                            placeholder="Enter custom skill name"
                            value={customSkillName}
                            onChange={(e) => setCustomSkillName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Enter skill image URL"
                            value={customSkillLogo}
                            onChange={(e) => setCustomSkillLogo(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                          />
                          </div>
                          <Button
                            type="button"
                            onClick={() => {
                              const trimmedName = customSkillName.trim();
                              const trimmedLogo = customSkillLogo.trim();

                              if (trimmedName && !project.skills.some(skill => skill.name === trimmedName)) {
                                const newSkill = { name: trimmedName, logo: trimmedLogo };
                                updateProject(index, 'skills', [...project.skills, newSkill]);
                                setCustomSkillName('');
                                setCustomSkillLogo('');
                              }
                            }}
                          >
                            Add Custom Skill
                          </Button>
                        </div>

                        {/* Selected Skills */}
                        <div className="flex flex-wrap gap-2">
                          {project.skills.map((projectSkill) => (
                            <Badge
                              key={projectSkill.name}
                              variant="secondary"
                              className="flex items-center gap-2 px-3 py-1"
                            >
                              <div className="flex items-center gap-2">
                                {projectSkill.logo && (
                                  <Image
                                    src={projectSkill.logo}
                                    alt={projectSkill.name}
                                    width={16}
                                    height={16}
                                    className="w-4 h-4 object-contain flex-shrink-0"
                                    style={{ filter: 'invert(0.3)' }}
                                  />
                                )}
                                <span className="text-sm font-medium">{projectSkill.name}</span>
                              </div>
                              {isEditing && (
                                <button
                                  type="button"
                                  onClick={() => removeSkillFromProject(index, projectSkill.name)}
                                  className="ml-1 text-gray-500 hover:text-red-600 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </Badge>
                          ))}
                        </div>
                        {project.skills.length === 0 && (
                          <p className="text-sm text-gray-500 italic">
                            {isEditing ? 'Select skills from the dropdown above' : 'No skills specified'}
                          </p>
                        )}
                      </div>
                    )}
                    {/* Skills Preview after editing is done */}
                    {!isEditing && project.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.skills.map((projectSkill) => (
                          <Badge
                            key={projectSkill.name}
                            variant="secondary"
                            className="flex items-center gap-2 px-3 py-1"
                          >
                            <div className="flex items-center gap-2">
                              {projectSkill.logo && (
                                <Image
                                  src={projectSkill.logo}
                                  alt={projectSkill.name}
                                  width={16}
                                  height={16}
                                  className="w-4 h-4 object-contain flex-shrink-0"
                                  style={{ filter: 'invert(0.3)' }}
                                />
                              )}
                              <span className="text-sm font-medium">{projectSkill.name}</span>
                            </div>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Key Contributions */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Key Contributions & Achievements
                    </Label>
                    <div className="space-y-2">
                      {isEditing ? (
                        <Textarea
                          placeholder="• Implemented user authentication increasing security by 40%&#10;• Optimized database queries reducing load time by 60%&#10;• Led a team of 3 developers in agile environment&#10;• Deployed application serving 10,000+ daily users"
                          value={project.contributions}
                          onChange={(e) => updateProject(index, 'contributions', e.target.value)}
                          className="min-h-[120px] resize-none"
                          maxLength={800}
                        />
                      ) : (
                        project.contributions ? (
                          <div className="space-y-1">
                            {project.contributions.split('\n').filter(line => line.trim()).map((contribution, contributionIndex) => (
                              <div key={contributionIndex} className="flex items-start gap-2">
                                <span className="text-gray-400 text-sm mt-0.5">•</span>
                                <span className="text-sm">{contribution.replace(/^•\s*/, '')}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">No contributions specified</p>
                        )
                      )}
                      {isEditing && (
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500">
                            List your key contributions, one per line. Start each line with • for bullet points ({project.contributions.length}/800 characters)
                          </p>
                          <p className="text-xs text-gray-400">
                            Highlight specific achievements, metrics, and your role in the project's success
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Remove Project Button */}
                  {isEditing && (
                    <div className="flex justify-end pt-4 border-t border-gray-200">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeProject(index)}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove Project
                      </Button>
                    </div>
                  )}
                </div> {/* <-- Close main project card content div */}
              </Card>
            ))}

            {formData.projects.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No projects added yet</p>
                <p className="text-sm">Showcase your best work by adding your first project</p>
              </div>
            )}

            {/* Add Project Button */}
            {isEditing && (
              <div className="flex justify-center pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addProject}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </Button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          {isEditing && (
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-8 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Projects
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

export default ProjectsSection