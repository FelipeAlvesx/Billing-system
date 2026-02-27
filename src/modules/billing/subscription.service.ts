import { UserRepo } from "@/repos/user.repo";
import { SubscriptionRepo } from "@/repos/subscription.repo";

export class SubscriptionService {

    constructor(
        private readonly userRepo: UserRepo,
        private readonly subscriptionRepo: SubscriptionRepo
    ) {}

    async getActiveSubscriptionByEmail(email: string) {
        // Buscar usuário pelo email
        const user = await this.userRepo.findByEmail(email);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        // Buscar subscription ativa
        const subscription = await this.subscriptionRepo.findActiveByUserId(user.id);
        
        if (!subscription) {
            return null;
        }

        // Formatar resposta
        return {
            id: subscription.id,
            status: subscription.status,
            currentPeriodStart: subscription.currentPeriodStart,
            currentPeriodEnd: subscription.currentPeriodEnd,
            plan: {
                code: subscription.plan.code,
                name: subscription.plan.name,
                features: subscription.plan.features.map(f => f.featureKey),
                limits: subscription.plan.limits.map(l => ({
                    metricKey: l.metricKey,
                    limitValue: l.limitValue
                }))
            }
        };
    }
}
