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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, Upload, User, Globe, MapPin, FileText, Camera, Edit, Save, X, Key, Info } from 'lucide-react'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

// Import types from your types file
import {
  Portfolio,
  SocialLink,
  PersonalInfoFormData,
  SocialPlatform,
  CloudinaryResponse,
  PersonalInfoSectionProps
} from '@/types/portfolio'
import Image from 'next/image'

function PersonalInfoSection({ portfolio, onUpdate }: PersonalInfoSectionProps) {
  const [formData, setFormData] = useState<PersonalInfoFormData>({
    fullName: '',
    country: '',
    state: '',
    city: '',
    profilePicUrl: '',
    bio: '',
    socialLinks: [],
    openRouterApiKey: '' // Added OpenRouter API key field
  })

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false)

  // Popular social media platforms with their predefined logo URLs
  const socialPlatforms: SocialPlatform[] = [
    {
      name: 'LinkedIn',
      logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/linkedin/linkedin-original.svg'
    },
    {
      name: 'GitHub',
      logo: 'https://www.svgrepo.com/show/439171/github.svg'
    },
    { 
      name: 'LeetCode',
      logo: 'https://cdn.iconscout.com/icon/free/png-512/free-leetcode-3521542-2944960.png'
    },
    { 
      name: 'GeekforGeeks',
      logo: 'https://media.geeksforgeeks.org/wp-content/uploads/20230403183704/gfg_logo.png'
    },
    { 
      name: 'Take-U-Forward',
      logo: 'https://yt3.ggpht.com/ytc/AMLnZu8mrNo5SSrwu9jvjmbPyFrqGVhRdGsJWrfErf28=s900-c-k-c0x00ffffff-no-rj'
    },
    {
      name: 'Twitter',
      logo: 'https://www.vectorlogo.zone/logos/twitter/twitter-official.svg'
    },
    {
      name: 'Instagram',
      logo: 'https://www.vectorlogo.zone/logos/instagram/instagram-icon.svg'
    },
    {
      name: 'Facebook',
      logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/facebook/facebook-original.svg'
    },
    {
      name: 'YouTube',
      logo: 'https://www.vectorlogo.zone/logos/youtube/youtube-icon.svg'
    },
    {
      name: 'Portfolio',
      logo: 'https://www.svgrepo.com/show/159310/portfolio.svg'
    },
    {
      name: 'Behance',
      logo: 'https://www.vectorlogo.zone/logos/behance/behance-icon.svg'
    },
    {
      name: 'Dribbble',
      logo: 'https://www.vectorlogo.zone/logos/dribbble/dribbble-icon.svg'
    },
    {
      name: 'Medium',
      logo: 'https://www.vectorlogo.zone/logos/medium/medium-icon.svg'
    },
    {
      name: 'Dev.to',
      logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/devicon/devicon-original.svg'
    },
    {
      name: 'Discord',
      logo: 'https://www.vectorlogo.zone/logos/discordapp/discordapp-tile.svg'
    },
    {
      name: 'Telegram',
      logo: 'https://www.vectorlogo.zone/logos/telegram/telegram-icon.svg'
    },
    {
      name: 'WhatsApp',
      logo: 'https://www.vectorlogo.zone/logos/whatsapp/whatsapp-icon.svg'
    },
    {
      name: 'TikTok',
      logo: 'https://www.vectorlogo.zone/logos/tiktok/tiktok-icon.svg'
    },
    {
      name: 'Other',
      logo: 'https://www.svgrepo.com/show/13650/link.svg'
    }
  ]

  // Load existing data when component mounts
  useEffect(() => {
    if (portfolio) {
      setFormData({
        fullName: portfolio.fullName || '',
        country: portfolio.country || '',
        state: portfolio.state || '',
        city: portfolio.city || '',
        profilePicUrl: portfolio.profilePicUrl || '',
        bio: portfolio.bio || '',
        socialLinks: portfolio.socialLinks || [],
        openRouterApiKey: portfolio.openRouterApiKey || '' // Load existing API key
      })
    }
  }, [portfolio])

  const handleInputChange = (field: keyof PersonalInfoFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB')
      return
    }

    setIsUploadingImage(true)

    try {
      const url = await uploadImageToCloudinary(file, 'portfolio/profile-pics')
      handleInputChange('profilePicUrl', url)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setIsUploadingImage(false)
      if (event.target) {
        event.target.value = ''
      }
    }
  }

  const addSocialLink = (): void => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        {
          name: '',
          logo: '',
          url: ''
        }
      ]
    }))
  }

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string): void => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      )
    }))
  }

  const removeSocialLink = (index: number): void => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }))
  }

  const handlePlatformSelect = (index: number, platformName: string): void => {
    const platform = socialPlatforms.find(p => p.name === platformName)
    if (platform) {
      updateSocialLink(index, 'name', platform.name)
      updateSocialLink(index, 'logo', platform.logo)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Filter out empty social links
      const filteredSocialLinks = formData.socialLinks.filter(
        link => link.name && link.url
      )

      const updatedData: Partial<Portfolio> = {
        fullName: formData.fullName,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        profilePicUrl: formData.profilePicUrl,
        bio: formData.bio,
        socialLinks: filteredSocialLinks,
        openRouterApiKey: formData.openRouterApiKey // Include OpenRouter API key in update
      }

      await onUpdate(updatedData)

      // Show success message (you can customize this)
      console.log('Personal info updated successfully!')

      // Exit editing mode after successful save
      setIsEditing(false)

    } catch (error) {
      console.error('Error updating personal info:', error)
      // Handle error (show toast notification, etc.)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditToggle = (): void => {
    if (isEditing) {
      // If cancelling edit, reset form data to original portfolio data
      if (portfolio) {
        setFormData({
          fullName: portfolio.fullName || '',
          country: portfolio.country || '',
          state: portfolio.state || '',
          city: portfolio.city || '',
          profilePicUrl: portfolio.profilePicUrl || '',
          bio: portfolio.bio || '',
          socialLinks: portfolio.socialLinks || [],
          openRouterApiKey: portfolio.openRouterApiKey || '' // Reset API key on cancel
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
            <User className="w-5 h-5" />
            Personal Information
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
          {/* Profile Picture */}
          <div className="space-y-2">
            <Label htmlFor="profilePic" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Profile Picture
            </Label>
            {/* Profile Picture Preview and Upload Controls */}
            <div className="flex flex-row items-start gap-6">
              {/* Profile Picture Preview */}
              <div className="space-y-2 flex-shrink-0">
                {formData.profilePicUrl ? (
                  <div className="relative">
                    <Image
                      src={formData.profilePicUrl}
                      alt="Profile"
                      width={160}
                      height={160}
                      className="w-40 h-40 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDIwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjY1IiByPSIyNSIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNzAgMTEwQzc5IDEwNSA5MiAxMDUgMTAwIDEwNUMxMDggMTA1IDEyMSAxMDUgMTMwIDExMEMxMzAgMTIwIDEzMCAxMzAgMTMwIDE0MEg3MEM3MCAxMzAgNzAgMTIwIDcwIDExMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Camera className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">No profile picture</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              {isEditing && (
                <div className="space-y-4 flex-1">
                  <div className="space-y-2">
                    <Label className="text-sm">Upload Profile Picture</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploadingImage}
                        className="hidden"
                        id="profilePicUpload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('profilePicUpload')?.click()}
                        disabled={isUploadingImage}
                        className="flex items-center gap-2"
                      >
                        {isUploadingImage ? (
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
                      Recommended: Square image, max 5MB
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Or Enter Image URL</Label>
                    <Input
                      id="profilePic"
                      type="url"
                      placeholder="https://example.com/profile.jpg"
                      value={formData.profilePicUrl}
                      onChange={(e) => handleInputChange('profilePicUrl', e.target.value)}
                      disabled={isUploadingImage}
                    />
                  </div>
                </div>
              )}

              {/* Display when not editing */}
              {!isEditing && (
                <div className="flex items-center justify-center">
                  <div className="text-sm text-gray-600">
                    {formData.profilePicUrl ? 'Profile picture set' : 'No profile picture'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              disabled={!isEditing}
              required
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Country
              </Label>
              <Input
                id="country"
                type="text"
                placeholder="Enter country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                State/Province
              </Label>
              <Input
                id="state"
                type="text"
                placeholder="Enter state/province"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                type="text"
                placeholder="Enter city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* OpenRouter API Key */}
          <div className="space-y-2">
            <Label htmlFor="openRouterApiKey" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              OpenRouter API Key
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6"
                onClick={() => window.open('https://openrouter.ai/keys', '_blank')}
                title="Get your OpenRouter API key"
              >
                <Info className="w-4 h-4 text-blue-500" />
              </Button>
            </Label>
            <Input
              id="openRouterApiKey"
              type="password"
              placeholder="Enter your OpenRouter API key"
              value={formData.openRouterApiKey}
              onChange={(e) => handleInputChange('openRouterApiKey', e.target.value)}
              disabled={!isEditing}
            />
            <p className="text-xs text-gray-500">
              This key will be stored securely and used for AI-powered features. 
              <a 
                href="https://openrouter.ai/keys" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:text-blue-600 underline ml-1"
              >
                Get your API key here
              </a>
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Bio
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself, your skills, and what you're passionate about..."
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              disabled={!isEditing}
              rows={4}
              className="resize-none"
              maxLength={500}
            />
            <p className="text-sm text-gray-500">
              {formData.bio.length}/500 characters
            </p>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Social Links</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSocialLink}
                disabled={!isEditing}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Social Link
              </Button>
            </div>

            {formData.socialLinks.map((link, index) => (
              <Card key={index} className="p-4 border-dashed">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Select
                      value={link.name}
                      onValueChange={(value) => handlePlatformSelect(index, value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {socialPlatforms.map((platform) => (
                          <SelectItem key={platform.name} value={platform.name}>
                            <div className="flex items-center gap-2">
                              <Image
                                src={platform.logo}
                                alt={platform.name}
                                width={24}
                                height={24}
                                className="w-4 h-4"
                                style={{ filter: 'invert(0.5)' }}
                              />
                              <span>{platform.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Profile URL</Label>
                    <Input
                      type="url"
                      placeholder="https://..."
                      value={link.url}
                      onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSocialLink(index)}
                      disabled={!isEditing}
                      className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {formData.socialLinks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No social links added yet</p>
                <p className="text-sm">Click "Add Social Link" to get started</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          {isEditing && (
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={isSubmitting || !formData.fullName}
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

export default PersonalInfoSection