import { Request, Response } from 'express';
import { SubscriptionService } from './subscription.service';

export class SubscriptionController {

    constructor(private readonly subscriptionService: SubscriptionService) {}

    getActiveSubscription = async (req: Request, res: Response) => {
        try {
            const userEmail = req.user?.userEmail;
            if (!userEmail) {
                return res.status(401).json({ error: 'Usuário não identificado' });
            }

            const subscription = await this.subscriptionService.getActiveSubscriptionByEmail(userEmail);
            
            if (!subscription) {
                return res.status(404).json({ error: 'Nenhuma subscription ativa encontrada' });
            }

            return res.status(200).json(subscription);
        } catch (error) {
            return res.status(500).json({ error: (error as Error).message });
        }
    };
}
