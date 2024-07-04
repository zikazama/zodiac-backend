import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { AmqpConnection } from '@nestjs-plus/rabbitmq';
import { Model } from 'mongoose';

describe('ChatService', () => {
  let service: ChatService;
  let chatModel: Model<Chat>;
  let amqpConnection: AmqpConnection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getModelToken(Chat.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: AmqpConnection,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    chatModel = module.get<Model<Chat>>(getModelToken(Chat.name));
    amqpConnection = module.get<AmqpConnection>(AmqpConnection);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should create and return chat message', async () => {
      const chat = { fromUserId: 'user1', toUserId: 'user2', message: 'hello' };
      jest.spyOn(chatModel, 'create').mockResolvedValue(chat);

      const result = await service.sendMessage(chat);
      expect(result).toEqual({ status: 'success', message: 'Message sent', data: chat });
      expect(amqpConnection.publish).toHaveBeenCalled();
    });
  });

  describe('viewMessages', () => {
    it('should return chat messages', async () => {
      const chats = [
        { fromUserId: 'user1', toUserId: 'user2', message: 'hello' },
        { fromUserId: 'user2', toUserId: 'user1', message: 'hi' },
      ];
      jest.spyOn(chatModel, 'find').mockResolvedValue(chats);

      const result = await service.viewMessages('user1', 'user2');
      expect(result).toEqual({ status: 'success', message: 'Get messages success', data: chats });
    });
  });
});
