import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.username, body.password, body.email);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.usernameOrEmail, body.password);
  }
}
