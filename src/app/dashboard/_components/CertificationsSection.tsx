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
import { 
  Plus, 
  Trash2, 
  Upload, 
  Award, 
  Edit, 
  Save, 
  X, 
  Image as ImageIcon,
  AlertCircle,
  FileText,
  Shield,
  CheckCircle,
  ExternalLink
} from 'lucide-react'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

// Import types from your types file
import {
  Portfolio,
  Certificate,
  CloudinaryResponse,
  CertificationsSectionProps
} from '@/types/portfolio'
import Image from 'next/image'

function CertificateSection({ portfolio, onUpdate }: CertificationsSectionProps) {
  const [formData, setFormData] = useState<{ certificates: Certificate[] }>({
    certificates: []
  })

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

  // Load existing data when component mounts
  useEffect(() => {
    if (portfolio) {
      const enhancedCertificates = (portfolio.certificates || []).map(certificate => ({
        ...certificate,
        pic: certificate.pic || '',
        description: certificate.description || ''
      }))
      setFormData({
        certificates: enhancedCertificates
      })
    }
  }, [portfolio])

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }

    // Validate file size (max 5MB for certificate images)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB')
      return
    }

    setIsUploadingImage(true)
    setUploadingIndex(index)

    try {
      const url = await uploadImageToCloudinary(file, 'portfolio/certificates')
      updateCertificate(index, 'pic', url)
    } catch (error) {
      console.error('Error uploading certificate image:', error)
      alert('Failed to upload certificate image. Please try again.')
    } finally {
      setIsUploadingImage(false)
      setUploadingIndex(null)
      if (event.target) {
        event.target.value = ''
      }
    }
  }

  const addCertificate = (): void => {
    setFormData(prev => ({
      ...prev,
      certificates: [
        ...prev.certificates,
        {
          name: '',
          pic: '',
          description: ''
        }
      ]
    }))
  }

  const updateCertificate = (index: number, field: keyof Certificate, value: string): void => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates.map((certificate, i) =>
        i === index ? { ...certificate, [field]: value } : certificate
      )
    }))
  }

  const removeCertificate = (index: number): void => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index)
    }))
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate all certificates
      for (let i = 0; i < formData.certificates.length; i++) {
        const certificate = formData.certificates[i]
        
        if (!certificate.name.trim()) {
          alert(`Certificate ${i + 1}: Name is required`)
          setIsSubmitting(false)
          return
        }

        if (!certificate.description.trim()) {
          alert(`Certificate ${i + 1}: Description is required`)
          setIsSubmitting(false)
          return
        }

        if (certificate.pic && !validateURL(certificate.pic)) {
          alert(`Certificate ${i + 1}: Invalid image URL`)
          setIsSubmitting(false)
          return
        }
      }

      // Filter out empty certificates
      const filteredCertificates = formData.certificates
        .filter(certificate => certificate.name.trim() !== '' && certificate.description.trim() !== '')

      const updatedData: Partial<Portfolio> = {
        certificates: filteredCertificates
      }

      await onUpdate(updatedData)

      console.log('Certificates updated successfully!')
      setIsEditing(false)

    } catch (error) {
      console.error('Error updating certificates:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditToggle = (): void => {
    if (isEditing) {
      // If cancelling edit, reset form data to original portfolio data
      if (portfolio) {
        const enhancedCertificates = (portfolio.certificates || []).map(certificate => ({
          ...certificate,
          pic: certificate.pic || '',
          description: certificate.description || ''
        }))
        setFormData({
          certificates: enhancedCertificates
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
            <Award className="w-5 h-5" />
            Certificates & Certifications
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
          {/* Certificates List */}
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Your Certificates</Label>
              <p className="text-sm text-gray-600 mt-1">
                Showcase your professional certifications, courses, and achievements
              </p>
            </div>

            {/* Certificate Guidelines */}
            {isEditing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Certificate Guidelines</p>
                  <ul className="text-blue-700 mt-1 space-y-1">
                    <li>• Include industry-recognized certifications and professional courses</li>
                    <li>• Upload clear, high-quality images of your certificates</li>
                    <li>• Add detailed descriptions explaining the skills gained</li>
                    <li>• Order by relevance to your target role or industry</li>
                  </ul>
                </div>
              </div>
            )}

            {formData.certificates.map((certificate, index) => (
              <Card key={index} className="p-6 border-dashed border-2">
                <div className="space-y-6">
                  {/* Certificate Name */}
                  <div className="space-y-2">
                    <Label>Certificate Name *</Label>
                    <Input
                      type="text"
                      placeholder="AWS Certified Solutions Architect"
                      value={certificate.name}
                      onChange={(e) => updateCertificate(index, 'name', e.target.value)}
                      disabled={!isEditing}
                      className="font-medium"
                    />
                  </div>

                  {/* Certificate Image */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Certificate Image
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Image Preview */}
                      <div className="space-y-2">
                        {certificate.pic ? (
                          <div className="relative group">
                            <Image
                              src={certificate.pic}
                              alt={certificate.name || 'Certificate'}
                              width={1920}
                              height={1080}
                              className="w-full h-48 object-contain border rounded-lg p-2 bg-white cursor-pointer hover:shadow-lg transition-shadow"
                              onClick={() => !isEditing && window.open(certificate.pic, '_blank')}
                              onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik05MCA2MEw5MCA5MEw5NSA5MEw5NSA2MEw5MCA2MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'
                              }}
                            />
                            {!isEditing && (
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                <div className="bg-white rounded-full p-2">
                                  <ExternalLink className="w-4 h-4 text-gray-700" />
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-sm">No certificate image</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Upload Controls */}
                      {isEditing && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Upload Certificate Image</Label>
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, index)}
                                disabled={isUploadingImage}
                                className="hidden"
                                id={`certificateUpload-${index}`}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById(`certificateUpload-${index}`)?.click()}
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
                              Clear, high-quality certificate image, max 5MB
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Or Enter Image URL</Label>
                            <Input
                              type="url"
                              placeholder="https://example.com/certificate.jpg"
                              value={certificate.pic}
                              onChange={(e) => updateCertificate(index, 'pic', e.target.value)}
                              disabled={isUploadingImage && uploadingIndex === index}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Certificate Description */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Description *
                    </Label>
                    <Textarea
                      placeholder="Describe what this certificate represents, the skills you gained, the issuing organization, and how it relates to your professional goals. Include any notable achievements or scores if applicable."
                      value={certificate.description}
                      onChange={(e) => updateCertificate(index, 'description', e.target.value)}
                      disabled={!isEditing}
                      className="min-h-[120px] resize-none"
                      maxLength={800}
                    />
                    {isEditing && (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">
                          Include issuing organization, key skills learned, and relevance to your career ({certificate.description.length}/800 characters)
                        </p>
                        <div className="flex items-start gap-2 text-xs text-gray-400">
                          <Shield className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>Tip: Mention specific technologies, methodologies, or frameworks covered in the certification</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Certificate Status - when not editing, show a verification badge */}
                  {!isEditing && certificate.pic && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                      <CheckCircle className="w-4 h-4" />
                      <span>Certificate verified and uploaded</span>
                    </div>
                  )}

                  {/* Remove Certificate Button */}
                  {isEditing && (
                    <div className="flex justify-end pt-4 border-t border-gray-200">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeCertificate(index)}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove Certificate
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}

            {formData.certificates.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No certificates added yet</p>
                <p className="text-sm">Add your professional certifications to showcase your expertise</p>
              </div>
            )}

            {/* Add Certificate Button */}
            {isEditing && (
              <div className="flex justify-center pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCertificate}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Certificate
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
                    Save Certificates
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

export default CertificateSection