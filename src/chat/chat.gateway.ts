import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/auth/entities/auth.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private clients: Map<string, string> = new Map();

  constructor(private chatService: ChatService,
    private readonly jwtService: JwtService,
  ) { }

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token = this.extractToken(client);
      const decodedToken = this.jwtService.verify(token, { secret: 'your_jwt_secret_key' });
      const user: User = await this.validateUser(decodedToken);
      client.data.user = user;
      this.clients.set(user.username, client.id); 
      console.log(`Client connected: ${client.id}`);
    } catch (err) {
      console.log('Client unauthorized');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user;
    if (user) {
      this.clients.delete(user.username); // Remove userId and socketId
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    const payload = { user, message: JSON.parse(message) };
    payload.message.fromUsername = user.username;
    payload.message.createdAt = new Date();
    const targetSocketUsername = this.clients.get(payload.message.toUsername); 
    if (targetSocketUsername) {
      this.server.to(targetSocketUsername).emit('message', payload); 
    } else {
      console.log('Target user not connected');
    }
    await this.chatService.sendMessage(payload.message);
    return payload;
  }

  private extractToken(client: Socket): string {
    const authHeader = client.handshake.headers?.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not found in authorization header');
    }
    return token;
  }

  private async validateUser(payload: any): Promise<User> {
    return await this.chatService.validateUser(payload.sub);
  }
}
