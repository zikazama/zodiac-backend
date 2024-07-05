import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DecodeTokenMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = this.jwtService.decode(token);
      if (typeof payload === 'object' && payload) {
        req.user = payload;
      } else {
        return res.status(401).json({ message: 'Invalid token' });
      }
    } catch (error) {
      return res.status(401).json({ message: 'Token decoding failed', error: error.message });
    }

    next();
  }
}
