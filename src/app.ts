import dotenv from "dotenv";
dotenv.config();

import express, { type Express } from "express";
import { prisma } from "./config/db";
import billingRouter from "./modules/billing/subscrition.routes";
import authRouter from "./modules/auth/auth.routes";
import planRouter from "./modules/plans/plan.routes";
import { errorHandler } from "./shared/error-handler";
import { jwtMiddleware } from "./middlewares/auth.middleware";


export const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.send("Pong");
});


app.use("/auth", authRouter);
app.use(jwtMiddleware, billingRouter);
app.use("/plans", jwtMiddleware, planRouter);
app.use(errorHandler);




process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;