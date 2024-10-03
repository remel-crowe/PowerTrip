import locationToCoordinates from "../../../src/utils/locationToCoordinates.js";
import { describe, expect, it } from "vitest";

describe("locationToCoordinates", () => {
  it("should return coordinates for a given location", async () => {
    // Arrange
    const location = "Wellmeadow Road, UK";
    const expectedCoordinates = { latitude: 51.4434235, longitude: 0.0025127 };

    // Act
    const coordinates = await locationToCoordinates(location);

    // Assert
    expect(coordinates).toEqual(expectedCoordinates);
  });

  it("Should throw an error if the location is invalid", async () => {
    // Arrange
    const location = "Invalid location";
    const expectedError = new Error("Geocoding failed: ZERO_RESULTS");

    // Act & Assert
    await expect(locationToCoordinates(location)).rejects.toThrow(
      expectedError
    );
  });
});
