import GarageService from "../../../src/Services/Garage.services.js";
import sinon from "sinon";
import { expect } from "chai";
import mongoose from "mongoose";
import User from "../../../src/models/User.model.js";

describe("GarageService", () => {
  let garageService;
  let user;
  let testCar = {
    make: "Toyota",
    model: "Prius",
    maxMiles: 100,
    charge: 100,
    fastCharge: true,
  };

  beforeEach(() => {
    garageService = new GarageService();
    user = new User({
      _id: new mongoose.Types.ObjectId(), // Generate a valid ObjectId
      name: "John Doe",
      email: "test@mail.com",
      password: "123",
      garage: [],
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("findUser", () => {
    it("should return the user when the user is found", async () => {
      sinon.stub(User, "findById").returns(user);
      const result = await garageService.findUser(user._id);
      expect(result).to.equal(user);
    });

    it("should throw an error when the user is not found", async () => {
      sinon.stub(User, "findById").returns(null);
      try {
        await garageService.findUser(user._id);
      } catch (error) {
        expect(error.message).to.equal("404: User not found");
      }
    });
  });

  describe("getCars", () => {
    it("should return the user's garage", async () => {
      sinon.stub(garageService, "findUser").returns(user);
      user.garage = ["car1", "car2"];
      const result = await garageService.getCars(user._id);
      expect(result).to.equal(user.garage);
    });
  });

  describe("addCar", () => {
    it("should add a car to the user's garage", async () => {
      sinon.stub(garageService, "findUser").returns(user);
      sinon.stub(user, "save").resolves(true);
      const result = await garageService.addCar(user._id, testCar);
      expect(result[0]).to.include(testCar);
    });
  });

  describe("removeCar", () => {
    it("should remove a car from the user's garage", async () => {
      user.garage = [testCar];
      sinon.stub(garageService, "findUser").returns(user);
      sinon.stub(user, "save").resolves(true);
      const result = await garageService.removeCar(user._id, 0);
      expect(result).to.be.an("array").that.is.empty;
    });
  });

  describe("updateBattery", () => {
    it("should update the battery charge of a car in the user's garage", async () => {
      user.garage = [testCar];
      sinon.stub(garageService, "findUser").returns(user);
      sinon.stub(user, "save").resolves(true);
      const result = await garageService.updateBattery(user._id, 0, 50);
      expect(result[0].charge).to.equal(50);
    });
  });
});
