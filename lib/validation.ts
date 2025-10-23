import { z } from "zod";

export const ObjectIdSchema = z
  .string()
  .length(24, "Must be exactly 24 characters")
  .regex(/^[a-f\d]{24}$/i, "Must be a valid hex string");
