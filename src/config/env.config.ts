import * as dotenv from "dotenv";
dotenv.config();

export interface EnvConfig {
  Port: number;
  Mongo_Db_Name: string;
  Mongo_Db_Pass: string;
  Express_Secret: string;
  Jwt_Secret: string;
  Send_Otp: string;
  Cloudnary_Cloud_Name: string;
  Cloudnary_Api_Key: string;
  Cloudnary_Secret_key: string;
  Redis_Port: number;
  Redis_Host: string;
  Jwt_Expiry_Hours: string;
}

export const envConfig: EnvConfig = {
  Port: process.env.Port ? parseInt(process.env.Port, 10) : 5000,
  Mongo_Db_Name: process.env.Mongo_DB_Name || "localhost",
  Mongo_Db_Pass: process.env.Mongo_DB_Pass || "localhost",
  Express_Secret: process.env.Express_Secret || "defaultSecret",
  Jwt_Secret: process.env.Jwt_Secret || "defaultSecret",
  Send_Otp: process.env.Send_Otp || "defaultSecret",
  Cloudnary_Cloud_Name: process.env.Cloudnary_Cloud_Name || "defaultSecret",
  Cloudnary_Api_Key: process.env.Cloudnary_Api_Key || "defaultSecret",
  Cloudnary_Secret_key: process.env.Cloudnary_Secret_key || "defaultSecret",
  Redis_Host: process.env.Redis_Host || "default",
  Redis_Port: process.env.Redis_Port
    ? parseInt(process.env.Redis_Port, 10)
    : 6379,
  Jwt_Expiry_Hours: process.env.Jwt_Expiry_Hours || "default",
};
