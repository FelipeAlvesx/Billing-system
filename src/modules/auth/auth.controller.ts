
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      
      // Validação
      if (!email || !password) {
        return res.status(400).json({ error: 'Email e password obrigatórios' });
      }
      
      // Chama serviço
      const user = await this.authService.register(name, email, password);
      
      // Responde
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await this.authService.login(email, password);
    return res.status(200).json(user);  
  };
}