import { UserRepo } from "@/repos/user.repo";
import { PlanRepo } from "@/repos/plan.repo";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {

    constructor(
        private readonly userRepo: UserRepo,
        private readonly planRepo: PlanRepo,
        private readonly prisma: PrismaClient
    ) {}

    async register(email: string, password: string) {
        const existingUser = await this.userRepo.findByEmail(email);
        if (existingUser) {
            throw new Error('Usuario já existe');
        }

        // Buscar plano FREE
        const freePlan = await this.planRepo.findByCode('FREE');
        if (!freePlan) {
            throw new Error('Plano FREE não encontrado no sistema');
        }

        // Calcular período atual (30 dias)
        const currentPeriodStart = new Date();
        const currentPeriodEnd = new Date();
        currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);

        // Transação: criar User + Subscription + UsageCounter atomicamente
        const result = await this.prisma.$transaction(async (tx) => {
            // 1. Criar usuário
            const user = await tx.user.create({
                data: {
                    email,
                    password: bcrypt.hashSync(password, 10)
                }
            });

            // 2. Criar subscription (FREE, ACTIVE)
            const subscription = await tx.subscription.create({
                data: {
                    userId: user.id,
                    planId: freePlan.id,
                    status: 'ACTIVE',
                    currentPeriodStart,
                    currentPeriodEnd
                }
            });

            // 3. Criar usage counter (API_CALLS = 0)
            const usageCounter = await tx.usageCounter.create({
                data: {
                    userId: user.id,
                    metricKey: 'API_CALLS',
                    periodStart: currentPeriodStart,
                    periodEnd: currentPeriodEnd,
                    used: 0
                }
            });

            return { user, subscription, usageCounter };
        });

        return {
            message: 'Usuário registrado com sucesso',
            user: {
                id: result.user.id,
                email: result.user.email
            },
            subscription: {
                plan: freePlan.code,
                status: result.subscription.status
            }
        };
    }
    
    async login(email: string, password: string){
        const user = await this.userRepo.findByEmail(email);
        if (!user || !bcrypt.compareSync(password, user.password)) {
            throw new Error('Email ou senha inválidos');
        }
        const userEmail = user?.email;
        const token = jwt.sign({ userEmail }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        return { token };
    }


}