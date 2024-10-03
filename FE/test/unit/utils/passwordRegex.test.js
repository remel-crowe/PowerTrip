import regexCheck from "../../../src/utils/passwordRegex";
import { describe, expect, it } from "vitest";

describe("passwordRegex", () => {
  it("should return true if the password is valid", () => {
    // Arrange
    const password = "Password123!";

    // Act
    const isValid = regexCheck(password);

    // Assert
    expect(isValid).toBe(true);
  });

  it("should return false if the password is invalid", () => {
    // Arrange
    const password = "password";

    // Act
    const isValid = regexCheck(password);

    // Assert
    expect(isValid).toBe(false);
  });
});
