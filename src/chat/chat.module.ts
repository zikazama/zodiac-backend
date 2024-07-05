import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Chat } from './entities/chat.entity';
import { AmqpConnection } from '@nestjs-plus/rabbitmq';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: Chat }]),
  ],
  controllers: [ChatController],
  providers: [ChatService, AmqpConnection],
  exports: [ChatService],
})
export class ChatModule {}
