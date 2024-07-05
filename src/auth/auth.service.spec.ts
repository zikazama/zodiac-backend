import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
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
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockedJwtToken'),
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
            // Add other methods as needed for your tests
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
    it('should return error if user exists', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(new User());
      const result = await service.register('testUser', 'testPass', 'test@example.com');
      expect(result).toEqual({ status: 'error', message: 'Username or email already exists' });
    });

    it('should return success if user does not exist', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(userModel.prototype, 'save').mockImplementationOnce(async () => undefined);

      const result = await service.register('newUser', 'newPass', 'new@example.com');
      expect(result).toEqual({ status: 'success', message: 'Registration success' });
    });
  });

  describe('login', () => {
    it('should return error if credentials are invalid', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);
      const result = await service.login('wrongUser', 'wrongPass');
      expect(result).toEqual({ status: 'error', message: 'Invalid credentials' });
    });

    it('should return success if credentials are valid', async () => {
      const user = {
        username: 'validUser',
        password: 'hashedPassword',
        _id: 'userId',
        email: 'valid@example.com',
      };
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.login('validUser', 'validPass');
      expect(result).toEqual({
        status: 'success',
        message: 'Login success',
        data: { token: 'mockedJwtToken' },
      });
    });
  });
});
