import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Chat extends Document {
  @Prop({ required: true })
  fromUsername: string;

  @Prop({ required: true })
  toUsername: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
