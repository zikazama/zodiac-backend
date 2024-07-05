import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue('mockRegisterResult'),
            login: jest.fn().mockResolvedValue('mockLoginResult'),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should call AuthService.register with correct parameters', async () => {
      const registerDto = new RegisterDto();
      registerDto.username = 'testUser';
      registerDto.password = 'testPass';
      registerDto.email = 'test@example.com';

      await authController.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(
        registerDto.username,
        registerDto.password,
        registerDto.email,
      );
    });
  });

  describe('login', () => {
    it('should call AuthService.login with correct parameters', async () => {
      const loginDto = new LoginDto();
      loginDto.usernameOrEmail = 'testUserOrEmail';
      loginDto.password = 'testPass';

      await authController.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(
        loginDto.usernameOrEmail,
        loginDto.password,
      );
    });
  });
});
