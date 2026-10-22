import dotenv from "dotenv";
import http from "http";
// import mongoose from "mongoose"
import connectToMongoDB from "./config/database";
import { createWebSocketServer } from "./infrastructure/websocket/websocket.server";

dotenv.config({ path: "./.env" });
import app from "./app";

const PORT = Number(process.env.PORT) || 3000;

connectToMongoDB();

const httpServer = http.createServer(app);
createWebSocketServer(httpServer);

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
//Errors outside Express
process.on("unhandledRejection", (err) => {
  // console.log(err.name, err.message)
  console.log("Unhandled rejection. Shutting down ...");

  httpServer.close(() => process.exit(1));
});
