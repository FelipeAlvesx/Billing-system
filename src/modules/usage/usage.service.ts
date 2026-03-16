import { SubscriptionRepo } from "@/repos/subscription.repo";
import { UsageRepo } from "@/repos/usage.repo";
import { UserRepo } from "@/repos/user.repo";
import { PrismaClient } from "@prisma/client";

export class UsageService {
    private subRepo: SubscriptionRepo;
    private usageRepo: UsageRepo;
    private userRepo: UserRepo;

    constructor(private readonly prisma: PrismaClient) {
        this.subRepo = new SubscriptionRepo(prisma);
        this.usageRepo = new UsageRepo(prisma);
        this.userRepo = new UserRepo(prisma);
    }

    private getCurrentPeriod() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        return {
            periodStart: new Date(year, month, 1),
            periodEnd: new Date(year, month + 1, 0),
        };
    }

    async consume(userId: any, metricKey: any, cost: any) {
        try {
            //get active subscription with plan features and limits
            const activeSubscription =
                await this.subRepo.findActiveByUserId(userId);
            console.log("Active subscription:", activeSubscription);

            const limits = activeSubscription?.plan.limits || [];

            //find the limit for the metricKey
            const limit = limits.find((l) => l.metricKey == metricKey);

            if (!limit)
                throw new Error(
                    "No limit found for this metric in the active subscription",
                );

            //get current usage for the metric
            const { periodStart, periodEnd } = this.getCurrentPeriod();
            const currentUsage = await this.usageRepo.findCounter({
                userId,
                metricKey,
                periodStart,
                periodEnd,
            });

            if (currentUsage && currentUsage.used + cost > limit.limitValue) {
                throw new Error("Usage limit exceeded for this metric");
            }

            //increment usage
            if (currentUsage) {
                console.log("Current usage before increment:", currentUsage);
                await this.usageRepo.incrementCounter(currentUsage.id, cost);
            } else {
                const newCounter = await this.usageRepo.createCounter({
                    userId,
                    metricKey,
                    periodStart,
                    periodEnd,
                });
                await this.usageRepo.incrementCounter(newCounter.id, cost);
            }
        } catch (err) {
            console.error("Error consuming usage:", err);
            throw err;
        }
    }

    async getMyUsage(userEmail: string) {
        const { periodStart, periodEnd } = this.getCurrentPeriod();
        const user = await this.userRepo.findByEmail(userEmail);
        if (!user) throw new Error("User not found");
        return await this.usageRepo.listUsageForPeriod(
            user.id,
            periodStart,
            periodEnd,
        );
    }
}
