import { databaseName, mongoUri } from "@/env";
import { MongoClient } from "mongodb";

let mongoClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (mongoClient) {
    return mongoClient.db(databaseName);
  }

  try {
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    console.log("Connected to MongoDB");
    return mongoClient.db(databaseName);
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);

    throw error;
  }
}

export async function disconnectDatabase() {
  if (mongoClient) {
    await mongoClient.close();
    mongoClient = null;
  }
}