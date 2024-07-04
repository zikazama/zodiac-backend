import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './entities/chat.entity';
import { AmqpConnection } from '@nestjs-plus/rabbitmq';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async sendMessage(chatData): Promise<any> {
    const chat = new this.chatModel(chatData);
    await chat.save();
    this.amqpConnection.publish('chat_exchange', 'chat_routing', chatData);
    return { status: 'success', message: 'Message sent', data: chat };
  }

  async viewMessages(userId: string, toUserId: string): Promise<any> {
    const messages = await this.chatModel.find({ 
      $or: [
        { fromUserId: userId, toUserId },
        { fromUserId: toUserId, toUserId: userId },
      ] 
    });
    return { status: 'success', message: 'Get messages success', data: messages };
  }
}
