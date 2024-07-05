import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Chat, ChatSchema } from './entities/chat.entity';
import { AmqpConnection } from '@nestjs-plus/rabbitmq';
import { ChatGateway } from './chat.gateway';
import { User, UserSchema } from '..//auth/entities/auth.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [ChatController],
  providers: [ChatService, AmqpConnection, ChatGateway, JwtService],
  exports: [ChatService],
})
export class ChatModule {}
