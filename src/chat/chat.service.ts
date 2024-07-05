import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AmqpConnection } from '@nestjs-plus/rabbitmq';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async sendMessage(chatData): Promise<any> {
    const chat = new this.chatModel(chatData);
    await chat.save();
    this.amqpConnection.publish('chat_exchange', 'chat_routing', chatData);
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
}
