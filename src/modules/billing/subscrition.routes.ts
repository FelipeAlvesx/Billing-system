import { Router } from "express";
import { subscriptionController } from "./subscription.factory";
import { billingGuard } from "./billing.guard";
import { jwtMiddleware } from "@/middlewares/auth.middleware";
import { FeatureKey } from "./billing.types";
import { prisma } from "@/config/db";

const billingRouter = Router();
const guard = billingGuard(prisma);


billingRouter.get("/me/subscription", subscriptionController.getActiveSubscription);

billingRouter.get("/exports/pdf",
    jwtMiddleware,
    guard.requireFeature(FeatureKey.BASIC_DASHBOARD),
    (_req, res) => {
      return res.status(200).json({ success: true, data: { ok: true, message: "PDF export stub" } });
    }
  );


export default billingRouter;