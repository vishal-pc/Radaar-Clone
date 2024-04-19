import mongoose from "mongoose";
import { envConfig } from "./env.config";

const connection = mongoose.connect(
  `mongodb+srv://${envConfig.Mongo_Db_Name}:${envConfig.Mongo_Db_Pass}@chat.rylxpqx.mongodb.net/?retryWrites=true&w=majority&appName=Chat`
);
export default connection;
