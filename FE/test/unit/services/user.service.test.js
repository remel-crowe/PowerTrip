import axios from "axios";
import { expect, describe, it, vi, afterEach } from "vitest";

import {
  getCars,
  addCar,
  deleteCar,
  updateCharge,
} from "../../../src/services/user.service";

const localStorageMock = (function () {
  let store = {};
  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    clear: function () {
      store = {};
    },
  };
})();

global.localStorage = localStorageMock;

describe("User Service", () => {
  describe("getCars", () => {
    it("should make a GET request to /garage", async () => {
      const mockResponse = { data: "cars" };
      const tokenSpy = vi
        .spyOn(localStorage, "getItem")
        .mockReturnValue("token");
      const spy = vi.spyOn(axios, "get").mockResolvedValue(mockResponse);

      const res = await getCars();

      expect(res).toBe(mockResponse.data);
      expect(spy).toHaveBeenCalledWith("http://localhost:3000/garage", {
        headers: {
          "x-access-token": "token",
        },
      });

      spy.mockRestore();
    });

    it("should return an error if the request fails", async () => {
      const mockError = { response: { data: "error" } };
      const tokenSpy = vi
        .spyOn(localStorage, "getItem")
        .mockReturnValue("token");
      const spy = vi.spyOn(axios, "get").mockRejectedValue(mockError);

      const res = await getCars();

      expect(res).toBe(mockError.response.data);
      expect(spy).toHaveBeenCalledWith("http://localhost:3000/garage", {
        headers: {
          "x-access-token": "token",
        },
      });

      spy.mockRestore();
    });

    it("should return an error if the token is not found", async () => {
      //arrange
      const tokenSpy = vi.spyOn(localStorage, "getItem").mockReturnValue(null);
      //act
      const res = await getCars();
      //assert
      expect(res).toBeUndefined();
    });
  });

  describe("addCar", () => {
    it("should make a POST request to /garage", async () => {
      const mockResponse = { data: "car" };
      const tokenSpy = vi
        .spyOn(localStorage, "getItem")
        .mockReturnValue("token");
      const spy = vi.spyOn(axios, "post").mockResolvedValue(mockResponse);

      const res = await addCar("carData");

      expect(res).toBe(mockResponse.data);
      expect(spy).toHaveBeenCalledWith(
        "http://localhost:3000/garage",
        "carData",
        {
          headers: {
            "x-access-token": "token",
          },
        }
      );

      spy.mockRestore();
    });

    it("should return an error if the request fails", async () => {
      const mockError = { response: { data: "error" } };
      const tokenSpy = vi
        .spyOn(localStorage, "getItem")
        .mockReturnValue("token");
      const spy = vi.spyOn(axios, "post").mockRejectedValue(mockError);

      const res = await addCar("carData");

      expect(res).toBe(mockError.response.data);
      expect(spy).toHaveBeenCalledWith(
        "http://localhost:3000/garage",
        "carData",
        {
          headers: {
            "x-access-token": "token",
          },
        }
      );

      spy.mockRestore();
    });

    it("should return an error if the token is not found", async () => {
      //arrange
      const tokenSpy = vi.spyOn(localStorage, "getItem").mockReturnValue(null);
      //act
      const res = await addCar("carData");
      //assert
      expect(res).toBeUndefined();
    });
  });

  describe("deleteCar", () => {
    const index = 1;
    const URL = `http://localhost:3000/garage/${index}`;

    it("should make a DELETE request to /garage", async () => {
      const mockResponse = { data: "success" };
      const tokenSpy = vi
        .spyOn(localStorage, "getItem")
        .mockReturnValue("token");
      const spy = vi.spyOn(axios, "delete").mockResolvedValue(mockResponse);

      const res = await deleteCar(index);

      expect(res).toBe(mockResponse.data);
      expect(spy).toHaveBeenCalledWith(URL, {
        headers: {
          "x-access-token": "token",
        },
      });

      spy.mockRestore();
    });

    it("should return an error if the request fails", async () => {
      //arrange
      const tokenSpy = vi
        .spyOn(localStorage, "getItem")
        .mockReturnValue("token");
      const spy = vi.spyOn(axios, "delete").mockRejectedValue("error");
      //act
      const res = await deleteCar(index);

      //assert
      expect(res).toBeUndefined();
      spy.mockRestore();
    });

    it("should return an error if the token is not found", async () => {
      //arrange
      const tokenSpy = vi.spyOn(localStorage, "getItem").mockReturnValue(null);
      //act
      const res = await deleteCar(index);
      //assert
      expect(res).toBeUndefined();
    });
  });

  describe("updateCharge", () => {
    const index = 1;
    const charge = 100;
    const URL = `http://localhost:3000/garage/${index}`;

    it("should make a PUT request to /garage", async () => {
      //arrange
      const mockResponse = { data: "success" };
      const tokenSpy = vi
        .spyOn(localStorage, "getItem")
        .mockReturnValue("token");
      const spy = vi.spyOn(axios, "put").mockResolvedValue(mockResponse);
      //act
      const res = await updateCharge(index, charge);
      //assert
      expect(res).toBe(mockResponse.data);
      expect(spy).toHaveBeenCalledWith(
        URL,
        { charge },
        {
          headers: {
            "x-access-token": "token",
          },
        }
      );
      spy.mockRestore();
    });

    it("should return an error if the request fails", async () => {
      //arrange
      const tokenSpy = vi
        .spyOn(localStorage, "getItem")
        .mockReturnValue("token");
      const spy = vi.spyOn(axios, "put").mockRejectedValue("error");
      //act
      const res = await updateCharge(index, charge);
      //assert
      expect(res).toBeUndefined();
      spy.mockRestore();
    });

    it("should return an error if the token is not found", async () => {
      //arrange
      const spy = vi.spyOn(localStorage, "getItem").mockReturnValue(null);
      //act
      try {
        await updateCharge(index, charge);
      } catch (error) {
        //assert
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("Token not found");
      }
    });
  });
});
