import { MongoClient } from "mongodb";
import { databaseName, mongoUri } from "@/env";
import { DatabaseError } from "./errors";

let mongoClient: MongoClient | null = null;

/**
 * Establishes a singleton MongoDB connection with connection pooling.
 *
 * Connection strategy:
 * - Singleton pattern: reuses client across serverless function invocations
 * - Connection pool: min 2, max 10 connections (prevents exhaustion)
 * - Timeouts: 5s server selection, 45s socket (balances responsiveness & reliability)
 *
 * Critical for serverless environments (Vercel, AWS Lambda) where connection
 * reuse is essential to avoid hitting MongoDB Atlas connection limits.
 *
 * @throws {DatabaseError} If connection fails after retries
 * @returns MongoDB database instance configured for the application
 */
export async function connectToDatabase() {
  if (mongoClient) {
    return mongoClient.db(databaseName);
  }

  try {
    mongoClient = new MongoClient(mongoUri, {
      maxPoolSize: 10, // Prevents connection exhaustion
      minPoolSize: 2, // Keeps connections warm (reduces cold start latency)
      serverSelectionTimeoutMS: 5000, // Fail fast on network issues
      socketTimeoutMS: 45000, // Allow time for slow queries
    });
    await mongoClient.connect();

    console.log("✅ Connected to MongoDB");

    return mongoClient.db(databaseName);
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB", error);

    mongoClient = null;
    throw new DatabaseError(
      "Failed to connect to database. Please check your connection settings.",
      error
    );
  }
}

export async function disconnectDatabase() {
  if (mongoClient) {
    await mongoClient.close();
    mongoClient = null;
  }
}
