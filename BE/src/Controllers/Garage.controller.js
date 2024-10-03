import GarageService from "../Services/Garage.services.js";

export default class GarageController {
  #Service;

  constructor(service = new GarageService()) {
    this.#Service = service;
    this.getCars = this.getCars.bind(this);
    this.addCar = this.addCar.bind(this);
    this.removeCar = this.removeCar.bind(this);
    this.updateBattery = this.updateBattery.bind(this);
  }

  getCars = async (req, res) => {
    try {
      const cars = await this.#Service.getCars(req.user.id);
      return res.status(200).json(cars);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  addCar = async (req, res) => {
    try {
      const cars = await this.#Service.addCar(req.user.id, req.body);
      return res.status(201).json(cars);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  removeCar = async (req, res) => {
    try {
      await this.#Service.removeCar(req.user.id, req.params.index);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  updateBattery = async (req, res) => {
    try {
      const cars = await this.#Service.updateBattery(
        req.user.id,
        req.params.index,
        req.body.charge
      );
      return res.status(200).json(cars);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
}
