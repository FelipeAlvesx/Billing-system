import { PlanRepo } from "@/repos/plan.repo";
import { PlanController } from "./plan.controller";
import { PlanService } from "./plan.service";
import { prisma } from "../../config/db";

const planRepo = new PlanRepo(prisma);
const planService = new PlanService(planRepo);
const planController = new PlanController(planService);

export { planController };