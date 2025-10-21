import { MongoClient } from "mongodb";
import { getDatabaseName, isDevelopment, mongoUri } from "@/env";

let mongoClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (mongoClient) {
    try {
      await mongoClient.db().admin().ping();
      return mongoClient.db(getDatabaseName());
    } catch {
      mongoClient = null;
    }
  }

  try {
    // Vercel-optimized connection options
    const options = {
      maxPoolSize: isDevelopment ? 5 : 1, // Vercel needs smaller pool
      minPoolSize: 0,
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      serverSelectionTimeoutMS: 5000, // How long to try selecting a server
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    mongoClient = new MongoClient(mongoUri, options);
    await mongoClient.connect();
    
    const dbName = getDatabaseName();
    console.log(`Connected to MongoDB - Database: ${dbName}`);
    
    return mongoClient.db(dbName);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    mongoClient = null;
    throw error;
  }
}

// Simple health check
export async function healthCheck(): Promise<boolean> {
  try {
    if (!mongoClient) return false;
    await mongoClient.db().admin().ping();
    return true;
  } catch {
    return false;
  }
}
