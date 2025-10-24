import { describe, expect, it } from "vitest";
import { cn, formatTimeSpent } from "@/lib/shared/utils";

describe("formatTimeSpent", () => {
  it("should format seconds to minutes", () => {
    expect(formatTimeSpent(45)).toBe("1m");
  });

  it("should format minutes correctly", () => {
    expect(formatTimeSpent(90)).toBe("2m");
  });

  it("should format hours correctly", () => {
    expect(formatTimeSpent(3661)).toBe("1h 1m");
  });

  it("should handle zero", () => {
    expect(formatTimeSpent(0)).toBe("0m");
  });

  it("should handle exact minutes", () => {
    expect(formatTimeSpent(120)).toBe("2m");
  });

  it("should handle exact hours", () => {
    expect(formatTimeSpent(7200)).toBe("2h");
  });
});

describe("cn", () => {
  it("should merge class names", () => {
    const result = cn("class1", "class2");
    expect(result).toContain("class1");
    expect(result).toContain("class2");
  });

  it("should handle conditional classes", () => {
    const result = cn("base", false && "hidden", true && "visible");
    expect(result).toContain("base");
    expect(result).toContain("visible");
    expect(result).not.toContain("hidden");
  });

  it("should merge tailwind classes", () => {
    const result = cn("px-2", "px-4");
    expect(result).toBe("px-4");
  });
});
