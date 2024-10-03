import AuthService from "../Services/Auth.services.js";

export default class AuthController {
  #authService;

  constructor(service = new AuthService()) {
    this.#authService = service;
    this.register = this.register.bind(this);
  }

  register = async (req, res) => {
    try {
      const user = await this.#authService.register(req.body);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const user = await this.#authService.login(req.body);
      res.header("x-access-token", user.accessToken).status(200).json(user);
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  };

  changePassword = async (req, res) => {
    try {
      const user = await this.#authService.changePassword(
        req.user.id,
        req.body
      );
      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
}
