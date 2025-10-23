import { MongoClient } from "mongodb";
import { databaseName, mongoUri } from "@/env";
import { DatabaseError } from "./errors";

let mongoClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (mongoClient) {
    return mongoClient.db(databaseName);
  }

  try {
    mongoClient = new MongoClient(mongoUri, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
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
