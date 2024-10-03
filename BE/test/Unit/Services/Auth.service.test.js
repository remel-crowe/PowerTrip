import { expect } from "chai";
import bcrypt from "bcrypt";
import Sinon from "sinon";
import AuthService from "../../../src/Services/Auth.services.js";
import User from "../../../src/models/User.model.js";
import userData from "../../data/userData.js";

describe("Authentication Services", () => {
  let authService;
  let userFindStub;
  let userCreateStub;
  let testUser;
  const { testUsers } = userData;

  beforeEach(() => {
    authService = new AuthService();
    const hashedPassword = bcrypt.hashSync(testUsers[0].password, 8);
    testUser = new User({
      name: testUsers[0].name,
      email: testUsers[0].email,
      password: hashedPassword,
    });
    userFindStub = Sinon.stub(User, "findOne").resolves(testUser);
    userCreateStub = Sinon.stub(User, "create").resolves(testUser);
  });

  afterEach(() => {
    userFindStub.restore();
    userCreateStub.restore();
  });

  describe("Register user tests", () => {
    it("Should return a user object when passed a name, email, and password", async () => {
      const user = await authService.register(testUser);
      expect(user).to.be.an("object");
      expect(user).to.have.property("name").to.equal(testUser.name);
      expect(user).to.have.property("email").to.equal(testUser.email);
    });

    it("Should return a user object with a hashed password", async () => {
      const user = await authService.register(testUser);
      expect(user)
        .to.have.property("password")
        .to.not.equal(testUsers[0].password);
    });
  });

  describe("Login user tests", () => {
    it("Should return a user object with a token when passed a valid email and password", async () => {
      const user = await authService.login({
        email: testUser.email,
        password: testUsers[0].password,
      });
      expect(user).to.have.property("name").to.equal(testUser.name);
      expect(user).to.have.property("accessToken");
    });

    it("should throw an error when given an invalid email", async () => {
      try {
        await authService.login({
          email: "",
          password: "password",
        });
      } catch (error) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal("Invalid credentials");
      }
    });

    it("should throw an error when given an invalid password", async () => {
      try {
        await authService.login({
          email: testUsers[0].email,
          password: "InvalidPassword",
        });
      } catch (error) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal("Invalid credentials");
      }
    });

    it("Should throw an error when the user is not found", async () => {
      userFindStub.resolves(null);
      try {
        await authService.login({
          email: testUsers[0].email,
          password: testUsers[0].password,
        });
      } catch (error) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal("Invalid credentials");
      }
    });
  });
});
