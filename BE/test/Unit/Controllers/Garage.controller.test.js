import { expect } from "chai";
import sinon from "sinon";
import GarageController from "../../../src/Controllers/Garage.controller.js";

describe("Garage Controller", () => {
  let garageController;
  let mockedServices;

  let mockReq, mockRes, mockNext;

  mockRes = {
    status: sinon.stub().returnsThis(),
    json: sinon.spy(),
  };

  afterEach(() => {
    sinon.restore();
  });

  beforeEach(() => {
    mockedServices = {
      getCars: sinon.stub().returns({}),
      addCar: sinon.stub(),
      removeCar: sinon.stub().returns({}),
      updateBattery: sinon.stub(),
    };

    garageController = new GarageController(mockedServices);

    mockReq = {
      user: {
        id: 1,
      },
    };
  });

  describe("Get cars", () => {
    it("Should return a 200 status when getCars is called", async () => {
      await garageController.getCars(mockReq, mockRes);
      expect(mockRes.status.calledWith(200)).to.be.true;
    });

    it("Should return a 400 status and an error message", async () => {
      const error = new Error("Error getting cars");
      mockedServices.getCars.rejects(error);

      await garageController.getCars(mockReq, mockRes);

      expect(mockRes.status.calledWith(400)).to.be.true;
      expect(mockRes.json.calledWith({ message: error.message })).to.be.true;
    });
  });

  describe("Add car", () => {
    it("Should return a 201 status when addCar is called", async () => {
      await garageController.addCar(mockReq, mockRes);
      expect(mockRes.status.calledWith(201)).to.be.true;
    });

    it("Should return a 400 status and an error message", async () => {
      const error = new Error("Error adding car");
      mockedServices.addCar.rejects(error);

      await garageController.addCar(mockReq, mockRes);

      expect(mockRes.status.calledWith(400)).to.be.true;
      expect(mockRes.json.calledWith({ message: error.message })).to.be.true;
    });
  });

  describe("Remove car", () => {
    it("Should return a 204 status when removeCar is called", async () => {
      mockReq.params = { index: 1 };
      await garageController.removeCar(mockReq, mockRes);
      expect(mockRes.status.calledWith(204)).to.be.true;
    });

    it("Should return a 400 status and an error message", async () => {
      mockReq.params = { index: 1 };
      const error = new Error("Error removing car");
      mockedServices.removeCar.rejects(error);

      await garageController.removeCar(mockReq, mockRes);

      expect(mockRes.status.calledWith(400)).to.be.true;
      expect(mockRes.json.calledWith({ message: error.message })).to.be.true;
    });
  });

  describe("Update battery", () => {
    it("Should return a 204 status when updateBattery is called", async () => {
      await garageController.updateBattery(mockReq, mockRes);
      expect(mockRes.status.calledWith(200)).to.be.true;
    });

    it("Should return a 400 status and an error message", async () => {
      mockReq.params = { index: 1 };
      mockReq.body = { charge: "" };
      const error = new Error("Error updating battery");
      mockedServices.updateBattery.rejects(error);

      await garageController.updateBattery(mockReq, mockRes);

      expect(mockRes.status.calledWith(400)).to.be.true;
      expect(mockRes.json.calledWith({ message: error.message })).to.be.true;
    });

    it("Should return the cars when updateBattery is called", async () => {
      mockReq.params = { index: 1 };
      mockReq.body = { charge: 100 };
      mockedServices.updateBattery.resolves([{ charge: 100 }]);

      await garageController.updateBattery(mockReq, mockRes);

      expect(mockRes.status.calledWith(200)).to.be.true;
      expect(mockRes.json.calledWith([{ charge: 100 }])).to.be.true;
    });
  });
});
