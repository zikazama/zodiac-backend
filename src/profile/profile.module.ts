import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Profile, ProfileSchema } from './entities/profile.entity';
import { InterestService } from './interest.service';
import { Interest, InterestSchema } from './entities/interest.entity';
import { AssetsController } from './asset.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    MongooseModule.forFeature([{ name: Interest.name, schema: InterestSchema }]),
  ],
  controllers: [ProfileController, AssetsController],
  providers: [ProfileService, InterestService],
  exports: [ProfileService, InterestService],
})
export class ProfileModule {}
