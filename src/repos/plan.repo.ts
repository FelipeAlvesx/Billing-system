import { PrismaClient } from "@prisma/client";

export class PlanRepo {

    constructor(private readonly prisma: PrismaClient) {}

    async findByCode(code: string) {
        return await this.prisma.plan.findUnique({ 
            where: { code },
            include: {
                limits: true,
                features: true
            }
        });
    }

    async findAll() {
        return await this.prisma.plan.findMany({
            include: {
                limits: true,
                features: true
            }
        });
    }
}
