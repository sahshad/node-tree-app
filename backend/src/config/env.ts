import dotenv from "dotenv";
dotenv.config();

interface Env {
  PORT: string;
  MONGO_URI: string
  CLIENT_URL: string
}

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not defined in the environment variables');
}

if(!process.env.CLIENT_URL){
  throw new Error('CLIENT_URL is not defined in the env file')
}

export const env: Env = {
  PORT: process.env.PORT || "3000",
  MONGO_URI: process.env.MONGO_URI,
  CLIENT_URL: process.env.CLIENT_URL,
};
