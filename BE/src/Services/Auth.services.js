import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export default class AuthService {
  generateToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });
  };

  register = async (user) => {
    const { name, email, password } = user;
    const hashedPassword = bcrypt.hashSync(password, 8);
    return await User.create({ name, email, password: hashedPassword });
  };

  login = async ({ email, password }) => {
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
      throw new Error("Invalid credentials");
    }

    const passwordMatch = bcrypt.compareSync(password, foundUser.password);

    if (passwordMatch) {
      const token = this.generateToken(foundUser);
      return {
        name: foundUser.name,
        accessToken: token,
        garage: foundUser.garage,
      };
    } else {
      throw new Error("Invalid credentials");
    }
  };

  changePassword = async (id, { oldPassword, newPassword }) => {
    const foundUser = await User.findById(id);
    if (!foundUser) {
      throw new Error("User not found");
    }

    const passwordMatch = await bcrypt.compare(oldPassword, foundUser.password);
    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 8);
    return await User.findByIdAndUpdate(id, { password: newPasswordHash });
  };
}
