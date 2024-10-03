import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fetchLocation from "../../../src/services/location.service";

// Setup function to mock navigator.geolocation
function setupGeolocationMock() {
  Object.defineProperty(global.navigator, "geolocation", {
    value: {
      getCurrentPosition: vi.fn(),
    },
    writable: true,
  });
}

describe("fetchLocation", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Setup the geolocation mock
    setupGeolocationMock();
  });

  it("should successfully fetch location", async () => {
    // Mock successful geolocation retrieval
    navigator.geolocation.getCurrentPosition.mockImplementation((success) =>
      success({
        coords: {
          latitude: 51.1,
          longitude: 45.3,
        },
      })
    );

    const location = await fetchLocation();
    expect(location).toEqual({ latitude: 51.1, longitude: 45.3 });
  });

  it("should handle geolocation error", async () => {
    // Mock geolocation error
    navigator.geolocation.getCurrentPosition.mockImplementation((_, error) =>
      error(new Error("User denied Geolocation"))
    );

    const location = await fetchLocation();

    expect(location).toBe("User denied Geolocation");
  });

  it("should handle when geolocation is not supported", async () => {
    // Simulate geolocation not supported by deleting the mock
    Object.defineProperty(global.navigator, "geolocation", {
      value: undefined,
      writable: true,
    });

    const location = await fetchLocation();
    expect(location).toBeUndefined();
  });
});
