import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/user_service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // Signup controller method
  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.signup({
        email: req.body.email,
        password: req.body.password
      });

      res.status(201).json({ message: "Utilisateur créé !" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  // Login controller method
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginResult = await this.authService.login({
        email: req.body.email,
        password: req.body.password
      });

      res.status(200).json(loginResult);
    } catch (error) {
      res.status(401).json({ message: "Paire login/mot de passe incorrecte" });
    }
  };
}