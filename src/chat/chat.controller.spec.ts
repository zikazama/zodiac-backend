import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('ChatController', () => {
  let controller: ChatController;
  let chatService: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: {
            sendMessage: jest.fn(),
            viewMessages: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    chatService = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should call chatService.sendMessage and return result', async () => {
      const result = { status: 'success', message: 'Message sent', data: {} };
      jest.spyOn(chatService, 'sendMessage').mockResolvedValue(result);

      expect(await controller.sendMessage({ toUserId: 'user2', message: 'hello' }, { user: { userId: 'user1' } })).toBe(result);
    });
  });

  describe('viewMessages', () => {
    it('should call chatService.viewMessages and return result', async () => {
      const result = { status: 'success', message: 'Get messages success', data: [] };
      jest.spyOn(chatService, 'viewMessages').mockResolvedValue(result);

      expect(await controller.viewMessages({ toUserId: 'user2' }, { user: { userId: 'user1' } })).toBe(result);
    });
  });
});
