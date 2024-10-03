import AuthRoutes from "./src/Routes/Auth.routes.js";
import GarageRoutes from "./src/Routes/Garage.routes.js";
import Config from "./src/config/Config.js";
import Database from "./src/Database/Database.js";
import Server from "./src/Server/Server.js";

Config.load();

const { PORT, HOST, DB_URI } = process.env;

const authRouter = new AuthRoutes();
const garageRouter = new GarageRoutes();
const routers = {
  authRouter,
  garageRouter,
};

const server = new Server(PORT, HOST, routers);
server.start();

const db = new Database(DB_URI);
await db.connect();
