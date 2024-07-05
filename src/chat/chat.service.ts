import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './entities/chat.entity';
import { User } from 'src/auth/entities/auth.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async sendMessage(chatData): Promise<any> {
    const chat = new this.chatModel(chatData);
    await chat.save();
    return { status: 'success', message: 'Message sent', data: chat };
  }

  async viewMessages(user, toUsername: string): Promise<any> {
    const messages = await this.chatModel.find({
      $or: [
        { fromUsername: user.username, toUsername },
        { fromUsername: toUsername, toUsername: user.username },
      ]
    }).exec();
    return { status: 'success', message: 'Get messages success', data: messages };
  }

  async validateUser(userId: string): Promise<User> {
    return this.userModel.findById(userId).exec();
  }
}
