import { Router } from "express";
import { subscriptionController } from "./subscription.factory";

const billingRouter = Router();

billingRouter.get("/me/subscription", subscriptionController.getActiveSubscription);

export default billingRouter;