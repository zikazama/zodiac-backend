import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { getModelToken } from '@nestjs/mongoose';
import { Profile } from './entities/profile.entity';
import { Model } from 'mongoose';

describe('ProfileService', () => {
  let service: ProfileService;
  let model: Model<Profile>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getModelToken(Profile.name),
          useValue: {
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            create: jest.fn(),
            bulkSave: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    model = module.get<Model<Profile>>(getModelToken(Profile.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProfile', () => {
    it('should create a new profile if one does not already exist', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);
      const profileData = { birthday: '1990-01-01' };
      const user = { _id: 'userId' };
      const result = await service.createProfile(profileData, user);
      expect(result).toHaveProperty('status', 'success');
    });

    it('should return an error if profile already exists', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(new Profile());
      const profileData = { birthday: '1990-01-01' };
      const user = { _id: 'userId' };
      const result = await service.createProfile(profileData, user);
      expect(result).toHaveProperty('status', 'error');
    });
  });

});
