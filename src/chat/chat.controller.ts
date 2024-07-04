import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post('send')
  async sendMessage(@Body() body, @Request() req) {
    const chatData = {
      fromUserId: req.user.userId,
      toUserId: body.toUserId,
      message: body.message,
    };
    return this.chatService.sendMessage(chatData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('view')
  async viewMessages(@Body() body, @Request() req) {
    return this.chatService.viewMessages(req.user.userId, body.toUserId);
  }
}
