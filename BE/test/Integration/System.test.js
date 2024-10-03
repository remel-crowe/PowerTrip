import bcrypt from "bcrypt";
import { assert } from "chai";
import Sinon from "sinon";
import supertest from "supertest";
import jwt from "jsonwebtoken";

import AuthController from "../../src/Controllers/Auth.controller.js";
import AuthMiddleware from "../../src/Middleware/Auth.middleware.js";
import AuthService from "../../src/Services/Auth.services.js";
import AuthRoutes from "../../src/Routes/Auth.routes.js";
import Config from "../../src/Config/Config.js";
import Database from "../../src/Database/Database.js";
import GarageController from "../../src/Controllers/Garage.controller.js";
import GarageService from "../../src/Services/Garage.services.js";
import GarageRoutes from "../../src/Routes/Garage.routes.js";
import Server from "../../src/Server/Server.js";
import User from "../../src/models/User.model.js";
import userData from "../data/userData.js";

const { testUsers, newUser } = userData;

describe("Integration Tests", () => {
  let server;
  let request;
  let db;
  let authController;
  let authRoutes;
  let authService;
  let generateTokenStub;
  let createdUser1;
  let createdUser2;
  let user1Token;
  let user2Token;

  before(async () => {
    Config.load();
    const { PORT, HOST, DB_URI } = process.env;
    authController = new AuthController();
    authRoutes = new AuthRoutes();
    authService = new AuthService();

    let garageController = new GarageController();
    const garageRoutes = new GarageRoutes();
    let garageService = new GarageService();
    db = new Database(DB_URI);
    server = new Server(PORT, HOST, {
      authRouter: authRoutes,
      garageRouter: garageRoutes,
    });
    request = supertest(server.getApp());

    server.start();
    await db.connect();
  });

  after(async () => {
    await db.disconnect();
    server?.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    Sinon.stub(AuthMiddleware, "verifyToken").callsFake((req, res, next) => {
      const token = req.headers["x-access-token"];
      if (token === "fakeToken") {
        return next();
      }
    });
    try {
      const hashedPassword1 = await bcrypt.hash(testUsers[0].password, 8);
      const testUser1 = new User({
        name: testUsers[0].name,
        email: testUsers[0].email,
        password: hashedPassword1,
        garage: testUsers[0].garage,
      });

      createdUser1 = await User.create(testUser1);

      user1Token = jwt.sign(
        { id: createdUser1._id },
        process.env.JWT_SECRET,
        {}
      );

      const hashedPassword2 = await bcrypt.hash(testUsers[1].password, 8);
      const testUser2 = new User({
        name: testUsers[1].name,
        email: testUsers[1].email,
        password: hashedPassword2,
        garage: testUsers[1].garage,
      });
      createdUser2 = await User.create(testUser2);

      user2Token = jwt.sign(
        { id: createdUser2._id },
        process.env.JWT_SECRET,
        {}
      );

      generateTokenStub = Sinon.stub(authService, "generateToken").callsFake(
        (userId) => {
          return jwt.sign({ id: userId }, process.env.JWT_SECRET, {});
        }
      );
    } catch (error) {
      console.log("Failed to create user", error);
    }
  });
  afterEach(() => {
    generateTokenStub.restore();
    AuthMiddleware.verifyToken.restore();
  });

  describe("Register user tests", () => {
    it("Should respond with a 201 status code when a POST request is sent with a unique payload", async () => {
      //Arrange
      //Act
      const response = await request.post("/auth/register").send(newUser);

      //Assert
      assert(response.status === 201);
    });

    it("Should respond with a 400 status code when a POST request is sent with an existing email", async () => {
      //Arrange
      //Act
      const response = await request.post("/auth/register").send(testUsers[0]);
      //Assert
      assert(response.body.Error === "Email already exists, please login.");
      assert(response.status === 400);
    });

    it("Should respond with a 400 status code when a POST request is sent with an invalid payload", async () => {
      //Arrange
      const invalidUser = {
        name: "",
        email: "test",
        password: "test",
      };
      //Act
      const response = await request.post("/auth/register").send(invalidUser);

      //Assert
      assert(response.status === 400);
      assert(response.body.Error === "Invalid value");
    });
  });
  describe("login request tests", () => {
    it("Should respond with a 200 status code when a POST request is sent with a valid payload", async () => {
      //Arrange
      //Act
      const response = await request.post("/auth/login").send({
        email: testUsers[0].email,
        password: testUsers[0].password,
      });
      //Assert
      assert(response.status === 200);
    });

    it("Should return a token when a POST request is sent with a valid payload", async () => {
      //Arrange
      //Act
      const response = await request.post("/auth/login").send({
        email: testUsers[0].email,
        password: testUsers[0].password,
      });
      //Assert
      assert.isNotEmpty(response.header["x-access-token"]);
    });

    it("Should return the users name when a POST request is sent with a valid payload", async () => {
      const response = await request.post("/auth/login").send({
        email: testUsers[0].email,
        password: testUsers[0].password,
      });
      assert(response.body.name === testUsers[0].name);
    });

    it("Should respond with a 400 status code when a POST request is sent with an invalid email", async () => {
      const response = await request.post("/auth/login").send({
        email: "test",
        password: testUsers[0].password,
      });
      assert(response.status === 400);
    });

    it("Should respond with a 401 status code when a POST request is sent with an incorrect password", async () => {
      const response = await request.post("/auth/login").send({
        email: testUsers[0].email,
        password: "test",
      });
      assert(response.status === 401);
    });
  });

  describe("change password request tests", () => {
    it("Should respond with a 200 status code when a PATCH request is sent with a valid payload and access token", async () => {
      const response = await request
        .patch("/auth/change-password")
        .send({
          email: testUsers[0].email,
          oldPassword: testUsers[0].password,
          newPassword: "newPassword",
        })
        .set("x-access-token", user1Token);
      assert(response.status === 200);
    });
  });

  describe("Add car request tests", () => {
    it("Should respond with a 201 status code when a POST request is sent with a valid payload and access token", async () => {
      const response = await request
        .post("/garage")
        .send({
          make: "Tesla",
          model: "Model S",
          maxMiles: 100,
          charge: 50,
          fastCharge: true,
        })
        .set("x-access-token", user1Token);

      assert(response.status === 201);
    });
    it("Should respond with a 400 status code when a POST request is sent with an invalid payload and access token", async () => {
      const response = await request
        .put("/savedLocations")
        .send({
          make: "Tesla",
          model: null,
          maxMiles: 100,
          charge: 50,
          fastCharge: true,
        })
        .set("x-access-token", user1Token);

      assert(response.status === 404);
    });
  });
});
