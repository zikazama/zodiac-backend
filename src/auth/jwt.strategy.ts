import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your_jwt_secret_key', // Replace with your secret key
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { sub: userId } = payload;
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async decodeToken(token: string): Promise<any> {
    try {
      return await this.jwtService.decode(token);
    } catch (error) {
      // Handle token decode error
      throw new Error('Invalid token');
    }
  }
}
