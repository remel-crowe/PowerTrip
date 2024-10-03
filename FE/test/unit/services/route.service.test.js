import { expect, it, describe, vi } from "vitest";
import axios from "axios";
import { fetchRouteData } from "../../../src/services/route.service";

describe("Route Service", () => {
  describe("fetchRouteData", () => {
    it("should make a GET request to the Mapbox API", async () => {
      const mockResponse = { data: { routes: ["route"] } };
      const spy = vi.spyOn(axios, "get").mockResolvedValue(mockResponse);

      const startCoords = { latitude: 1, longitude: 2 };
      const endCoords = { latitude: 3, longitude: 4 };
      const accessToken = "token";

      const res = await fetchRouteData(startCoords, endCoords, accessToken);

      expect(res).toBe(mockResponse.data.routes[0]);
      expect(spy).toHaveBeenCalledWith(
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/2,1;4,3?geometries=geojson&access_token=token`
      );

      spy.mockRestore();
    });

    it("should return error if the request fails", async () => {
      const mockError = { response: { data: "error" } };
      const spy = vi.spyOn(axios, "get").mockRejectedValue(mockError);

      const startCoords = { latitude: 1, longitude: 2 };
      const endCoords = { latitude: 3, longitude: 4 };
      const accessToken = "token";

      const res = await fetchRouteData(startCoords, endCoords, accessToken);

      expect(res).toBe("Error fetching route data");
      expect(spy).toHaveBeenCalledWith(
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/2,1;4,3?geometries=geojson&access_token=token`
      );

      spy.mockRestore();
    });
  });
});
