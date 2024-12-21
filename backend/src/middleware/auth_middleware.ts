import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
}

export default (req: any, res: any, next: any) => {
  try {

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token missing or invalid' });
    }
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET') as DecodedToken;
    const userId = decodedToken.userId;
    req.auth = { userId: userId };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};
