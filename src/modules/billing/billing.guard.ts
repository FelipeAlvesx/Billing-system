import { SubscriptionRepo } from "@/repos/subscription.repo";
import { PrismaClient } from "@prisma/client";
import { FeatureKey, MetricKey } from "./billing.types";
import { RequestHandler } from "express";
import { UserRepo } from "@/repos/user.repo";
import { Errors } from "@/shared/errors";
import { UsageService } from "../usage/usage.service";

export function billingGuard(prisma: PrismaClient) {
    const subRebo = new SubscriptionRepo(prisma);
    const userRepo = new UserRepo(prisma);
    const usageService = new UsageService(prisma);

    function requireFeature(featureKey: FeatureKey): RequestHandler {
        return async (req, _res, next) => {
            try {
                const userEmail = req.user?.userEmail;
                const user = await userRepo.findByEmail(userEmail!);
                if (!user) throw Errors.unauthenticated();

                const subscription = await subRebo.getActiveWithPlanFeatures(
                    user.id,
                );
                if (!subscription) throw Errors.forbidden();

                if (subscription.status !== "ACTIVE") {
                    throw Errors.forbidden();
                }
                const hasFeature = subscription.plan.features.some(
                    (f) => f.featureKey === featureKey,
                );
                if (!hasFeature) throw Errors.featureNotAllowed(featureKey);

                return next();
            } catch (error) {
                return next(error);
            }
        };
    }

    function requireUsage(metricKey: MetricKey, cost: number): RequestHandler {
        return async (req, _res, next) => {
            try {
                const user = req.user;
                const getUser = await userRepo.findByEmail(
                    user?.userEmail || "",
                );
                if (!getUser) throw Errors.unauthenticated();
                await usageService.consume(getUser.id, metricKey, cost);
                return next();
            } catch (err) {
                return next(err);
            }
        };
    }

    return { requireFeature, requireUsage };
}
