import jwt from "jsonwebtoken";

export default class AuthMiddleware {
  static async verifyToken(req, res, next) {
    try {
      const token = req.headers["x-access-token"];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id };
      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorised" });
    }
  }
}
