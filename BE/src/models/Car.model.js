import { Schema } from "mongoose";

const carSchema = new Schema({
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  maxMiles: {
    type: Number,
    required: true,
  },
  charge: {
    type: Number,
    required: true,
  },
  fastCharge: {
    type: Boolean,
    required: true,
  },
});

export default carSchema;
