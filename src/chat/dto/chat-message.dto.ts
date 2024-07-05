import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class ChatMessageDto {
  @IsString()
  @IsNotEmpty()
  fromUsername: string;

  @IsString()
  @IsNotEmpty()
  toUsername: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsDate()
  createdAt: Date;
}
