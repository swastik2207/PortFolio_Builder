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

import React, { useState, useEffect, ChangeEvent, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Upload, Code, Edit, Save, X, Star, Award, AlertCircle, ImageIcon } from 'lucide-react'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

// Import types from your types file
import {
  Portfolio,
  Skill,
  SkillsFormData,
  CloudinaryResponse,
  SkillsSectionProps,
  SkillLevel
} from '@/types/portfolio'
import Image from 'next/image'

function SkillsSection({ portfolio, onUpdate }: SkillsSectionProps) {
  const [formData, setFormData] = useState<{ skills: Skill[] }>({
    skills: []
  })

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState<boolean>(false)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const [suggestions, setSuggestions] = useState<{ [key: number]: typeof popularSkills }>({})
  const [showSuggestions, setShowSuggestions] = useState<{ [key: number]: boolean }>({})
  const [activeSuggestion, setActiveSuggestion] = useState<{ [key: number]: number }>({})
  const skillInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

  // Maximum number of top skills allowed
  const MAX_TOP_SKILLS = 6

  // Skill types
  const skillTypes = [
    { value: 'Programming Language', label: 'Programming Language' },
    { value: 'Framework', label: 'Framework' },
    { value: 'Library', label: 'Library' },
    { value: 'Tool', label: 'Tool' },
    { value: 'Database', label: 'Database' },
    { value: 'DevOps', label: 'DevOps' },
    { value: 'Cloud Platform', label: 'Cloud Platform' },
    { value: 'Soft Skill', label: 'Soft Skill' },
    { value: 'Other', label: 'Other' }
  ] as const

  // Skill confidence levels
  const skillLevels: SkillLevel[] = [
    { label: 'Beginner', value: 20 },
    { label: 'Basic', value: 40 },
    { label: 'Intermediate', value: 60 },
    { label: 'Advanced', value: 80 },
    { label: 'Expert', value: 100 }
  ]

  // Enhanced popular skills with types
const popularSkills = [
  { name: 'JavaScript', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg', type: 'Programming Language' },
  { name: 'TypeScript', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg', type: 'Programming Language' },
  { name: 'React', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg', type: 'Framework' },
  { name: 'Node.js', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg', type: 'Framework' },
  { name: 'Python', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg', type: 'Programming Language' },
  { name: 'Java', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg', type: 'Programming Language' },
  { name: 'Ruby', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/ruby/ruby-original.svg', type: 'Programming Language' },
  { name: 'C ', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/c/c-original.svg', type: 'Programming Language' },
  { name: 'C++', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/cplusplus/cplusplus-original.svg', type: 'Programming Language' },
  { name: 'C#', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/csharp/csharp-original.svg', type: 'Programming Language' },
  { name: 'PHP', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/php/php-original.svg', type: 'Programming Language' },
  { name: 'Go', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/go/go-original.svg', type: 'Programming Language' },
  { name: 'Rust', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/rust/rust-plain.svg', type: 'Programming Language' },
  { name: 'Swift', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/swift/swift-original.svg', type: 'Programming Language' },
  { name: 'Kotlin', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/kotlin/kotlin-original.svg', type: 'Programming Language' },
  { name: 'Flutter' , logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/flutter/flutter-original.svg', type: 'Framework' },
  { name: 'Dart', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/dart/dart-original.svg', type: 'Programming Language' },
  { name: 'React Native', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg', type: 'Framework' },
  { name: 'Vue.js', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original.svg', type: 'Framework' },
  { name: 'Angular', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/angularjs/angularjs-original.svg', type: 'Framework' },
  { name: 'Next.js', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg', type: 'Framework' },
  { name: 'Express.js', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg', type: 'Framework' },
  { name: 'Django', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/django/django-plain.svg', type: 'Framework' },
  { name: 'Flask', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/flask/flask-original.svg', type: 'Framework' },
  { name: 'Spring', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/spring/spring-original.svg', type: 'Framework' },
  { name: 'Spring-Boot' , logo: 'https://img.icons8.com/?size=96&id=90519&format=png', type: 'Framework' },
  { name: 'MongoDB', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg', type: 'Database' },
  { name: 'PostgreSQL', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg', type: 'Database' },
  { name: 'MySQL', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg', type: 'Database' },
  { name: 'Redis', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original.svg', type: 'Database' },
  { name: 'Docker', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg', type: 'DevOps' },
  { name: 'Kubernetes', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/kubernetes/kubernetes-plain.svg', type: 'DevOps' },
  { name: 'AWS', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', type: 'Cloud Platform' },
  { name: 'Azure', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/azure/azure-original.svg', type: 'Cloud Platform' },
  { name: 'Google Cloud', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/googlecloud/googlecloud-original.svg', type: 'Cloud Platform' },
  { name: 'Git', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg', type: 'Tool' },
  { name: 'GitHub', logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png', type: 'Tool' },
  { name: 'GitLab', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/gitlab/gitlab-original.svg', type: 'Tool' },
  { name: 'Linux', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/linux/linux-original.svg', type: 'Tool' },
  { name: 'Figma', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/figma/figma-original.svg', type: 'Tool' },
  { name: 'Adobe Photoshop', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/photoshop/photoshop-line.svg', type: 'Tool' },
  { name: 'Adobe Illustrator', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/illustrator/illustrator-line.svg', type: 'Tool' },
  { name: 'Tailwind CSS', logo: 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg', type: 'Framework' },
  { name: 'Bootstrap', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/bootstrap/bootstrap-plain.svg', type: 'Framework' },
  { name: 'HTML5', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg', type: 'Programming Language' },
  { name: 'CSS3', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg', type: 'Programming Language' },
  { name: 'Sass', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/sass/sass-original.svg', type: 'Tool' },
  { name: 'Webpack', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/webpack/webpack-original.svg', type: 'Tool' },
  { name: 'Vite', logo: 'https://vitejs.dev/logo.svg', type: 'Tool' },
  { name: 'Jest', logo: 'https://www.vectorlogo.zone/logos/jestjsio/jestjsio-icon.svg', type: 'Tool' },
  { name: 'Cypress', logo: 'https://raw.githubusercontent.com/simple-icons/simple-icons/6e46ec1fc23b60c8fd0d2f2ff46db82e16dbd75f/icons/cypress.svg', type: 'Tool' },
  // Soft skills with colorful icons
  { name: 'Leadership', logo: 'https://img.icons8.com/color/48/leadership.png', type: 'Soft Skill' },
  { name: 'Communication', logo: 'https://img.icons8.com/color/48/communication.png', type: 'Soft Skill' },
  { name: 'Problem Solving', logo: 'https://img.icons8.com/color/48/problem-solving.png', type: 'Soft Skill' },
  { name: 'Team Collaboration', logo: 'https://img.icons8.com/color/48/team.png', type: 'Soft Skill' },
  { name: 'Project Management', logo: 'https://img.icons8.com/color/48/project-management.png', type: 'Soft Skill' },
  { name: 'Time Management', logo: 'https://img.icons8.com/color/48/time-management.png', type: 'Soft Skill' },
]

  // Load existing data when component mounts
  useEffect(() => {
    if (portfolio) {
      const enhancedSkills = (portfolio.skills || []).map(skill => ({
        ...skill,
        type: skill.type || 'Other' as Skill['type'],
        top: skill.top || false,
        description: skill.description || ''
      }))
      setFormData({
        skills: enhancedSkills
      })
    }
  }, [portfolio])

  // Get count of top skills
  const topSkillsCount = formData.skills.filter(skill => skill.top).length

  const handleLogoUpload = async (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }

    // Validate file size (max 2MB for logos)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size should be less than 2MB')
      return
    }

    setIsUploadingLogo(true)
    setUploadingIndex(index)

    try {
      const url = await uploadImageToCloudinary(file, 'portfolio/skill-logos')
      updateSkill(index, 'logo', url)
    } catch (error) {
      console.error('Error uploading logo:', error)
      alert('Failed to upload logo. Please try again.')
    } finally {
      setIsUploadingLogo(false)
      setUploadingIndex(null)
      if (event.target) {
        event.target.value = ''
      }
    }
  }

  const addSkill = (): void => {
    setFormData(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          type: 'Other' as Skill['type'],
          name: '',
          description: '',
          logo: '',
          confidence: 60,
          top: false
        }
      ]
    }))
  }

  const updateSkill = (index: number, field: keyof Skill, value: string | number | boolean): void => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === index ? { ...skill, [field]: value } : skill
      )
    }))

    // Handle skill name suggestions
    if (field === 'name' && typeof value === 'string') {
      handleSkillNameChange(index, value)
    }
  }

  const handleTopSkillToggle = (index: number, checked: boolean): void => {
    if (checked && topSkillsCount >= MAX_TOP_SKILLS) {
      alert(`You can only select up to ${MAX_TOP_SKILLS} top skills`)
      return
    }
    updateSkill(index, 'top', checked)
  }

  const handleSkillNameChange = (index: number, value: string): void => {
    if (value.trim().length === 0) {
      setShowSuggestions(prev => ({ ...prev, [index]: false }))
      setSuggestions(prev => ({ ...prev, [index]: [] }))
      return
    }

    // Filter suggestions based on input
    const filteredSuggestions = popularSkills.filter(skill =>
      skill.name.toLowerCase().includes(value.toLowerCase()) &&
      skill.name.toLowerCase() !== value.toLowerCase()
    ).slice(0, 8) // Show max 8 suggestions

    setSuggestions(prev => ({ ...prev, [index]: filteredSuggestions }))
    setShowSuggestions(prev => ({ ...prev, [index]: filteredSuggestions.length > 0 }))
    setActiveSuggestion(prev => ({ ...prev, [index]: -1 }))
  }

  const handleSuggestionClick = (index: number, skill: typeof popularSkills[0]): void => {
    // Fill name, logo, and type when clicking a suggestion
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((currentSkill, i) =>
        i === index ? {
          ...currentSkill,
          name: skill.name,
          logo: skill.logo,
          type: skill.type as Skill['type']
        } : currentSkill
      )
    }))

    // Hide suggestions after selection
    setShowSuggestions(prev => ({ ...prev, [index]: false }))
    setSuggestions(prev => ({ ...prev, [index]: [] }))

    // Focus back to the input for better UX
    if (skillInputRefs.current[index]) {
      skillInputRefs.current[index]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    const currentSuggestions = suggestions[index] || []
    const currentActive = activeSuggestion[index] || -1
    const isShowingSuggestions = showSuggestions[index]

    if (!isShowingSuggestions || currentSuggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveSuggestion(prev => ({
          ...prev,
          [index]: currentActive < currentSuggestions.length - 1 ? currentActive + 1 : 0
        }))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveSuggestion(prev => ({
          ...prev,
          [index]: currentActive > 0 ? currentActive - 1 : currentSuggestions.length - 1
        }))
        break
      case 'Enter':
        e.preventDefault()
        if (currentActive >= 0 && currentActive < currentSuggestions.length) {
          handleSuggestionClick(index, currentSuggestions[currentActive])
        }
        break
      case 'Escape':
        setShowSuggestions(prev => ({ ...prev, [index]: false }))
        break
    }
  }

  const removeSkill = (index: number): void => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const getConfidenceLabel = (confidence: number): string => {
    if (confidence <= 20) return 'Beginner'
    if (confidence <= 40) return 'Basic'
    if (confidence <= 60) return 'Intermediate'
    if (confidence <= 80) return 'Advanced'
    return 'Expert'
  }

  const getConfidenceColor = (confidence: number): string => {
    if (confidence <= 20) return 'text-red-600'
    if (confidence <= 40) return 'text-orange-600'
    if (confidence <= 60) return 'text-yellow-600'
    if (confidence <= 80) return 'text-blue-600'
    return 'text-green-600'
  }

  const getSkillTypeColor = (type: Skill['type']): string => {
    const colors = {
      'Programming Language': 'bg-blue-100 text-blue-800',
      'Framework': 'bg-green-100 text-green-800',
      'Library': 'bg-purple-100 text-purple-800',
      'Tool': 'bg-gray-100 text-gray-800',
      'Database': 'bg-orange-100 text-orange-800',
      'Cloud Platform': 'bg-cyan-100 text-cyan-800',
      'Soft Skill': 'bg-pink-100 text-pink-800',
      'DevOps': 'bg-yellow-100 text-yellow-800',
      'Other': 'bg-slate-100 text-slate-800'
    }
    return colors[type] || colors.Other
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Filter out empty skills
      const filteredSkills = formData.skills.filter(
        skill => skill.name.trim() !== ''
      )

      const updatedData: Partial<Portfolio> = {
        skills: filteredSkills
      }

      await onUpdate(updatedData)

      console.log('Skills updated successfully!')
      setIsEditing(false)

    } catch (error) {
      console.error('Error updating skills:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditToggle = (): void => {
    if (isEditing) {
      // If cancelling edit, reset form data to original portfolio data
      if (portfolio) {
        const enhancedSkills = (portfolio.skills || []).map(skill => ({
          ...skill,
          type: skill.type || 'Other' as Skill['type'],
          top: skill.top || false,
          description: skill.description || ''
        }))
        setFormData({
          skills: enhancedSkills
        })
      }
      // Clear all suggestion states
      setSuggestions({})
      setShowSuggestions({})
      setActiveSuggestion({})
    }
    setIsEditing(!isEditing)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Skills & Technologies
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
        {topSkillsCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span>{topSkillsCount} of {MAX_TOP_SKILLS} top skills selected</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Skills List */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Your Skills</Label>
            </div>

            {/* Top Skills Info */}
            {isEditing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Top Skills</p>
                  <p className="text-blue-700 mt-1">
                    Mark your strongest skills as "Top Skills" (maximum {MAX_TOP_SKILLS}). These will be highlighted in your portfolio.
                  </p>
                </div>
              </div>
            )}

            {formData.skills.map((skill, index) => (
              <Card key={index} className={`p-4 ${skill.top ? 'border-yellow-300 bg-yellow-50' : 'border-dashed'}`}>
                <div className="space-y-4">
                  {/* Top Skill Toggle at the top */}
                  {isEditing && (
                    <div className="flex items-center gap-3 mb-2">
                      <Checkbox
                        id={`top-skill-${index}`}
                        checked={skill.top || false}
                        onCheckedChange={(checked) => handleTopSkillToggle(index, checked as boolean)}
                        disabled={!skill.top && topSkillsCount >= MAX_TOP_SKILLS}
                      />
                      <Label htmlFor={`top-skill-${index}`} className="text-sm font-normal">
                        Mark as top skill
                      </Label>
                      {skill.top && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                      {!skill.top && topSkillsCount >= MAX_TOP_SKILLS && (
                        <span className="text-xs text-gray-500">
                          Maximum {MAX_TOP_SKILLS} top skills allowed
                        </span>
                      )}
                    </div>
                  )}
                  {/* Skill Name and Type side by side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div className="space-y-2 relative">
                      <Label>Skill Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter skill name (e.g., JavaScript, React...)"
                        value={skill.name}
                        onChange={(e) => updateSkill(index, 'name', e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onFocus={() => {
                          if (skill.name.trim()) {
                            handleSkillNameChange(index, skill.name)
                          }
                        }}
                        onBlur={() => {
                          setTimeout(() => {
                            setShowSuggestions(prev => ({ ...prev, [index]: false }))
                          }, 200)
                        }}
                        disabled={!isEditing}
                        className="w-full"
                        ref={(el) => {
                          skillInputRefs.current[index] = el
                        }}
                      />
                      {/* Suggestions Dropdown */}
                      {isEditing && showSuggestions[index] && suggestions[index]?.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {suggestions[index].map((suggestion, suggestionIndex) => (
                            <div
                              key={suggestion.name}
                              className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${activeSuggestion[index] === suggestionIndex
                                ? 'bg-blue-50 border-l-2 border-blue-500'
                                : 'hover:bg-gray-50'
                                }`}
                              onMouseDown={(e) => { e.preventDefault() }}
                              onClick={() => handleSuggestionClick(index, suggestion)}
                              onMouseEnter={() => { setActiveSuggestion(prev => ({ ...prev, [index]: suggestionIndex })) }}
                            >
                              {suggestion.logo && (
                                <Image
                                  src={suggestion.logo}
                                  alt={suggestion.name}
                                  width={20}
                                  height={20}
                                  className="w-5 h-5 object-contain flex-shrink-0"
                                  style={{ filter: 'invert(0.3)' }}
                                />
                              )}
                              <div className="flex-1">
                                <span className="text-sm font-medium truncate">{suggestion.name}</span>
                                <span className={`inline-block ml-2 px-1.5 py-0.5 rounded text-xs ${getSkillTypeColor(suggestion.type as Skill['type'])}`}>
                                  {suggestion.type}
                                </span>
                              </div>
                              <span className="text-xs text-gray-400 ml-auto">Click to select</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {isEditing && (
                        <p className="text-xs text-gray-500">
                          Start typing to see suggestions, use ↑↓ to navigate, Enter to select
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Skill Type</Label>
                      <Select
                        value={skill.type}
                        onValueChange={(value) => updateSkill(index, 'type', value as Skill['type'])}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {skillTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* Display skill type badge when not editing */}
                  {!isEditing && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSkillTypeColor(skill.type)}`}>
                        {skill.type}
                      </span>
                      {skill.top && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Top Skill
                        </span>
                      )}
                    </div>
                  )}

                  {/* Other fields below */}
                  <div className="flex flex-col gap-4">
                    {/* Skill Logo with Preview */}
                    <div className="space-y-2 flex-shrink-0">
                      <Label className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Skill Logo
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Logo Preview */}
                        <div className="space-y-2">
                          {skill.logo ? (
                            <div className="relative">
                              <Image
                                src={skill.logo}
                                alt={skill.name || 'Skill logo'}
                                width={80}
                                height={80}
                                className="w-20 h-20 object-contain rounded-lg border p-2"
                                onError={(e) => {
                                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNSAzMEwzNSA1MEw0NSA1MEw0NSAzMEwzNSAzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                              <div className="text-center text-gray-500">
                                <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                                <p className="text-xs">No logo</p>
                              </div>
                            </div>
                          )}
                        </div>
                        {/* Upload Controls */}
                        {isEditing && (
                          <div className="space-y-4 flex-1">
                            <div className="space-y-2">
                              <Label className="text-sm">Upload Logo</Label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleLogoUpload(e, index)}
                                  disabled={isUploadingLogo}
                                  className="hidden"
                                  id={`logoUpload-${index}`}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => document.getElementById(`logoUpload-${index}`)?.click()}
                                  disabled={isUploadingLogo}
                                  className="flex items-center gap-2"
                                >
                                  {isUploadingLogo && uploadingIndex === index ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                                      Uploading...
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-4 h-4" />
                                      Upload
                                    </>
                                  )}
                                </Button>
                              </div>
                              <p className="text-xs text-gray-500">
                                Recommended: Square image, max 2MB
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm">Or Enter Logo URL</Label>
                              <Input
                                type="url"
                                placeholder="https://example.com/logo.svg"
                                value={skill.logo}
                                onChange={(e) => updateSkill(index, 'logo', e.target.value)}
                                disabled={isUploadingLogo && uploadingIndex === index}
                                className="text-sm"
                              />
                            </div>
                          </div>
                        )}
                        {/* Display when not editing */}
                        {!isEditing && (
                          <div className="flex items-center justify-center">
                            <div className="text-sm text-gray-600">
                              {skill.logo ? 'Logo set' : 'No logo'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Skill Description */}
                    <div className="space-y-2">
                      <Label>Description (Optional)</Label>
                      <Textarea
                        placeholder="Brief description of your experience with this skill (1-2 sentences). E.g., 'Used for building responsive web applications and handling state management.'"
                        value={skill.description || ''}
                        onChange={(e) => updateSkill(index, 'description', e.target.value)}
                        disabled={!isEditing}
                        className="min-h-[80px] resize-none"
                        maxLength={200}
                      />
                      {isEditing && (
                        <p className="text-xs text-gray-500">
                          Keep it short and focused on how you use this skill ({skill.description?.length || 0}/200 characters)
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Confidence Level and Remove Button below */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Confidence Level
                      </Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${getConfidenceColor(skill.confidence)}`}>
                            {getConfidenceLabel(skill.confidence)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {skill.confidence}%
                          </span>
                        </div>
                        <Slider
                          value={[skill.confidence]}
                          onValueChange={(value) => updateSkill(index, 'confidence', value[0])}
                          disabled={!isEditing}
                          max={100}
                          min={10}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Beginner</span>
                          <span>Basic</span>
                          <span>Intermediate</span>
                          <span>Advanced</span>
                          <span>Expert</span>
                        </div>
                      </div>
                    </div>
                    {/* Remove Button */}
                    {isEditing && (
                      <div className="flex justify-end pb-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeSkill(index)}
                          className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            {formData.skills.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Code className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No skills added yet</p>
                <p className="text-sm">Click "Add Skill" below to get started</p>
              </div>
            )}

            {/* Add Skill Button */}
            {isEditing && (
              <div className="flex justify-center pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSkill}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Skill
                </Button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          {isEditing && (
            <div className="flex justify-end pt-6">
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
                    Save Changes
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

export default SkillsSection