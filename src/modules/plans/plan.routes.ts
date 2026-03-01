import { Router } from "express";
import { planController } from "./plan.factory";

const planRouter = Router();


planRouter.get("/", planController.getPlans);


export default planRouter;