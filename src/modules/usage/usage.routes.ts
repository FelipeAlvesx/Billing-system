import { Router } from "express";
import { usageController } from "./usage.factory";


const usageRouter = Router();


usageRouter.get("/my-usage", usageController.getMyUsage);



export { usageRouter };