// src/lib/mongodb.ts
import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = process.env.MONGODB_URI!

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Reuse connection in dev (hot reload safe)
if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options)
  global._mongoClientPromise = client.connect()
}

clientPromise = global._mongoClientPromise

export default clientPromise
