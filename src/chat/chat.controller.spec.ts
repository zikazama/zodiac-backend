import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('ChatController', () => {
  let chatController: ChatController;
  let chatService: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: {
            sendMessage: jest.fn().mockResolvedValue('mockSendMessageResult'),
            viewMessages: jest.fn().mockResolvedValue('mockViewMessagesResult'),
          },
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .compile();

    chatController = module.get<ChatController>(ChatController);
    chatService = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(chatController).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should call ChatService.sendMessage with correct parameters', async () => {
      const req = {
        user: { username: 'testUser' },
      };
      const body = {
        toUsername: 'targetUser',
        message: 'Hello',
      };

      await chatController.sendMessage(body, req);

      expect(chatService.sendMessage).toHaveBeenCalledWith({
        fromUsername: req.user.username,
        toUsername: body.toUsername,
        message: body.message,
        createdAt: expect.any(Date),
      });
    });
  });

  describe('viewMessages', () => {
    it('should call ChatService.viewMessages with correct parameters', async () => {
      const req = {
        user: { username: 'testUser' },
      };
      const body = {
        toUsername: 'targetUser',
      };

      await chatController.viewMessages(body, req);

      expect(chatService.viewMessages).toHaveBeenCalledWith(req.user, body.toUsername);
    });
  });
});
