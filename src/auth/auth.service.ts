import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) { }

  async register(username: string, password: string, email: string): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ username, password: hashedPassword, email });
    await user.save();
    return { status: 'success', message: 'Registration success' };
  }

  async login(usernameOrEmail: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({
      $or: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ]
    });
    if (user && await bcrypt.compare(password, user.password)) {
      const payload = { username: user.username, sub: user._id, id: user._id, email: user.email };
      const token = this.jwtService.sign(payload);
      return {
        status: 'success',
        message: 'Login success',
        data: { token },
      };
    }
    return { status: 'error', message: 'Invalid credentials' };
  }
}
