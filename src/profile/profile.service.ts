import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Horoscope, Profile, Zodiac } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Profile.name) private profileModel: Model<Profile>) {}

  async createProfile(profileData, user): Promise<any> {
    const checkProfile = await this.profileModel.findOne({  userId: user._id });
    if(checkProfile){
      return { status: 'error', message: 'Profile already exists', data: null };
    }
    profileData.userId = user._id;
    profileData.birthday = new Date(profileData.birthday);
    profileData.horoscope = this.detectHoroscope(profileData.birthday);
    profileData.zodiac = this.detectZodiac(profileData.birthday.getFullYear());
    const profile = await this.profileModel.create(profileData);
    await this.profileModel.bulkSave([profileData]);
    return { status: 'success', message: 'Create profile success', data: profile };
  }

  async getProfile(user, req): Promise<any> {
    const profile = await this.profileModel.findOne({  userId: user._id });
    const host = req.headers.host;
    profile.imagePath = `${host}/${profile.imagePath.replace('\\','/')}`
    return { status: 'success', message: 'Get profile success', data: profile };
  }

  async updateProfile(user, profileData): Promise<any> {
    profileData.userId = user._id;
    profileData.birthday = new Date(profileData.birthday);
    profileData.horoscope = this.detectHoroscope(profileData.birthday);
    profileData.zodiac = this.detectZodiac(profileData.birthday.getFullYear());
    const profile = await this.profileModel.findOneAndUpdate({ userId: user._id }, profileData, { new: true });
    return { status: 'success', message: 'Update profile success', data: profile };
  }

  detectHoroscope(birthDate: Date): Horoscope | null {
    const month = birthDate.getMonth() + 1; // Months are 0-indexed in JavaScript
    const day = birthDate.getDate();
  
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
      return Horoscope.Aries;
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
      return Horoscope.Taurus;
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
      return Horoscope.Gemini;
    } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
      return Horoscope.Cancer;
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
      return Horoscope.Leo;
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
      return Horoscope.Virgo;
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
      return Horoscope.Libra;
    } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
      return Horoscope.Scorpio;
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
      return Horoscope.Sagittarius;
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
      return Horoscope.Capricorn;
    } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
      return Horoscope.Aquarius;
    } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
      return Horoscope.Pisces;
    } else {
      return null;
    }
  }

  detectZodiac(year: number): Zodiac | null {
    const zodiacArray = [
      Zodiac.Rat,    // 0
      Zodiac.Ox,     // 1
      Zodiac.Tiger,  // 2
      Zodiac.Rabbit, // 3
      Zodiac.Dragon, // 4
      Zodiac.Snake,  // 5
      Zodiac.Horse,  // 6
      Zodiac.Goat,   // 7
      Zodiac.Monkey, // 8
      Zodiac.Rooster,// 9
      Zodiac.Dog,    // 10
      Zodiac.Pig     // 11
    ];
  
    if (year < 1900) {
      return null;
    }
  
    const index = (year - 1900) % 12;
    return zodiacArray[index];
  }
}
