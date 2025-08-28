// types/portfolio.ts

// MongoDB ObjectId type
export interface ObjectId {
  $oid: string
}

// Social Links
export interface SocialLink {
  name: string
  logo: string
  url: string
}

// Skills
export interface Skill {
  type: 'Programming Language' | 'Framework' | 'Library' | 'Tool' | 'Database' | 'Cloud Platform' | 'Soft Skill' | 'DevOps' | 'Other'
  name: string
  description?: string
  logo: string
  confidence: number
  top?: boolean
}

// Project Skills (skills used in projects with logo)
export interface ProjectSkill {
  name: string
  logo: string
}

// Projects
export interface Project {
  name: string
  description: string
  thumbnail: string
  videoLink: string
  startDate: string
  endDate: string | Date | 'PRESENT' // 'PRESENT' or '' for ongoing projects
  liveLink: string
  githubLink: string
  skills: ProjectSkill[] // Changed from string[] to ProjectSkill[]
  contributions: string // Changed from string[] to string for textarea
  top?: boolean // Added for top project feature
}

// Work Experience
export interface Experience {
  title: string
  employeeType:
    | 'Full-time'
    | 'Part-time'
    | 'Contract'
    | 'Internship'
    | 'Freelance'
    | 'Volunteer'
  companyName: string
  companyLogoUrl?: string // Optional: URL to the company logo
  companyWebsite?: string // Optional: URL to the company website
  startDate: string | Date
  endDate: string | Date | 'PRESENT'// 'PRESENT' or '' for current job
  location: string
  locationType: 'On-site' | 'Remote' | 'Hybrid'
}

// Education
export interface Education {
  school: string
  schoolLogoUrl?: string
  degree: string
  startDate: string | Date
  endDate: string | Date | 'PRESENT' // 'PRESENT' or '' if ongoing
  grade?: string | null
}

// Certificates
export interface Certificate {
  name: string
  pic: string // certificate image URL
  description: string
}

// Main Portfolio Interface
export interface Portfolio {
  _id: ObjectId
  username: string
  email: string
  fullName: string | null
  country: string | null
  state: string | null
  city: string | null
  profilePicUrl: string | null
  openRouterApiKey?: string // Optional field for OpenRouter API key
  bio: string | null
  socialLinks: SocialLink[]
  skills: Skill[]
  projects: Project[]
  experiences: Experience[]
  education: Education[]
  certificates: Certificate[]
}

// Form Data Interfaces for each section
export interface PersonalInfoFormData {
  fullName: string
  country: string
  state: string
  city: string
  profilePicUrl: string
  bio: string
  socialLinks: SocialLink[]
  openRouterApiKey?: string // Optional field for OpenRouter API key
}

export interface SkillsFormData {
  skills: Skill[]
}

export interface ProjectsFormData {
  projects: Project[]
}

export interface ExperienceFormData {
  experiences: Experience[]
}

export interface EducationFormData {
  education: Education[]
}

export interface CertificatesFormData {
  certificates: Certificate[]
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PortfolioResponse extends ApiResponse<Portfolio> { }

// Context Types
export interface PortfolioContextType {
  portfolio: Portfolio | null
  loading: boolean
  error: string | null
  updatePortfolio: (data: Partial<Portfolio>) => Promise<void>
  refreshPortfolio: () => Promise<void>
}

// Component Props Types
export interface PersonalInfoSectionProps {
  portfolio: Portfolio
  onUpdate: (data: Partial<Portfolio>) => Promise<void>
}

export interface SkillsSectionProps {
  portfolio: Portfolio
  onUpdate: (data: Partial<Portfolio>) => Promise<void>
}

export interface ProjectsSectionProps {
  portfolio: Portfolio
  onUpdate: (data: Partial<Portfolio>) => Promise<void>
}

export interface ExperienceSectionProps {
  portfolio: Portfolio
  onUpdate: (data: Partial<Portfolio>) => Promise<void>
}

export interface EducationSectionProps {
  portfolio: Portfolio
  onUpdate: (data: Partial<Portfolio>) => Promise<void>
}

export interface CertificationsSectionProps {
  portfolio: Portfolio
  onUpdate: (data: Partial<Portfolio>) => Promise<void>
}

// Cloudinary Response Type
export interface CloudinaryResponse {
  secure_url: string
  public_id: string
  width: number
  height: number
  format: string
  resource_type: string
  [key: string]: any
}

// Social Platform Type for dropdowns
export interface SocialPlatform {
  name: string
  logo: string
}

// Skill Level Type for dropdowns
export interface SkillLevel {
  label: string
  value: number
}

// Employment Types
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance' | 'Volunteer'

// Location Types
export type LocationType = 'On-site' | 'Remote' | 'Hybrid'

// Date Utility Types
export type DateString = string | Date | null

// Common Form Field Types
export interface FormField {
  label: string
  name: string
  type: 'text' | 'email' | 'url' | 'date' | 'textarea' | 'select' | 'number'
  required?: boolean
  placeholder?: string
  options?: Array<{ label: string; value: string | number }>
}

// Validation Types
export interface ValidationError {
  field: string
  message: string
}

export interface FormValidation {
  isValid: boolean
  errors: ValidationError[]
}

// Type guards for runtime type checking
export const isPortfolio = (obj: any): obj is Portfolio => {
  return obj &&
    typeof obj._id === 'object' &&
    typeof obj._id.$oid === 'string' &&
    typeof obj.username === 'string' &&
    typeof obj.email === 'string' &&
    Array.isArray(obj.socialLinks) &&
    Array.isArray(obj.skills) &&
    Array.isArray(obj.projects) &&
    Array.isArray(obj.experiences) &&
    Array.isArray(obj.education) &&
    Array.isArray(obj.certificates)
}

export const isSocialLink = (obj: any): obj is SocialLink => {
  return obj &&
    typeof obj.name === 'string' &&
    typeof obj.logo === 'string' &&
    typeof obj.url === 'string'
}
 
export const isSkill = (obj: any): obj is Skill => {
  return obj &&
    typeof obj.name === 'string' &&
    typeof obj.logo === 'string' &&
    typeof obj.confidence === 'number'
}

export const isProjectSkill = (obj: any): obj is ProjectSkill => {
  return obj &&
    typeof obj.name === 'string' &&
    typeof obj.logo === 'string'
}

export const isProject = (obj: any): obj is Project => {
  return obj &&
    typeof obj.name === 'string' &&
    typeof obj.description === 'string' &&
    Array.isArray(obj.skills) &&
    obj.skills.every((skill: any) => isProjectSkill(skill))
}