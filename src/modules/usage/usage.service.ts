import { SubscriptionRepo } from "@/repos/subscription.repo";
import { UsageRepo } from "@/repos/usage.repo";
import { PrismaClient } from "@prisma/client";

export class UsageService {
    
    private subRepo: SubscriptionRepo;
    private usageRepo: UsageRepo

    constructor(private readonly prisma: PrismaClient) {
        this.subRepo = new SubscriptionRepo(prisma);
        this.usageRepo = new UsageRepo(prisma);
    }


    async consume(userId: any, metricKey: any, cost: any){

    }

    async getMyUsage(userEmail: string) {
        return "calling get my usage";
    }
}