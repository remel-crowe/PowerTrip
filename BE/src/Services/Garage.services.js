import User from "../models/User.model.js";

export default class GarageService {
  findUser = async (id) => {
    const foundUser = await User.findById(id);
    if (!foundUser) throw new Error("404: User not found");
    return foundUser;
  };

  getCars = async (id) => {
    const foundUser = await this.findUser(id);
    return foundUser.garage;
  };

  addCar = async (id, car) => {
    const foundUser = await this.findUser(id);
    foundUser.garage.push(car);
    await foundUser.save();
    return foundUser.garage;
  };

  removeCar = async (id, index) => {
    const foundUser = await this.findUser(id);
    foundUser.garage.splice(index, 1);
    await foundUser.save();
    return foundUser.garage;
  };

  updateBattery = async (id, index, charge) => {
    const foundUser = await this.findUser(id);
    foundUser.garage[index].charge = charge;
    await foundUser.save();
    return foundUser.garage;
  };
}
