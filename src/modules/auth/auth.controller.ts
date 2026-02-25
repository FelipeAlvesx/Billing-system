
import { Request, Response } from 'express';
import { AuthService } from './auth.service';


export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response) => {
    try {
      const { email, password }: any = req.body;
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
   
  };
}