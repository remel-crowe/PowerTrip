import { Schema, model } from "mongoose";
import carSchema from "./Car.model.js";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  garage: [carSchema],
});

const User = model("User", userSchema);

export default User;
