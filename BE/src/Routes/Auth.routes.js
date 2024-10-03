import { Router } from "express";
import AuthController from "../Controllers/Auth.controller.js";
import ValidationMiddleware from "../Middleware/Validation.middelware.js";
import AuthMiddleware from "../Middleware/Auth.middleware.js";

export default class AuthRoutes {
  #router;
  #controller;
  #path;

  constructor() {
    this.#controller = new AuthController();
    this.#router = Router();
    this.#path = "/auth";
    this.#initialize();
  }

  #initialize() {
    // ROUTES: REGISTER, LOGIN, CHANGE PASSWORD, RESET PASSWORD
    this.#router.post(
      "/register",
      ValidationMiddleware.validateSignUp(),
      this.#controller.register
    );
    this.#router.post(
      "/login",
      ValidationMiddleware.validateSignIn(),
      this.#controller.login
    );

    this.#router.patch(
      "/change-password",
      ValidationMiddleware.validateChangePassword(),
      AuthMiddleware.verifyToken,
      this.#controller.changePassword
    );
  }

  getRouter() {
    return this.#router;
  }

  getPath() {
    return this.#path;
  }
}
