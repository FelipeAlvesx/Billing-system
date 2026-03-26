import { Request, Response } from 'express';
import { PlanService } from './plan.service';


export class PlanController {

    constructor(private readonly planService: PlanService) {}

    getPlans = async (req: Request, res: Response, next: Function) => {
        try {
            return res.json(await this.planService.getPlans());
        } catch (error) {
            return next(error);
        }
    }

}