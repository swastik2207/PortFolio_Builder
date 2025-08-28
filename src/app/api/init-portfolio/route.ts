import { currentUser } from '@clerk/nextjs/server'
import clientPromise from '@/lib/mongodb'
import { createDefaultPortfolio, formatPortfolioFromDB } from '@/lib/defaultPortfolio'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get current user
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Extract username and email
    const username = user.username ?? user.emailAddresses?.[0]?.emailAddress?.split('@')[0]
    const email = user.emailAddresses?.[0]?.emailAddress

    if (!username || !email) {
      return NextResponse.json({ error: 'User data incomplete' }, { status: 400 })
    }

    // Connect to MongoDB
    const dbClient = await clientPromise
    const db = dbClient.db('portfolio_db')
    const collection = db.collection('portfolios')

    // Check for existing portfolio
    let portfolio = await collection.findOne({ username })

    if (!portfolio) {
      // Create new portfolio using the clean template
      const newPortfolio = createDefaultPortfolio({ username, email })
      
      // Insert with automatic timestamp
      const result = await collection.insertOne({
        ...newPortfolio,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      // Fetch the newly created portfolio
      portfolio = await collection.findOne({ _id: result.insertedId })
    }

    // Format portfolio data for frontend (handle MongoDB specific types)
    const formattedPortfolio = formatPortfolioFromDB(portfolio)

    return NextResponse.json({ 
      success: true,
      portfolio: formattedPortfolio 
    })

  } catch (error: any) {
    console.error('Portfolio API Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error', 
        details: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      }, 
      { status: 500 }
    )
  }
}