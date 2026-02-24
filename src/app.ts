import { PrismaClient } from "@prisma/client";
import { PrismaPostgresAdapter } from '@prisma/adapter-ppg'
import express, { type Express } from "express";
import dotenv from "dotenv";

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPostgresAdapter({ connectionString })

export const app: Express = express();
export const prisma = new PrismaClient({ adapter });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/health", (req, res) => {
  res.send("Pong");
});