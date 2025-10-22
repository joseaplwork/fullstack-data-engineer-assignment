import { connectToDatabase, disconnectDatabase } from "../lib/mongodb";
import { generateSeedData } from "../lib/seed-data";

async function generateData() {
  try {
    const db = await connectToDatabase();

    await generateSeedData(db);
  } catch (error) {
    console.error("❌ Error generating data:", error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
}

generateData();
