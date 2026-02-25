import express, { type Express } from "express";
import authRouter from "./modules/auth/auth.routes";
import dotenv from "dotenv";

dotenv.config();

export const app: Express = express();
app.use(authRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/health", (req, res) => {
  res.send("Pong");
});
