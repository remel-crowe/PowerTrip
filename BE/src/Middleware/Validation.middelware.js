import { body, header, validationResult } from "express-validator";

import User from "../models/User.model.js";

export default class ValidationMiddleware {
  static handleValidationError(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ Error: errors.array()[0].msg });
    }
    next();
  }

  static validateSignUp() {
    try {
      return [
        body("name").trim().exists().isLength({ min: 3 }).escape(),
        body("email")
          .trim()
          .exists()
          .isEmail()
          .normalizeEmail()
          .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
              return Promise.reject("Email already exists, please login.");
            }
          }),
        body("password").trim().exists().isLength({ min: 8 }).escape(),
        ValidationMiddleware.handleValidationError,
      ];
    } catch (error) {
      throw new Error(error);
    }
  }

  static validateSignIn() {
    return [
      body("email").trim().exists().isEmail().normalizeEmail(),
      body("password").trim().exists({ checkFalsy: true }).escape(),
      ValidationMiddleware.handleValidationError,
    ];
  }

  static validateChangePassword() {
    return [
      header("x-access-token").trim().exists({ checkFalsy: true }),
      body("oldPassword").trim().exists({ checkFalsy: true }).escape(),
      body("newPassword").trim().exists({ checkFalsy: true }).escape(),
      ValidationMiddleware.handleValidationError,
    ];
  }
}
