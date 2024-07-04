import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register and return result', async () => {
      const result = { status: 'success', message: 'Registration success' };
      jest.spyOn(authService, 'register').mockResolvedValue(result);

      expect(await controller.register({ username: 'test', password: 'password' })).toBe(result);
    });
  });

  describe('login', () => {
    it('should call authService.login and return result', async () => {
      const result = { status: 'success', message: 'Login success', data: { token: 'token' } };
      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await controller.login({ username: 'test', password: 'password' })).toBe(result);
    });
  });
});
