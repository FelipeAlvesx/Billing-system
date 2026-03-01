import { PlanRepo } from "@/repos/plan.repo";

export class PlanService {

    constructor(private readonly planRepo: PlanRepo) {}

    async getPlans() {
        return await this.planRepo.findAll();
    }


}