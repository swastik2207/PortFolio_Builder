// src/lib/defaultPortfolio.ts

export const createDefaultPortfolio = ({ username, email }: { username: string, email: string }) => ({
    username,
    email,
    fullName: null,
    country: null,
    state: null,
    city: null,
    profilePicUrl: null,
    bio: null,
    openRouterApiKey: null, // Added OpenRouter API key field
    socialLinks: [],
    skills: [],
    projects: [],
    experiences: [],
    education: [],
    certificates: []
})

// Helper function to format MongoDB data for frontend (convert $numberInt, $date, etc.)
export const formatPortfolioFromDB = (portfolio: any) => {
    return {
        ...portfolio,
        openRouterApiKey: portfolio.openRouterApiKey || null, // Handle OpenRouter API key
        skills: portfolio.skills?.map((skill: any) => ({
            ...skill,
            confidence: typeof skill.confidence === 'object' && skill.confidence.$numberInt 
                ? parseInt(skill.confidence.$numberInt) 
                : skill.confidence
        })) || [],
        projects: portfolio.projects?.map((project: any) => ({
            ...project,
            endDate: project.endDate === 'PRESENT' ? '' : project.endDate
        })) || [],
        experiences: portfolio.experiences?.map((experience: any) => ({
            ...experience,
            endDate: experience.endDate === 'PRESENT' ? null : experience.endDate
        })) || [],
        education: portfolio.education?.map((edu: any) => ({
            ...edu,
            endDate: edu.endDate === 'PRESENT' ? null : edu.endDate
        })) || [],
        // Convert MongoDB timestamps to JavaScript Date objects
        createdAt: portfolio.createdAt?.$date?.$numberLong 
            ? new Date(parseInt(portfolio.createdAt.$date.$numberLong))
            : portfolio.createdAt,
        updatedAt: portfolio.updatedAt?.$date?.$numberLong 
            ? new Date(parseInt(portfolio.updatedAt.$date.$numberLong))
            : portfolio.updatedAt
    }
}

// Helper function to format portfolio data for MongoDB storage
export const formatPortfolioForDB = (portfolio: any) => {
    return {
        ...portfolio,
        openRouterApiKey: portfolio.openRouterApiKey || null, // Handle OpenRouter API key for DB storage
        skills: portfolio.skills?.map((skill: any) => ({
            ...skill,
            confidence: { $numberInt: skill.confidence.toString() }
        })) || [],
        projects: portfolio.projects?.map((project: any) => ({
            ...project,
            endDate: project.endDate === '' ? 'PRESENT' : project.endDate
        })) || [],
        experiences: portfolio.experiences?.map((experience: any) => ({
            ...experience,
            endDate: experience.endDate === null ? 'PRESENT' : experience.endDate
        })) || [],
        education: portfolio.education?.map((edu: any) => ({
            ...edu,
            endDate: edu.endDate === null ? 'PRESENT' : edu.endDate
        })) || [],
        // Add updatedAt timestamp when saving
        updatedAt: { $date: { $numberLong: new Date().getTime().toString() } }
    }
}