import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProfileService } from './profile.service';
import { Profile } from './entities/profile.entity';
import { Model } from 'mongoose';

describe('ProfileService', () => {
  let service: ProfileService;
  let profileModel: Model<Profile>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getModelToken(Profile.name),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    profileModel = module.get<Model<Profile>>(getModelToken(Profile.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProfile', () => {
    it('should create and return profile', async () => {
      const profile = { userId: 'userId', displayName: 'test' };
      jest.spyOn(profileModel, 'create').mockResolvedValue(profile);

      const result = await service.createProfile(profile);
      expect(result).toEqual({ status: 'success', message: 'Create profile success', data: profile });
    });
  });

  describe('getProfile', () => {
    it('should return profile', async () => {
      const profile = { userId: 'userId', displayName: 'test' };
      jest.spyOn(profileModel, 'findOne').mockResolvedValue(profile);

      const result = await service.getProfile('userId');
      expect(result).toEqual({ status: 'success', message: 'Get profile success', data: profile });
    });
  });

  describe('updateProfile', () => {
    it('should update and return profile', async () => {
      const profile = { userId: 'userId', displayName: 'test' };
      jest.spyOn(profileModel, 'findOneAndUpdate').mockResolvedValue(profile);

      const result = await service.updateProfile('userId', profile);
      expect(result).toEqual({ status: 'success', message: 'Update profile success', data: profile });
    });
  });
});
