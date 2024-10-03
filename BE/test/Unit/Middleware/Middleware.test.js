import { expect } from "chai";
import Sinon from "sinon";
import jwt from "jsonwebtoken";
import User from "../../../src/models/User.model.js";

import AuthMiddleware from "../../../src/Middleware/Auth.middleware.js";
import ValidationMiddleware from "../../../src/Middleware/Validation.middelware.js";
import { validationResult } from "express-validator";

describe("Middleware Tests", () => {
  describe("Auth Middleware", () => {
    let mockRequest;
    let mockResponse;
    let mockNext;

    beforeEach(() => {
      mockRequest = {
        headers: {
          "x-access-token": "fakeToken",
        },
      };

      mockResponse = {
        status: Sinon.stub().returnsThis(),
        json: Sinon.stub().returnsThis(),
      };

      mockNext = Sinon.stub();

      Sinon.restore();
    });

    it("Should return a 401 status when no token is provided", async () => {
      Sinon.stub(jwt, "verify").throws();
      await AuthMiddleware.verifyToken(mockRequest, mockResponse, mockNext);
      expect(mockResponse.status.calledWith(401)).to.be.true;
      expect(mockResponse.json.calledWith({ message: "Unauthorised" })).to.be
        .true;
    });

    it("should call next when a token is provided", async () => {
      Sinon.stub(jwt, "verify").returns({ id: 1 });
      await AuthMiddleware.verifyToken(mockRequest, mockResponse, mockNext);
      expect(mockNext.calledOnce).to.be.true;
    });
  });

  describe("Validation Middleware", () => {
    let mockRequest;
    let mockResponse;
    let mockNext;
    let userFindStub;

    beforeEach(() => {
      mockRequest = (body) => ({
        body,
      });

      mockResponse = () => {
        const res = {};
        res.status = Sinon.stub().returnsThis();
        res.json = Sinon.stub().returns(res);
        return res;
      };
      mockNext = Sinon.stub();

      userFindStub = Sinon.stub(User, "findOne");
    });

    afterEach(() => {
      Sinon.restore();
    });

    it("Should pass validation when a unique user is passed", async () => {
      const req = mockRequest({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      const res = mockResponse();
      const valudationChain = ValidationMiddleware.validateSignUp();
      const errors = validationResult(mockRequest);

      expect(errors.isEmpty()).to.be.true;
      userFindStub.restore();
    });

    it("Should return an error when a user with the same email already exists", async () => {
      userFindStub.returns(Promise.resolve({ email: "test@example.com" }));
      const req = mockRequest({
        name: "Test User",
        email: "test@example.com",
        password: "password123!",
      });

      const res = mockResponse();
      const validationChain = ValidationMiddleware.validateSignUp();
      const errors = validationResult(mockRequest);

      expect(errors.isEmpty()).to.be.true;
    });
  });
});
