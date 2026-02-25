import express, { type Express } from "express";
import authRouter from "./modules/auth/auth.routes";
import { errorHandler } from "./shared/error-handler";
import dotenv from "dotenv";
import { prisma } from "./config/db"

dotenv.config();

export const app: Express = express();
app.use("/auth", authRouter);
app.use(errorHandler);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/health", (req, res) => {
  res.send("Pong");
});


process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;