import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserRepo } from "../../repos/user.repo";
import { prisma } from "../../config/db";

const userRepo = new UserRepo(prisma);
const authService = new AuthService(userRepo);
export const authController = new AuthController(authService);
