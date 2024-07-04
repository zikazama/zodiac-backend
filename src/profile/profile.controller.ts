import { Controller, Get, Post, Put, Body, UseGuards, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  async createProfile(@UploadedFile() file, @Body() body, @Request() req) {
    const profileData = {
      ...body,
      userId: req.user.userId,
      imagePath: file.path,
    };
    return this.profileService.createProfile(profileData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get')
  async getProfile(@Request() req) {
    return this.profileService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  @UseInterceptors(FileInterceptor('image'))
  async updateProfile(@UploadedFile() file, @Body() body, @Request() req) {
    const profileData = {
      ...body,
      userId: req.user.userId,
      imagePath: file ? file.path : undefined,
    };
    return this.profileService.updateProfile(req.user.userId, profileData);
  }
}
