import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { Errors } from "@/shared/errors";

export class AuthController {
    constructor(private readonly authService: AuthService) {}

    register = async (req: Request, res: Response, next: Function) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return next(Errors.validation({ fields: ['email', 'password'] }));
            }

            const user = await this.authService.register(email, password);
            return res.status(201).json(user);
        } catch (error) {
            return next(error);
        }
    };

    login = async (req: Request, res: Response, next: Function) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return next(Errors.validation({ fields: ['email', 'password'] }));
            }

            const token = await this.authService.login(email, password);
            return res.status(200).json(token);
        } catch (error) {
            return next(error);
        }
    };
}
