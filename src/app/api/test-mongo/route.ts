// src/app/api/test-mongo/route.ts
import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function GET() {

  const client = await clientPromise
  const db = client.db('sample_mflix')
  const collections = await db.listCollections().toArray()

  return NextResponse.json({ collections })
}
