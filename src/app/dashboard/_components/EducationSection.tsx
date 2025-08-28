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
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Plus, 
  Trash2, 
  Upload, 
  GraduationCap, 
  Edit, 
  Save, 
  X, 
  Calendar,
  School,
  Award,
  AlertCircle,
  Clock,
  BookOpen
} from 'lucide-react'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

// Import types from your types file
import {
  Portfolio,
  Education,
  CloudinaryResponse,
  EducationSectionProps
} from '@/types/portfolio'
import Image from 'next/image'

function EducationSection({ portfolio, onUpdate }: EducationSectionProps) {
  const [formData, setFormData] = useState<{ education: Education[] }>({
    education: []
  })

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState<boolean>(false)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

  // Common degree types for suggestions
  const commonDegrees = [
    'Bachelor of Science (B.S.)',
    'Bachelor of Arts (B.A.)',
    'Bachelor of Engineering (B.E.)',
    'Bachelor of Technology (B.Tech)',
    'Master of Science (M.S.)',
    'Master of Arts (M.A.)',
    'Master of Engineering (M.E.)',
    'Master of Technology (M.Tech)',
    'Master of Business Administration (MBA)',
    'Doctor of Philosophy (Ph.D.)',
    'Associate Degree',
    'High School Diploma',
    'Certificate Program',
    'Professional Certificate'
  ]

  // Load existing data when component mounts
  useEffect(() => {
    if (portfolio) {
      const enhancedEducation = (portfolio.education || []).map(education => ({
        ...education,
        schoolLogoUrl: education.schoolLogoUrl || '',
        grade: education.grade || ''
      }))
      setFormData({
        education: enhancedEducation
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

    // Validate file size (max 2MB for school logos)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size should be less than 2MB')
      return
    }

    setIsUploadingLogo(true)
    setUploadingIndex(index)

    try {
      const url = await uploadImageToCloudinary(file, 'portfolio/school-logos')
      updateEducation(index, 'schoolLogoUrl', url)
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

  const addEducation = (): void => {
    setFormData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          school: '',
          schoolLogoUrl: '',
          degree: '',
          startDate: '',
          endDate: '',
          grade: ''
        }
      ]
    }))
  }

  const updateEducation = (index: number, field: keyof Education, value: string | Date | null): void => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((education, i) =>
        i === index ? { ...education, [field]: value } : education
      )
    }))
  }

  const removeEducation = (index: number): void => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  const handleCurrentStudyToggle = (index: number, isCurrent: boolean): void => {
    updateEducation(index, 'endDate', isCurrent ? 'PRESENT' : '')
  }

  const formatDate = (dateValue: string | Date | null): string => {
    if (!dateValue) return 'Present'
    
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    })
  }

  const calculateDuration = (startDate: string | Date, endDate: string | Date | null): string => {
    if (!startDate) return ''
    
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate
    const end = endDate 
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
      // Validate all education entries
      for (let i = 0; i < formData.education.length; i++) {
        const education = formData.education[i]
        
        if (!education.school.trim()) {
          alert(`Education ${i + 1}: School name is required`)
          setIsSubmitting(false)
          return
        }

        if (!education.degree.trim()) {
          alert(`Education ${i + 1}: Degree is required`)
          setIsSubmitting(false)
          return
        }

        if (!education.startDate) {
          alert(`Education ${i + 1}: Start date is required`)
          setIsSubmitting(false)
          return
        }

        if (education.startDate && education.endDate) {
          const startDate = new Date(education.startDate)
          const endDate = new Date(education.endDate)
          if (startDate > endDate) {
            alert(`Education ${i + 1}: Start date cannot be after end date`)
            setIsSubmitting(false)
            return
          }
        }
      }

      // Filter out empty education entries
      const filteredEducation = formData.education
        .filter(education => education.school.trim() !== '' && education.degree.trim() !== '')

      const updatedData: Partial<Portfolio> = {
        education: filteredEducation
      }

      await onUpdate(updatedData)

      console.log('Education updated successfully!')
      setIsEditing(false)

    } catch (error) {
      console.error('Error updating education:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditToggle = (): void => {
    if (isEditing) {
      // If cancelling edit, reset form data to original portfolio data
      if (portfolio) {
        const enhancedEducation = (portfolio.education || []).map(education => ({
          ...education,
          schoolLogoUrl: education.schoolLogoUrl || '',
          grade: education.grade || ''
        }))
        setFormData({
          education: enhancedEducation
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
            <GraduationCap className="w-5 h-5" />
            Education
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
          {/* Education List */}
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Your Education</Label>
              <p className="text-sm text-gray-600 mt-1">
                Add your educational background, degrees, and academic achievements
              </p>
            </div>

            {/* Education Guidelines */}
            {isEditing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Education Guidelines</p>
                  <ul className="text-blue-700 mt-1 space-y-1">
                    <li>• List education in reverse chronological order (most recent first)</li>
                    <li>• Include degrees, certifications, and relevant coursework</li>
                    <li>• Add your GPA or grade if it's impressive (3.5+ recommended)</li>
                    <li>• Include ongoing education or current studies</li>
                  </ul>
                </div>
              </div>
            )}

            {formData.education.map((education, index) => (
              <Card key={index} className="p-6 border-dashed border-2">
                <div className="space-y-6">
                  {/* School and Degree */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>School/Institution *</Label>
                      <Input
                        type="text"
                        placeholder="University of Technology"
                        value={education.school}
                        onChange={(e) => updateEducation(index, 'school', e.target.value)}
                        disabled={!isEditing}
                        className="font-medium"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Degree/Program *</Label>
                      <Input
                        type="text"
                        placeholder="Bachelor of Science in Computer Science"
                        value={education.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        disabled={!isEditing}
                        list={`degrees-${index}`}
                      />
                      {isEditing && (
                        <datalist id={`degrees-${index}`}>
                          {commonDegrees.map((degree) => (
                            <option key={degree} value={degree} />
                          ))}
                        </datalist>
                      )}
                    </div>
                  </div>

                  {/* School Logo */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <School className="w-4 h-4" />
                      School Logo
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Logo Preview */}
                      <div className="space-y-2">
                        {education.schoolLogoUrl ? (
                          <div className="relative">
                            <Image
                              src={education.schoolLogoUrl}
                              alt={`${education.school} logo`}
                              width={80}
                              height={80}
                              className="w-20 h-20 object-contain border rounded-lg p-2 bg-white"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <School className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Upload Controls */}
                      {isEditing && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Upload School Logo</Label>
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
                              placeholder="https://university.edu/logo.png"
                              value={education.schoolLogoUrl || ''}
                              onChange={(e) => updateEducation(index, 'schoolLogoUrl', e.target.value)}
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
                        value={typeof education.startDate === 'string' ? education.startDate : education.startDate?.toISOString().slice(0, 7) || ''}
                        onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
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
                          value={education.endDate && education.endDate !== 'PRESENT' && education.endDate !== null && typeof education.endDate === 'string' ? education.endDate : ''}
                          onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                          disabled={!isEditing || education.endDate === 'PRESENT'}
                          placeholder="Leave blank if ongoing"
                        />
                        {isEditing && (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`current-study-${index}`}
                              checked={education.endDate === 'PRESENT'}
                              onCheckedChange={(checked) => handleCurrentStudyToggle(index, checked as boolean)}
                            />
                            <Label htmlFor={`current-study-${index}`} className="text-sm font-normal">
                              I'm currently studying here
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
                        {education.startDate ? calculateDuration(education.startDate, education.endDate) : 'Not calculated'}
                      </div>
                      {!isEditing && education.startDate && (
                        <p className="text-xs text-gray-500">
                          {formatDate(
                            typeof education.startDate === 'string'
                              ? education.startDate
                              : education.startDate && Object.prototype.toString.call(education.startDate) === '[object Date]'
                                ? (education.startDate as Date).toISOString()
                                : ''
                          )} - {education.endDate === 'PRESENT' ? 'Present' : (education.endDate ? formatDate(
                            typeof education.endDate === 'string'
                              ? education.endDate
                              : education.endDate && Object.prototype.toString.call(education.endDate) === '[object Date]'
                                ? (education.endDate as Date).toISOString()
                                : ''
                          ) : 'Present')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Grade/GPA */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Grade/GPA (Optional)
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        type="text"
                        placeholder="3.8/4.0, First Class, 85%, etc."
                        value={education.grade || ''}
                        onChange={(e) => updateEducation(index, 'grade', e.target.value)}
                        disabled={!isEditing}
                      />
                      {isEditing && (
                        <div className="flex items-center text-sm text-gray-500">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Only include if impressive (3.5+ GPA recommended)
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Remove Education Button */}
                  {isEditing && (
                    <div className="flex justify-end pt-4 border-t border-gray-200">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeEducation(index)}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove Education
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}

            {formData.education.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No education added yet</p>
                <p className="text-sm">Add your educational background to showcase your academic achievements</p>
              </div>
            )}

            {/* Add Education Button */}
            {isEditing && (
              <div className="flex justify-center pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addEducation}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Education
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
                    Save Education
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

export default EducationSection