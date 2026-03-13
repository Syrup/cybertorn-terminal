import { expect, test, describe } from "bun:test";
import { calculateBankTimeLeft, formatDuration } from "../bank-utils";

describe("Bank Timer Logic", () => {
  const mockNow = 1741444000; // Example current timestamp (March 2025)

  test("should handle future timestamp in seconds", () => {
    const sixDaysLater = mockNow + (6 * 86400); // 1741962400
    const result = calculateBankTimeLeft(sixDaysLater, mockNow);
    expect(result).toBe(6 * 86400);
    expect(formatDuration(result)).toBe("6d 0h");
  });

  test("should handle future timestamp in milliseconds", () => {
    const sixDaysLaterMs = (mockNow + (6 * 86400)) * 1000;
    const result = calculateBankTimeLeft(sixDaysLaterMs, mockNow);
    expect(result).toBe(6 * 86400);
    expect(formatDuration(result)).toBe("6d 0h");
  });

  test("should handle duration already in seconds", () => {
    const duration = 518400; // 6 days in seconds
    const result = calculateBankTimeLeft(duration, mockNow);
    expect(result).toBe(518400);
    expect(formatDuration(result)).toBe("6d 0h");
  });

  test("should return 0 (MATURED) for past timestamp", () => {
    const pastTime = mockNow - 1000;
    const result = calculateBankTimeLeft(pastTime, mockNow);
    expect(result).toBe(0);
    expect(formatDuration(result)).toBe("MATURED");
  });
});
