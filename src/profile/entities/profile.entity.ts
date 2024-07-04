import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

enum Gender {
  Male = 'male',
  Female = 'female',
}

enum Horoscope {
  Aries = 'Aries',
  //... other signs
}

enum Zodiac {
  Rat = 'Rat',
  //... other signs
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
