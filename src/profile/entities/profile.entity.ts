import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

enum Gender {
  Male = 'male',
  Female = 'female',
}

export enum Horoscope {
  Aries = 'Aries',
  Taurus = 'Taurus',
  Gemini = 'Gemini',
  Cancer = 'Cancer',
  Leo = 'Leo',
  Virgo = 'Virgo',
  Libra = 'Libra',
  Scorpio = 'Scorpio',
  Sagittarius = 'Sagittarius',
  Capricorn = 'Capricorn',
  Aquarius = 'Aquarius',
  Pisces = 'Pisces',
}

export enum Zodiac {
  Rat = 'Rat',
  Ox = 'Ox',
  Tiger = 'Tiger',
  Rabbit = 'Rabbit',
  Dragon = 'Dragon',
  Snake = 'Snake',
  Horse = 'Horse',
  Goat = 'Goat',
  Monkey = 'Monkey',
  Rooster = 'Rooster',
  Dog = 'Dog',
  Pig = 'Pig',
}

@Schema()
export class Profile extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop()
  imagePath: string;

  @Prop()
  displayName: string;

  @Prop({ enum: Gender })
  gender: Gender;

  @Prop()
  birthday: Date;

  @Prop({ enum: Horoscope })
  horoscope: Horoscope;

  @Prop({ enum: Zodiac })
  zodiac: Zodiac;

  @Prop()
  height: number;

  @Prop()
  weight: number;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
