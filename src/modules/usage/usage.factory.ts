import { UsageService } from "./usage.service";
import { UsageController } from "./usage.controller";
import { prisma } from "../../config/db";

const usageService = new UsageService(prisma);
const usageController = new UsageController(usageService);

export { usageController };
