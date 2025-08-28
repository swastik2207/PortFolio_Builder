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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Plus, 
  Trash2, 
  Upload, 
  Briefcase, 
  Edit, 
  Save, 
  X, 
  Calendar,
  MapPin,
  Building,
  ExternalLink,
  AlertCircle,
  Clock,
  Users,
  Target
} from 'lucide-react'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

// Import types from your types file
import {
  Portfolio,
  Experience,
  CloudinaryResponse,
  ExperienceSectionProps
} from '@/types/portfolio'
import Image from 'next/image'

function ExperienceSection({ portfolio, onUpdate }: ExperienceSectionProps) {
  const [formData, setFormData] = useState<{ experiences: Experience[] }>({
    experiences: []
  })

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState<boolean>(false)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

  // Employment types
  const employmentTypes = [
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Internship', label: 'Internship' },
    { value: 'Freelance', label: 'Freelance' },
    { value: 'Volunteer', label: 'Volunteer' }
  ] as const

  // Location types
  const locationTypes = [
    { value: 'On-site', label: 'On-site' },
    { value: 'Remote', label: 'Remote' },
    { value: 'Hybrid', label: 'Hybrid' }
  ] as const

  // Load existing data when component mounts
  useEffect(() => {
    if (portfolio) {
      const enhancedExperiences = (portfolio.experiences || []).map(experience => ({
        ...experience,
        companyLogoUrl: experience.companyLogoUrl || '',
        companyWebsite: experience.companyWebsite || '',
      }))
      setFormData({
        experiences: enhancedExperiences
      })
    }
  }, [portfolio])

  const handleLogoUpload = async (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }

    // Validate file size (max 2MB for company logos)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size should be less than 2MB')
      return
    }

    setIsUploadingLogo(true)
    setUploadingIndex(index)

    try {
      const url = await uploadImageToCloudinary(file, 'portfolio/company-logos')
      updateExperience(index, 'companyLogoUrl', url)
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

  const addExperience = (): void => {
    setFormData(prev => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          title: '',
          employeeType: 'Full-time',
          companyName: '',
          companyLogoUrl: '',
          companyWebsite: '',
          startDate: '',
          endDate: '', // Use empty string for new experience to match Experience type
          location: '',
          locationType: 'On-site'
        } as Experience // Type assertion to satisfy Experience type
      ]
    }))
  }

  const updateExperience = (index: number, field: keyof Experience, value: string | Date | null | boolean): void => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.map((experience, i) =>
        i === index ? { ...experience, [field]: value } : experience
      )
    }))
  }

  const removeExperience = (index: number): void => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }))
  }

  const handleCurrentJobToggle = (index: number, isCurrent: boolean): void => {
    updateExperience(index, 'endDate', isCurrent ? 'PRESENT' : '')
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

  const formatDate = (dateValue: string | Date | null): string => {
    if (!dateValue) return 'Present'
    if (dateValue === 'Present') return 'Present'
    
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    })
  }

  const calculateDuration = (startDate: string | Date, endDate: string | Date | null): string => {
    if (!startDate) return ''
    
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate
    const end = endDate && endDate !== 'Present' 
      ? (typeof endDate === 'string' ? new Date(endDate) : endDate)
      : new Date()

    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    
    if (months < 1) return '1 month'
    if (months < 12) return `${months} month${months > 1 ? 's' : ''}`
    
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    
    if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`
    return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate all experiences
      for (let i = 0; i < formData.experiences.length; i++) {
        const experience = formData.experiences[i]
        
        if (!experience.title.trim()) {
          alert(`Experience ${i + 1}: Job title is required`)
          setIsSubmitting(false)
          return
        }

        if (!experience.companyName.trim()) {
          alert(`Experience ${i + 1}: Company name is required`)
          setIsSubmitting(false)
          return
        }

        if (!experience.startDate) {
          alert(`Experience ${i + 1}: Start date is required`)
          setIsSubmitting(false)
          return
        }

        if (experience.companyWebsite && !validateURL(experience.companyWebsite)) {
          alert(`Experience ${i + 1}: Invalid company website URL`)
          setIsSubmitting(false)
          return
        }

        if (experience.startDate && experience.endDate && experience.endDate !== null) {
          const startDate = new Date(experience.startDate)
          const endDate = new Date(experience.endDate)
          if (startDate > endDate) {
            alert(`Experience ${i + 1}: Start date cannot be after end date`)
            setIsSubmitting(false)
            return
          }
        }
      }

      // Filter out empty experiences
      const filteredExperiences = formData.experiences
        .filter(experience => experience.title.trim() !== '' && experience.companyName.trim() !== '')

      const updatedData: Partial<Portfolio> = {
        experiences: filteredExperiences
      }

      await onUpdate(updatedData)

      console.log('Experiences updated successfully!')
      setIsEditing(false)

    } catch (error) {
      console.error('Error updating experiences:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditToggle = (): void => {
    if (isEditing) {
      // If cancelling edit, reset form data to original portfolio data
      if (portfolio) {
        const enhancedExperiences = (portfolio.experiences || []).map(experience => ({
          ...experience,
          companyLogoUrl: experience.companyLogoUrl || '',
          companyWebsite: experience.companyWebsite || ''
        }))
        setFormData({
          experiences: enhancedExperiences
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
            <Briefcase className="w-5 h-5" />
            Work Experience
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
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Experience List */}
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Your Work Experience</Label>
              <p className="text-sm text-gray-600 mt-1">
                Add your professional experience, internships, and relevant work history
              </p>
            </div>

            {/* Experience Guidelines */}
            {isEditing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Experience Guidelines</p>
                  <ul className="text-blue-700 mt-1 space-y-1">
                    <li>• List experiences in reverse chronological order (most recent first)</li>
                    <li>• Include internships, freelance work, and volunteer positions</li>
                    <li>• Be specific about your achievements and responsibilities</li>
                    <li>• Use action verbs and quantify results when possible</li>
                  </ul>
                </div>
              </div>
            )}

            {formData.experiences.map((experience, index) => (
              <Card key={index} className="p-6 border-dashed border-2">
                <div className="space-y-6">
                  {/* Job Title and Employment Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Job Title *</Label>
                      <Input
                        type="text"
                        placeholder="Software Engineer"
                        value={experience.title}
                        onChange={(e) => updateExperience(index, 'title', e.target.value)}
                        disabled={!isEditing}
                        className="font-medium"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Employment Type *</Label>
                      <Select
                        value={experience.employeeType}
                        onValueChange={(value) => updateExperience(index, 'employeeType', value as Experience['employeeType'])}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {employmentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Company Name *</Label>
                      <Input
                        type="text"
                        placeholder="Tech Company Inc."
                        value={experience.companyName}
                        onChange={(e) => updateExperience(index, 'companyName', e.target.value)}
                        disabled={!isEditing}
                        className="font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Company Website</Label>
                      <Input
                        type="url"
                        placeholder="https://company.com"
                        value={experience.companyWebsite || ''}
                        onChange={(e) => updateExperience(index, 'companyWebsite', e.target.value)}
                        disabled={!isEditing}
                      />
                      {!isEditing && experience.companyWebsite && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(experience.companyWebsite, '_blank')}
                          className="flex items-center gap-2 mt-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Visit Website
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Company Logo */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Company Logo
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Logo Preview */}
                      <div className="space-y-2">
                        {experience.companyLogoUrl ? (
                          <div className="relative">
                            <Image
                              src={experience.companyLogoUrl}
                              alt={`${experience.companyName} logo`}
                              width={80}
                              height={80}
                              className="w-20 h-20 object-contain border rounded-lg p-2 bg-white"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <Building className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Upload Controls */}
                      {isEditing && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Upload Company Logo</Label>
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
                                    Upload Logo
                                  </>
                                )}
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500">
                              Square format preferred, max 2MB
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Or Enter Logo URL</Label>
                            <Input
                              type="url"
                              placeholder="https://company.com/logo.png"
                              value={experience.companyLogoUrl || ''}
                              onChange={(e) => updateExperience(index, 'companyLogoUrl', e.target.value)}
                              disabled={isUploadingLogo && uploadingIndex === index}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dates and Duration */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Start Date *
                      </Label>
                      <Input
                        type="month"
                        value={typeof experience.startDate === 'string' ? experience.startDate : experience.startDate?.toISOString().slice(0, 7) || ''}
                        onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
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
                          value={experience.endDate && experience.endDate !== 'PRESENT' && experience.endDate !== null && typeof experience.endDate === 'string' ? experience.endDate : ''}
                          onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                          disabled={!isEditing || experience.endDate === 'PRESENT'}
                          placeholder="Leave blank if current"
                        />
                        {isEditing && (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`current-job-${index}`}
                              checked={experience.endDate === 'PRESENT'}
                              onCheckedChange={(checked) => handleCurrentJobToggle(index, checked as boolean)}
                            />
                            <Label htmlFor={`current-job-${index}`} className="text-sm font-normal">
                              I currently work here
                            </Label>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Duration
                      </Label>
                      <div className="p-2 bg-gray-50 rounded border text-sm text-gray-700">
                        {experience.startDate ? calculateDuration(experience.startDate, experience.endDate) : 'Not calculated'}
                      </div>
                      {!isEditing && experience.startDate && (
                        <p className="text-xs text-gray-500">
                          {formatDate(
                            typeof experience.startDate === 'string'
                              ? experience.startDate
                              : experience.startDate && Object.prototype.toString.call(experience.startDate) === '[object Date]'
                                ? (experience.startDate as Date).toISOString()
                                : ''
                          )} - {experience.endDate === 'PRESENT' ? 'Present' : (experience.endDate ? formatDate(
                            typeof experience.endDate === 'string'
                              ? experience.endDate
                              : experience.endDate && Object.prototype.toString.call(experience.endDate) === '[object Date]'
                                ? (experience.endDate as Date).toISOString()
                                : ''
                          ) : 'Present')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Location Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </Label>
                      <Input
                        type="text"
                        placeholder="San Francisco, CA"
                        value={experience.location}
                        onChange={(e) => updateExperience(index, 'location', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Work Type</Label>
                      <Select
                        value={experience.locationType}
                        onValueChange={(value) => updateExperience(index, 'locationType', value as Experience['locationType'])}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {locationTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Remove Experience Button */}
                  {isEditing && (
                    <div className="flex justify-end pt-4 border-t border-gray-200">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeExperience(index)}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove Experience
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}

            {formData.experiences.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No work experience added yet</p>
                <p className="text-sm">Add your professional experience to showcase your career journey</p>
              </div>
            )}

            {/* Add Experience Button */}
            {isEditing && (
              <div className="flex justify-center pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addExperience}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Experience
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
                    Save Experience
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

export default ExperienceSection