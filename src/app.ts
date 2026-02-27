import dotenv from "dotenv";
dotenv.config(); // DEVE vir ANTES de todos os outros imports

import express, { type Express } from "express";
import authRouter from "./modules/auth/auth.routes";
import { errorHandler } from "./shared/error-handler";
import { prisma } from "./config/db";
import { jwtMiddleware } from "./middlewares/auth.middleware";


export const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRouter);
app.use(errorHandler);


app.get("/health", jwtMiddleware, (req, res) => {
  res.send("Pong");
});


process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;