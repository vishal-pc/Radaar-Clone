import Redis from "ioredis";
import Logger from "../../utils/logger";
import { envConfig } from "../../config/env.config";

// Configure Redis client
const redisClient = new Redis({
  host: envConfig.Redis_Host,
  port: envConfig.Redis_Port,
  password: "", // Redis password, if set
});

// Handle connection error
redisClient.on("error", (err: any) => {
  Logger.error("Unabel to connect Redis Server...😮‍💨", err);
});

redisClient.on("connect", () => {
  Logger.info("Connected to Redis Server...🛸");
});

export default redisClient;
