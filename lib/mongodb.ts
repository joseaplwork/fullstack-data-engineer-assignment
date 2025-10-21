import { getDatabaseName, isDevelopment, mongoUri } from "@/env";
import { MongoClient } from "mongodb";

let mongoClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (!isDevelopment) {
    if (mongoClient) {
      try {
        await mongoClient.close();
      } catch {}
      mongoClient = null;
    }
  } else {
    if (mongoClient) {
      try {
        await mongoClient.db().admin().ping();
        return mongoClient.db(getDatabaseName());
      } catch {
        mongoClient = null;
      }
    }
  }

  try {
    const options = isDevelopment 
      ? {
          maxPoolSize: 5,
          minPoolSize: 0,
          maxIdleTimeMS: 30000,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        }
      : {
          maxPoolSize: 1,
          minPoolSize: 0,
          maxIdleTimeMS: 10000,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 20000,
          connectTimeoutMS: 10000,
          tls: true,
          tlsAllowInvalidCertificates: false,
          tlsAllowInvalidHostnames: false,
          maxConnecting: 1,
          family: 4,
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

export async function healthCheck(): Promise<boolean> {
  try {
    if (!mongoClient) return false;
    await mongoClient.db().admin().ping();
    return true;
  } catch {
    return false;
  }
}
