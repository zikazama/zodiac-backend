import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { InterestService } from './interest.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';

describe('ProfileController', () => {
  let controller: ProfileController;
  let profileService: ProfileService;
  let interestService: InterestService;

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
        {
          provide: InterestService,
          useValue: {
            updateInterest: jest.fn(),
          },
        },
        JwtAuthGuard,
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    profileService = module.get<ProfileService>(ProfileService);
    interestService = module.get<InterestService>(InterestService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createProfile', () => {
    it('should call profileService.createProfile with the correct parameters', async () => {
      const file = { path: 'path/to/image' };
      const body: CreateProfileDto = {
        "image": null,
        "displayName": "user",
        "gender": "male",
        "birthday": new Date("1998-01-19"),
        "height": 165,
        "weight": 70
      };
      const req = { user: { _id: 'userId' } };
      const profileData = { ...body, userId: req.user._id, imagePath: file.path };

      await controller.createProfile(file, body, req);
      expect(profileService.createProfile).toHaveBeenCalledWith(profileData, req.user);
    });
  });

});
