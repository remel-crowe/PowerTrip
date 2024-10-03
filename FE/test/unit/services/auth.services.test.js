import {
  login,
  register,
  changePassword,
} from "../../../src/services/auth.service.js";
import { describe, expect, it, vi } from "vitest";

import axios from "axios";

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

describe("auth.services", () => {
  describe("login", () => {
    it("should return a token if the login is successful", async () => {
      const email = "ilovecarsa@gmail.com";
      const password = "password123!";
      const URL = "http://localhost:3000/auth/login";
      const spy = vi.spyOn(axios, "post").mockResolvedValue({
        token: "exb123",
      });
      await login(email, password);
      expect(spy).toHaveBeenCalledWith(URL, { email, password });
      spy.mockRestore();
    });

    it("should throw an error if the login is unsuccessful", async () => {
      const email = "";
      const password = "";
      const spy = vi
        .spyOn(axios, "post")
        .mockRejectedValue(new Error("Request failed with status code 400"));
      try {
        await login(email, password);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
      spy.mockRestore();
    });
  });

  describe("register", () => {
    it("should make a post request with the passed arguments", async () => {
      const name = "testname";
      const email = "testuser@gmail.com";
      const password = "Password123!";
      const URL = "http://localhost:3000/auth/register";
      const mockResponse = { data: { message: "Mock response data" } };
      const spy = vi.spyOn(axios, "post").mockResolvedValue(mockResponse);
      await register(name, email, password);
      expect(spy).toHaveBeenCalledWith(URL, { name, email, password });
      spy.mockRestore();
    });

    it("Should return the response data if the request is successful", async () => {
      const name = "testname";
      const email = "testuser56@gmail.com";
      const password = "12345";
      const response = { data: { message: "User created successfully" } };
      const spy = vi.spyOn(axios, "post").mockResolvedValue(response);
      const result = await register(name, email, password);
      expect(result).toEqual(response.data);
      spy.mockRestore();
    });
  });

  describe("changePassword", () => {
    const URL = "http://localhost:3000/auth/change-password";
    const oldPassword = "oldPassword1!";
    const newPassword = "newPassword1!";

    it("Should make a patch request with the passed arguments", async () => {
      const mockResponse = {
        data: { message: "Password changed successfully" },
      };
      const tokenSpy = vi
        .spyOn(localStorage, "getItem")
        .mockReturnValue("token");
      const spy = vi.spyOn(axios, "patch").mockResolvedValue(mockResponse);
      //act
      const res = await changePassword(oldPassword, newPassword);

      //assert
      expect(res).toBe(mockResponse.data);
      expect(spy).toHaveBeenCalledWith(
        URL,
        { oldPassword, newPassword },
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
      const spy = vi.spyOn(axios, "patch").mockRejectedValue("error");
      //act
      try {
        await changePassword(oldPassword, newPassword);
      } catch (error) {
        //assert
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(
          "An error occurred while changing the password"
        );
      }

      spy.mockRestore();
    });

    it("should return an error if the token is not found", async () => {
      //arrange
      const tokenSpy = vi.spyOn(localStorage, "getItem").mockReturnValue(null);
      try {
        await changePassword(oldPassword, newPassword);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(
          "An error occurred while changing the password"
        );
      }
    });
  });
});
