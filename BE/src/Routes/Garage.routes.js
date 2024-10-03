import { Router } from "express";
import GarageController from "../Controllers/Garage.controller.js";
import AuthMiddleware from "../Middleware/Auth.middleware.js";

export default class GarageRoutes {
  #router;
  #controller;
  #path;

  constructor() {
    this.#router = Router();
    this.#controller = new GarageController();
    this.#path = "/garage";
    this.#initialize();
  }

  #initialize() {
    // ROUTES: GET CARS, ADD CAR, UPDATE CAR, DELETE CAR

    // GET CARS
    this.#router.get("/", AuthMiddleware.verifyToken, this.#controller.getCars);

    // ADD CAR
    this.#router.post("/", AuthMiddleware.verifyToken, this.#controller.addCar);

    // UPDATE CAR
    this.#router.put(
      "/:index",
      AuthMiddleware.verifyToken,
      this.#controller.updateBattery
    );

    // DELETE CAR
    this.#router.delete(
      "/:index",
      AuthMiddleware.verifyToken,
      this.#controller.removeCar
    );
  }

  getRouter() {
    return this.#router;
  }

  getPath() {
    return this.#path;
  }
}
