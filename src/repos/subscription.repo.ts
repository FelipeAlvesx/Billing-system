import { PrismaClient } from "@prisma/client";

export class SubscriptionRepo {

    constructor(private readonly prisma: PrismaClient) {}


    async getActiveWithPlanFeatures(userId: string) {
        return await this.prisma.subscription.findFirst({
            where: {userId, status: 'ACTIVE'},
            orderBy: {createdAt: 'desc'},
            include: {
                plan: {
                    include: {
                        features: true
                    }   
                }
            }
        })
    }


    async findActiveByUserId(userId: string) {
        return await this.prisma.subscription.findFirst({
            where: {
                userId,
                status: 'ACTIVE'
            },
            include: {
                plan: {
                    include: {
                        limits: true,
                        features: true
                    }
                }
            }
        });
    }

    async findByUserId(userId: string) {
        return await this.prisma.subscription.findMany({
            where: { userId },
            include: {
                plan: {
                    include: {
                        limits: true,
                        features: true
                    }
                }
            }
        });
    }
}
