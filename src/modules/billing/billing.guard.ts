import { SubscriptionRepo } from "@/repos/subscription.repo";
import { PrismaClient } from "@prisma/client";
import { FeatureKey } from "./billing.types";
import { RequestHandler } from "express";
import { UserRepo } from "@/repos/user.repo";
import { Errors } from "@/shared/errors";

export function billingGuard(prisma: PrismaClient){
    const subRebo = new SubscriptionRepo(prisma);
    const userRepo = new UserRepo(prisma);


    function requireFeature(featureKey: FeatureKey): RequestHandler {
        return async (req, _res, next) => {
            try{
                const userEmail = req.user?.userEmail;
                const user = await userRepo.findByEmail(userEmail!);
                if(!user) throw Errors.unauthenticated;
            
                const subscription = await subRebo.getActiveWithPlanFeatures(user.id);
                if(!subscription) throw Errors.forbidden;

                if(subscription.status !== 'ACTIVE') {
                    throw Errors.forbidden;
                }
                const hasFeature = subscription.plan.features.some((f) => f.featureKey === featureKey);
                if(!hasFeature) throw Errors.featureNotAllowed(featureKey);

                return next();  

            }catch(error){
                return next(error);
            }
        }
    }

    return { requireFeature };

}