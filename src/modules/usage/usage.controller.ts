import { UsageService } from "./usage.service";
import { Errors } from "@/shared/errors";
import type { Request, Response } from "express";

export class UsageController {
    constructor(private readonly usageService: UsageService) {}

    getMyUsage = async (req: Request, res: Response, next: Function) => {
        try {
            const userEmail = req.user?.userEmail;

            if (!userEmail) throw Errors.unauthenticated();
            const usage = await this.usageService.getMyUsage(userEmail!);

            return res.status(200).json({ success: true, usage });
        } catch (err) {
            return next(err);
        }
    };

    consume = async (req: Request, res: Response, next: Function) => {
        try {
            const { userId, metricKey, cost } = req.body;
            await this.usageService.consume(userId, metricKey, cost);
            return res.status(200).json({ success: true });
        } catch (err) {
            return next(err);
        }
    };
}
