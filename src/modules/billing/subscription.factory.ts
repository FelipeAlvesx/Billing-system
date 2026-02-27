import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { UserRepo } from '../../repos/user.repo';
import { SubscriptionRepo } from '../../repos/subscription.repo';
import { prisma } from '../../config/db';

const userRepo = new UserRepo(prisma);
const subscriptionRepo = new SubscriptionRepo(prisma);
const subscriptionService = new SubscriptionService(userRepo, subscriptionRepo);
export const subscriptionController = new SubscriptionController(subscriptionService);
