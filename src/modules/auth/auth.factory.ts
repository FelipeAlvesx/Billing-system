import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserRepo } from "../../repos/user.repo";
import { PlanRepo } from "../../repos/plan.repo";
import { prisma } from "../../config/db";

const userRepo = new UserRepo(prisma);
const planRepo = new PlanRepo(prisma);
const authService = new AuthService(userRepo, planRepo, prisma);
export const authController = new AuthController(authService);
