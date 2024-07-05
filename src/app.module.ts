import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQModule } from '@nestjs-plus/rabbitmq';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { ChatModule } from './chat/chat.module';
import { DecodeTokenMiddleware } from './decode.middleware';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/horoscope'),
    // RabbitMQModule.forRoot({
    //   uri: 'amqp://localhost:5672',
    //   exchanges: [
    //     {
    //       name: 'chat_exchange',
    //       type: 'topic',
    //     },
    //   ],
    // }),
    AuthModule,
    ProfileModule,
    // ChatModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DecodeTokenMiddleware)
      .forRoutes('*');  // Apply to all routes, change if needed
  }
}
