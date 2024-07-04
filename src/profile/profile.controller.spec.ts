import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('ProfileController', () => {
  let controller: ProfileController;
  let profileService: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: {
            createProfile: jest.fn(),
            getProfile: jest.fn(),
            updateProfile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    profileService = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createProfile', () => {
    it('should call profileService.createProfile and return result', async () => {
      const result = { status: 'success', message: 'Create profile success', data: {} };
      jest.spyOn(profileService, 'createProfile').mockResolvedValue(result);

      expect(await controller.createProfile(null, { displayName: 'test' }, { user: { userId: 'userId' } })).toBe(result);
    });
  });

  describe('getProfile', () => {
    it('should call profileService.getProfile and return result', async () => {
      const result = { status: 'success', message: 'Get profile success', data: {} };
      jest.spyOn(profileService, 'getProfile').mockResolvedValue(result);

      expect(await controller.getProfile({ user: { userId: 'userId' } })).toBe(result);
    });
  });

  describe('updateProfile', () => {
    it('should call profileService.updateProfile and return result', async () => {
      const result = { status: 'success', message: 'Update profile success', data: {} };
      jest.spyOn(profileService, 'updateProfile').mockResolvedValue(result);

      expect(await controller.updateProfile(null, { displayName: 'test' }, { user: { userId: 'userId' } })).toBe(result);
    });
  });
});
