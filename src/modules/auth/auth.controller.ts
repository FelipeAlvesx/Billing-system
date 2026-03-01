import { Request, Response } from 'express';
import { AuthService } from './auth.service';


export class AuthController {

  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response) => {
    try {

      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email e password obrigatórios' });
      }

      const user = await this.authService.register(email, password);
      return res.status(201).json(user);

    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  };

  login = async (req: Request, res: Response) => {

    console.log("Login request received with body:", req.body); // Log the request body for debugging

   try{
      const { email, password }: any = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email e password obrigatórios' });
      }

      const token = await this.authService.login(email, password);
      return res.status(200).json(token);

    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  };
}