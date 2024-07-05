import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { Server } from 'socket.io';
import { mocked } from 'jest-mock';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let chatService: ChatService;
  let jwtService: JwtService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        {
          provide: ChatService,
          useValue: {
            sendMessage: jest.fn(),
            validateUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    chatService = module.get<ChatService>(ChatService);
    jwtService = module.get<JwtService>(JwtService);
    gateway.server = new Server();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should validate and set user data on successful connection', async () => {
      const clientMock: any = {
        handshake: {
          headers: {
            authorization: 'Bearer mockToken',
          },
        },
        data: {},
        id: 'client-id',
        disconnect: jest.fn(),
      };
      const userMock = { username: 'testUser', _id: 'userId' };
      mocked(jwtService.verify).mockReturnValue({ sub: 'userId' });

      await gateway.handleConnection(clientMock);

      expect(clientMock.data.user).toEqual(userMock);
      expect(gateway.clients.get(userMock.username)).toEqual(clientMock.id);
    });

    // Add more tests for different scenarios, such as invalid token, no token, etc.
  });

  describe('handleDisconnect', () => {
    it('should remove user from clients map on disconnect', () => {
      const clientMock: any = {
        id: 'client-id',
        data: {
          user: { username: 'testUser' },
        },
      };
      gateway.clients.set(clientMock.data.user.username, clientMock.id);

      gateway.handleDisconnect(clientMock);

      expect(gateway.clients.has(clientMock.data.user.username)).toBe(false);
    });

    // Add more tests for different scenarios if needed
  });

  describe('handleMessage', () => {
    it('should send message to target user if connected', async () => {
      const clientMock: any = {
        data: {
          user: { username: 'testUser' },
        },
      };
      const targetClientMock: any = {
        id: 'target-client-id',
      };
      const message = 'Hello World';
      const toUsername = 'targetUser';
      gateway.clients.set(toUsername, targetClientMock.id);
      jest.spyOn(gateway.server, 'to').mockReturnThis();
      jest.spyOn(gateway.server, 'emit').mockImplementation(() => true);

      await gateway.handleMessage(JSON.stringify({ toUsername, message }), clientMock);

      expect(gateway.server.to).toHaveBeenCalledWith(targetClientMock.id);
      expect(gateway.server.emit).toHaveBeenCalledWith('message', expect.any(Object));
      expect(chatService.sendMessage).toHaveBeenCalledWith(expect.any(Object));
    });

  });

});
