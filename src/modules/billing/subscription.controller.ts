import { Request, Response } from "express";
import { SubscriptionService } from "./subscription.service";
import { Errors } from "@/shared/errors";

export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {}

    changePlan = async (req: Request, res: Response, next: Function) => {
        try {
            return res
                .status(200)
                .send(
                    await this.subscriptionService.changePlan(
                        req.user!.userEmail,
                        req.body.planCode,
                    ),
                );
        } catch (error) {
            return next(error);
        }
    };

    getActiveSubscription = async (
        req: Request,
        res: Response,
        next: Function,
    ) => {
        try {
            const userEmail = req.user?.userEmail;
            if (!userEmail) {
                return next(Errors.unauthenticated());
            }

            const subscription =
                await this.subscriptionService.getActiveSubscriptionByEmail(
                    userEmail,
                );

            if (!subscription) {
                return next(
                    Errors.notFound("Nenhuma subscription ativa encontrada"),
                );
            }

            return res.status(200).json(subscription);
        } catch (error) {
            return next(error);
        }
    };
}
