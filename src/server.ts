import app from "./app";
import http from "http";
import cluster from "cluster";
import os from "os";
import Logger from "./utils/logger";
import connection from "./config/db.config";
import { initializeWebSocket } from "./socket/index.socket";
import { envConfig } from "./config/env.config";

// Check if the current process is the master process
if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  Logger.info(`Master Server Pid ${process.pid} is running...😄`);

  // Fork workers based on the number of CPUs
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Listen for dying workers and restart them
  cluster.on("exit", (worker, code, signal) => {
    Logger.error(`Worker ${worker.process.pid} died`);
    Logger.info("Restarting worker...");
    cluster.fork();
  });
} else {
  // This is the worker process, it will act as a server
  const server: http.Server = http.createServer(app);
  const port = envConfig.Port || 3000;

  // start server and connect db
  function startServer(port: number | undefined) {
    try {
      connection
        .then(() => {
          Logger.info("Connected to MongoDB Database...🔥");
          server.listen(port, () => {
            Logger.info(
              `Connected to Server on http://localhost:${port} ...🚀 and Worker ${process.pid} started...⏳️`
            );
            const error = false;
            if (error) {
              Logger.error("Unable to connect Server...😴");
            }
          });
          initializeWebSocket(server);
        })
        .catch((err) => {
          Logger.error("Unable to connect MongoDB...🥱", err);
        });
    } catch (error) {
      Logger.error("Something went wrong...🥲", error);
    }
  }

  startServer(port);
}
