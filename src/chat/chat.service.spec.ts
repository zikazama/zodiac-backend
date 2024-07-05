import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { getModelToken } from '@nestjs/mongoose';
import { Chat } from './entities/chat.entity';
import { User } from '../auth/entities/auth.entity';
import { Model } from 'mongoose';

describe('ChatService', () => {
  let service: ChatService;
  let chatModel: Model<Chat>;
  let userModel: Model<User>;

  // Mock chat and user data
  const chatData = { message: 'Hello', fromUsername: 'user1', toUsername: 'user2' };
  const userData = { username: 'user1', _id: 'userId' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getModelToken(Chat.name),
          useValue: {
            new: jest.fn().mockResolvedValue(chatData),
            constructor: jest.fn().mockResolvedValue(chatData),
            save: jest.fn(),
            create: jest.fn(),
            bulkSave: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: {
            findById: jest.fn().mockResolvedValue(userData),
          },
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    chatModel = module.get<Model<Chat>>(getModelToken(Chat.name));
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should save a message and return success', async () => {
      const result = await service.sendMessage(chatData);
      expect(result).toEqual({ status: 'success', message: 'Message sent', data: chatData });
    });
  });

  describe('viewMessages', () => {
    it('should return messages', async () => {
      jest.spyOn(chatModel, 'find').mockResolvedValueOnce([chatData]);
      const result = await service.viewMessages(userData, 'user2');
      expect(result).toEqual({ status: 'success', message: 'Get messages success', data: [chatData] });
    });
  });

  describe('validateUser', () => {
    it('should validate and return user data', async () => {
      const result = await service.validateUser('userId');
      expect(result).toEqual(userData);
    });
  });
});
