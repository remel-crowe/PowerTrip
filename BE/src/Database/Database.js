import mongoose from "mongoose";

export default class Database {
  #uri;

  constructor(uri) {
    this.#uri = uri;
  }

  async connect() {
    try {
      await mongoose.connect(this.#uri);
      console.log("Database connected");
    } catch (error) {
      console.error("Database connection error", error);
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log("Database disconnected");
    } catch (error) {
      console.error("Database disconnection error", error);
    }
  }
}
