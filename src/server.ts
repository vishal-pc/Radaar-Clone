import app from "./app";
import http from "http";
import Logger from "./utils/logger";
import connection from "./config/db.config";
import { initializeWebSocket } from "./socket/index.socket";
import { envConfig } from "./config/env.config";

// initialize http server
const server: http.Server = http.createServer(app);
const port = envConfig.Port || 3000;

// start server and connect db
function startServer(port: number | undefined) {
  try {
    connection
      .then(() => {
        Logger.info("Connected to MongoDb DataBase...🔥");
        server.listen(port, () => {
          Logger.info(`Connected to Server on http://localhost:${port} ...🚀`);
          const error = false;
          if (error) {
            Logger.error("Unabel to connect Server...😴");
          }
        });
        initializeWebSocket(server);
      })
      .catch((err) => {
        Logger.error("Unable to connect MongoDb...🥱", err);
      });
  } catch (error) {
    Logger.error("Something went wrong...🥲", error);
  }
}

startServer(port);
