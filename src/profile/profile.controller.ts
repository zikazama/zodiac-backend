import { Controller, Get, Post, Put, Body, UseGuards, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { InterestService } from './interest.service';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService, private interestService: InterestService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads', // or use a function to set the path dynamically
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  async createProfile(@UploadedFile() file, @Body() body, @Request() req) {
    const profileData = {
      ...body,
      userId: req.user._id,
      imagePath: file.path,
    };
    return this.profileService.createProfile(profileData, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get')
  async getProfile(@Request() req) {
    return this.profileService.getProfile(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads', // or use a function to set the path dynamically
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  async updateProfile(@UploadedFile() file, @Body() body, @Request() req) {
    const profileData = {
      ...body,
      userId: req.user._id,
      imagePath: file ? file.path : undefined,
    };
    return this.profileService.updateProfile(req.user, profileData);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update/interest')
  async updateInterest(@Body() body, @Request() req) {
    const interestData = {
      ...body,
      userId: req.user._id,
    };
    return this.interestService.updateInterest(req.user, interestData);
  }
}
