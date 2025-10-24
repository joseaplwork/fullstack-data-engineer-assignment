import { describe, expect, it } from "vitest";

describe("MongoDB Module", () => {
  it("should export connectToDatabase function", async () => {
    const mongodb = await import("@/lib/data/connection");
    expect(mongodb.connectToDatabase).toBeDefined();
    expect(typeof mongodb.connectToDatabase).toBe("function");
  });

  it("should export disconnectDatabase function", async () => {
    const mongodb = await import("@/lib/data/connection");
    expect(mongodb.disconnectDatabase).toBeDefined();
    expect(typeof mongodb.disconnectDatabase).toBe("function");
  });
});
