import mongoose from "mongoose";
import { envConfig } from "./env.config";

const db = envConfig.Mongo_Db;
const connection = mongoose.connect(db);
export default connection;
