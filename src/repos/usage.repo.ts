import type { PrismaClient, UsageCounter } from "@prisma/client";

export class UsageRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async findCounter(params: {
    userId: string;
    metricKey: string;
    periodStart: Date;
    periodEnd: Date;
  }): Promise<UsageCounter | null> {
    const { userId, metricKey, periodStart, periodEnd } = params;

    return this.prisma.usageCounter.findFirst({
      where: { userId, metricKey, periodStart, periodEnd },
    });
  }

  async createCounter(params: {
    userId: string;
    metricKey: string;
    periodStart: Date;
    periodEnd: Date;
  }): Promise<UsageCounter> {
    const { userId, metricKey, periodStart, periodEnd } = params;

    return this.prisma.usageCounter.create({
      data: { userId, metricKey, periodStart, periodEnd, used: 0 },
    });
  }

  async incrementCounter(counterId: string, amount: number): Promise<UsageCounter> {
    return this.prisma.usageCounter.update({
      where: { id: counterId },
      data: { used: { increment: amount } },
    });
  }

  async listUsageForPeriod(userId: string, periodStart: Date, periodEnd: Date) {
    return this.prisma.usageCounter.findMany({
      where: { userId, periodStart, periodEnd },
      orderBy: { metricKey: "asc" },
    });
  }
}