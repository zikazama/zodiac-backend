import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Chat extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  fromUserId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  toUserId: string;

  @Prop({ required: true })
  message: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
