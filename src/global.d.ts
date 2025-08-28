// global.d.ts
import type { MongoClient } from 'mongodb'

declare global {
  // Allow global._mongoClientPromise in development
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

export {}
