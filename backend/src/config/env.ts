import dotenv from "dotenv";
dotenv.config();

interface Env {
  PORT: string;
  MONGO_URI: string
}

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not defined in the environment variables');
}

export const env: Env = {
  PORT: process.env.PORT || "3000",
  MONGO_URI: process.env.MONGO_URI,
};
