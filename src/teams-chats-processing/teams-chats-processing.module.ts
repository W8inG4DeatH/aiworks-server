import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TeamsChatsService } from './teams-chats.service';
import { TeamsChatsController } from './teams-chats.controller';
import { MicrosoftAuthService } from 'src/auth/microsoft.auth.service';

@Module({
  imports: [HttpModule],
  controllers: [TeamsChatsController],
  providers: [TeamsChatsService, MicrosoftAuthService],
})
export class TeamsChatsProcessingModule {}
