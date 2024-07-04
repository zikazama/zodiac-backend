import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Profile.name) private profileModel: Model<Profile>) {}

  async createProfile(profileData): Promise<any> {
    const profile = new this.profileModel(profileData);
    await profile.save();
    return { status: 'success', message: 'Create profile success', data: profile };
  }

  async getProfile(userId: string): Promise<any> {
    const profile = await this.profileModel.findOne({ userId });
    return { status: 'success', message: 'Get profile success', data: profile };
  }

  async updateProfile(userId: string, profileData): Promise<any> {
    const profile = await this.profileModel.findOneAndUpdate({ userId }, profileData, { new: true });
    return { status: 'success', message: 'Update profile success', data: profile };
  }
}
