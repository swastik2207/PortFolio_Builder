// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  message: string
  portfolio: any
  conversationHistory: Message[]
}

export async function POST(request: NextRequest) {
  try {
    const { message, portfolio, conversationHistory }: ChatRequest = await request.json()

    // Validate required fields
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!portfolio?.openRouterApiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key is not configured. Please add your API key in the portfolio settings.' },
        { status: 400 }
      )
    }

    // Create system prompt with portfolio information
    const systemPrompt = createSystemPrompt(portfolio)

    // Prepare messages for OpenRouter
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-5), // Include last 5 messages for context
      { role: 'user', content: message }
    ]

    // Make request to OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${portfolio.openRouterApiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Portfolio Assistant',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages: messages,
        temperature: 0.7,
        max_tokens: 300, // Reduced from 1000 to keep responses concise
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenRouter API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to get response from AI service' },
        { status: response.status }
      )
    }

    const data = await response.json()

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return NextResponse.json(
        { error: 'Invalid response from AI service' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      response: data.choices[0].message.content
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function createSystemPrompt(portfolio: any): string {
  const {
    username,
    email,
    fullName,
    country,
    state,
    city,
    profilePicUrl,
    bio,
    socialLinks = [],
    skills = [],
    projects = [],
    experiences = [],
    education = [],
    certificates = []
  } = portfolio

  // Build location string
  const location = [city, state, country].filter(Boolean).join(', ')

  // Sort skills by confidence (highest first)
  const sortedSkills = [...skills].sort((a, b) => (b.confidence || 0) - (a.confidence || 0))

  // Format top skills (sorted by confidence)
  const topSkills = sortedSkills
    .filter((skill: any) => skill.top)
    .map((skill: any) => `${skill.name} (${skill.confidence}%)`)
    .join(', ')

  // Format all skills (sorted by confidence)
  const allSkills = sortedSkills
    .map((skill: any) => `${skill.name} (${skill.confidence}%)`)
    .join(', ')

  // Format top projects (detailed)
  const topProjects = projects
    .filter((p: any) => p.top)
    .map((project: any) =>
      `• *${project.name || project.title}*
  Description: ${project.description?.substring(0, 200)}${project.description?.length > 200 ? '...' : ''}
  Skills: ${(project.skills || []).map((s: any) => s.name).join(', ') || 'N/A'}
  Timeline: ${project.startDate || 'N/A'} - ${project.endDate || 'N/A'}
  Live: ${project.liveLink ? `#Live Demo|${project.liveLink}#` : 'N/A'} | GitHub: ${project.githubLink ? `#GitHub|${project.githubLink}#` : 'N/A'}
  Thumbnail: ${project.thumbnail || 'N/A'}
  Video: ${project.videoLink || 'N/A'}
  Contributions: ${project.contributions || 'N/A'}`
    ).join('\n\n')

  // Format all projects (detailed, up to 5 for brevity)
  const allProjects = projects.slice(0, 5).map((project: any) =>
    `• *${project.name || project.title}*
  Description: ${project.description?.substring(0, 120)}${project.description?.length > 120 ? '...' : ''}
  Skills: ${(project.skills || []).map((s: any) => s.name).join(', ') || 'N/A'}
  Timeline: ${project.startDate || 'N/A'} - ${project.endDate || 'N/A'}
  Live: ${project.liveLink ? `#Live Demo|${project.liveLink}#` : 'N/A'} | GitHub: ${project.githubLink ? `#GitHub|${project.githubLink}#` : 'N/A'}`
  ).join('\n\n')

  // Format experiences (detailed)
  const recentExperience = experiences.slice(0, 3).map((exp: any) =>
    `• *${exp.title}* at *${exp.companyName}*
  Type: ${exp.employeeType || 'N/A'}
  Duration: ${exp.startDate || 'N/A'} - ${exp.endDate || 'N/A'}
  Location: ${exp.location || 'N/A'} (${exp.locationType || 'N/A'})
  Company Website: ${exp.companyWebsite ? `#${exp.companyName}|${exp.companyWebsite}#` : 'N/A'}`
  ).join('\n\n')

  // Format education (detailed)
  const educationSummary = education.slice(0, 2).map((edu: any) =>
    `• *${edu.degree}* from *${edu.school}*
  Duration: ${edu.startDate || 'N/A'} - ${edu.endDate || 'N/A'}
  Grade: ${edu.grade || 'N/A'}`
  ).join('\n\n')

  // Format certificates (name and description only)
  const certificateSummary = certificates.slice(0, 3).map((cert: any) =>
    `• *${cert.name}*
  Description: ${cert.description?.substring(0, 150)}${cert.description?.length > 150 ? '...' : ''}`
  ).join('\n\n')

  // Social links summary (name and url only)
  const socialLinksSummary = socialLinks.map((link: any) =>
    `• ${link.name}: #${link.name}|${link.url}#`
  ).join('\n')

  // Get primary contact link
  const primaryContact = socialLinks.find((link: any) =>
    link.name.toLowerCase().includes('linkedin') ||
    link.name.toLowerCase().includes('email') ||
    link.name.toLowerCase().includes('portfolio')
  )

  // Format profile picture
  const profilePic = profilePicUrl ? `Profile Picture: ${profilePicUrl}` : 'Profile Picture: Not specified'

  // Format created/updated dates if present
  const createdAt = portfolio.createdAt ? `Created At: ${portfolio.createdAt}` : ''
  const updatedAt = portfolio.updatedAt ? `Updated At: ${portfolio.updatedAt}` : ''

  return `You are a professional AI assistant for *${fullName || username || 'the portfolio owner'}* (username: ${username || 'N/A'}).

PORTFOLIO SUMMARY:
- Username: ${username || 'Not specified'}
- Email: ${email || 'chatterjee.swastik022@gmail.com'}
- Full Name: ${fullName || 'Not specified'}
- Location: ${location || 'Not specified'}
- ${profilePic}
- Bio: ${bio ? bio.substring(0, 200) + (bio.length > 200 ? '...' : '') : 'No bio provided'}
- ${createdAt}
- ${updatedAt}

SOCIAL LINKS:
${socialLinksSummary || 'No social links listed'}

TOP SKILLS (sorted by confidence): ${topSkills || 'No top skills marked'}

NOTE: If the user asks for *all* skills, you can share this full list:
ALL SKILLS (sorted by confidence): ${allSkills || 'No skills listed'}

TOP PROJECTS (detailed):
${topProjects || 'No top projects listed'}

ALL PROJECTS (detailed):
${allProjects || 'No projects listed'}

RECENT EXPERIENCE (detailed):
${recentExperience || 'No experience listed'}

EDUCATION (detailed):
${educationSummary || 'No education listed'}

CERTIFICATES (detailed):
${certificateSummary || 'No certificates listed'}

CONTACT: ${primaryContact ? `${primaryContact.name}: #${primaryContact.name}|${primaryContact.url}#` : 'Check portfolio for contact info'}

FORMATTING INSTRUCTIONS:
- Use *text* to make important words/phrases bold (skills, names, technologies, degrees, company names, metrics)
- Use #link_text|actual_url# for clickable links
- Keep responses concise (2-3 sentences max unless user asks for more)
- Use bullet points (•) for lists when appropriate
- If a field is missing, say 'Not specified' or 'N/A'

EXAMPLES:
- "*Node.js* is his top skill with *100%* confidence"
- "Connect via #LinkedIn|https://linkedin.com/in/username#"
- "He works at *Google Inc* as a *Senior Developer*"
- "Graduated with *Computer Science* degree from *MIT*"

RESPONSE GUIDELINES:
- Be conversational and professional
- Focus on the most relevant information
- If asked about details not in summary, mention "I can share more about [topic] if you're interested"
- For contact, direct to the provided links using the # format
- Don't repeat information unnecessarily
- Be enthusiastic but not overly verbose

Remember: You represent ${fullName || username || 'this person'} professionally. Use the formatting markers to highlight important information and make links clickable.`
}