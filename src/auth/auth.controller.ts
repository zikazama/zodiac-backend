import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { username: string; email: string, password: string }) {
    return this.authService.register(body.username, body.password, body.email);
  }

  @Post('login')
  async login(@Body() body: { usernameOrEmail: string; password: string }) {
    return this.authService.login(body.usernameOrEmail, body.password);
  }
}
