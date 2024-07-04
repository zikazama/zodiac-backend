import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from './entities/auth.entity';
import { Model } from 'mongoose';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should hash password and save user', async () => {
      const user = { username: 'test', password: 'password' };
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(userModel.prototype, 'save').mockResolvedValue(user);

      const result = await service.register(user.username, user.password);
      expect(result).toEqual({ status: 'success', message: 'Registration success' });
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(userModel.prototype.save).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return a token if credentials are valid', async () => {
      const user = { username: 'test', password: 'password', _id: 'userId' };
      jest.spyOn(userModel, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      const result = await service.login(user.username, user.password);
      expect(result).toEqual({
        status: 'success',
        message: 'Login success',
        data: { token: 'token' },
      });
    });

    it('should return an error if credentials are invalid', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

      const result = await service.login('wrongUsername', 'password');
      expect(result).toEqual({ status: 'error', message: 'Invalid credentials' });
    });
  });
});
