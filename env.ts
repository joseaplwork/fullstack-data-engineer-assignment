import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  DATABASE_NAME: z.string().min(1, "DATABASE_NAME is required"),
});

export const env = EnvSchema.parse(process.env);
export const isDevelopment = env.NODE_ENV !== "production";
export const mongoUri = env.MONGODB_URI;
export const databaseName = env.DATABASE_NAME;
