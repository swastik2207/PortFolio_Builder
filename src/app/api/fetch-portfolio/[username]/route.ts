// app/api/fetch-portfolio/[username]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { formatPortfolioFromDB } from '@/lib/defaultPortfolio'

// Correct type definition for Next.js App Router (Vercel compatible)
interface RouteParams {
  username: string
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { username } = await params

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB_NAME || 'portfolio_db')
    const portfolioCollection = db.collection('portfolios')

    // Find portfolio by username
    const portfolio = await portfolioCollection.findOne({ 
      username: username.toLowerCase() 
    })

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      )
    }

    // Format portfolio data for frontend
    const formattedPortfolio = formatPortfolioFromDB(portfolio)

    // Remove sensitive data for public API (but keep openRouterApiKey for chatbot)
    const publicPortfolio = {
      ...formattedPortfolio,
      _id: undefined, // Remove MongoDB _id
      // Keep openRouterApiKey for chatbot functionality
      // You might want to remove this in a real production environment
      // and handle API key storage differently for security
    }

    return NextResponse.json({
      success: true,
      portfolio: publicPortfolio
    })

  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
