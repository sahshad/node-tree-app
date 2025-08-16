import express from "express";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import cors from "cors";
import nodeRouter from "./routes/nodeRoutes";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/node/", nodeRouter);

async function startServer() {
  try {
    await connectDB();
    app.listen(Number(env.PORT), () => console.log(`Server running on port ${env.PORT}`));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
