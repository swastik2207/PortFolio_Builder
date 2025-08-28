// app/api/update-portfolio/route.ts
import { currentUser } from '@clerk/nextjs/server'
import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
  try {
    // Get current user
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Extract username
    const username = user.username ?? user.emailAddresses?.[0]?.emailAddress?.split('@')[0]
    
    if (!username) {
      return NextResponse.json({ error: 'User data incomplete' }, { status: 400 })
    }

    // Parse request body
    const updateData = await request.json()
    
    // Remove any fields that shouldn't be updated via this API
    const { _id, username: _username, email: _email, ...allowedUpdates } = updateData
    
    // Connect to MongoDB
    const dbClient = await clientPromise
    const db = dbClient.db('portfolio_db')
    const collection = db.collection('portfolios')

    // Update the portfolio
    const result = await collection.updateOne(
      { username }, // Find by username
      { 
        $set: {
          ...allowedUpdates,
          updatedAt: new Date() // Add timestamp
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
    }

    // Fetch and return updated portfolio
    const updatedPortfolio = await collection.findOne({ username })

    return NextResponse.json({ 
      success: true,
      portfolio: updatedPortfolio,
      message: 'Portfolio updated successfully'
    })

  } catch (error: any) {
    console.error('Update Portfolio API Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error.message 
      }, 
      { status: 500 }
    )
  }
}

// Optional: Handle PUT requests the same way
export async function PUT(request: Request) {
  return PATCH(request)
}