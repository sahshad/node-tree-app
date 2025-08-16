import express from "express";
import { env } from "./config/env";
import { connectDB } from "./config/db";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "hello from server" });
});

async function startServer() {
  try {
    await connectDB();
    app.listen(Number(env.PORT), () =>
      console.log(`Server running on port ${env.PORT}`)
    );
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
