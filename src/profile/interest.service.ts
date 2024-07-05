import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Interest } from './entities/interest.entity';

@Injectable()
export class InterestService {
  constructor(@InjectModel(Interest.name) private interestModel: Model<Interest>) {}

  async updateInterest(user, interestData): Promise<any> {
    await this.interestModel.deleteMany({ userId: user._id });
    const data = await this.interestModel.create(interestData.keywords.map((keyword) => ({ userId: user._id, keyword })));
    return { status: 'success', message: 'Update interest success', data };
  }
}