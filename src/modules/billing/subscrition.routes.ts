import { Router } from "express";
import { subscriptionController } from "./subscription.factory";
import { billingGuard } from "./billing.guard";
import { jwtMiddleware } from "@/middlewares/auth.middleware";
import { FeatureKey, MetricKey } from "./billing.types";
import { prisma } from "@/config/db";
import { UsageService } from "../usage/usage.service";
import { UserRepo } from "@/repos/user.repo";

const billingRouter = Router();
const guard = billingGuard(prisma);
const usageService = new UsageService(prisma);
const userRepo = new UserRepo(prisma);

billingRouter.get(
    "/billing/me/subscription",
    subscriptionController.getActiveSubscription,
);

billingRouter.post(
    "/billing/change-plan",
    jwtMiddleware,
    subscriptionController.changePlan,
);

billingRouter.get(
    "/exports/pdf",
    jwtMiddleware,
    guard.requireFeature(FeatureKey.EXPORT_PDF),
    async (req, res) => {
        const userEmail = req.user?.userEmail;
        const user = await userRepo.findByEmail(userEmail!);

        await usageService.consume(user?.id, MetricKey.API_CALLS, 1);
        return res.status(200).json({
            success: true,
            data: { ok: true, message: "PDF export stub" },
        });
    },
);

export default billingRouter;
