import {
  Controller,
  Get,
  Post,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';
import { TeamsChatsService } from './teams-chats.service';
import { ITeamsChat } from './teams-chats.interfaces';

@Controller('teamschats')
export class TeamsChatsController {
  constructor(private readonly teamsChatsService: TeamsChatsService) {}

  @Get()
  async getChats(): Promise<ITeamsChat[]> {
    try {
      const chats = await this.teamsChatsService.getChats();
      console.log('Chats:', JSON.stringify(chats, null, 2));
      return chats;
    } catch (error) {
      console.error('Error in getChats:', error);
      throw new InternalServerErrorException('Error fetching chats');
    }
  }

  @Post('summarize')
  async summarizeChat(
    @Body('chatId') chatId: string,
  ): Promise<{ summary: string }> {
    try {
      const summary = await this.teamsChatsService.summarizeChat(chatId);
      console.log('Summary:', JSON.stringify(summary, null, 2));
      return summary;
    } catch (error) {
      console.error('Error in summarizeChat:', error);
      throw new InternalServerErrorException('Error summarizing chat');
    }
  }

  @Post('answer')
  async answerChat(
    @Body('chatId') chatId: string,
  ): Promise<{ answer: string }> {
    try {
      const answer = await this.teamsChatsService.answerChat(chatId);
      console.log('Answer:', JSON.stringify(answer, null, 2));
      return answer;
    } catch (error) {
      console.error('Error in answerChat:', error);
      throw new InternalServerErrorException('Error answering chat');
    }
  }
}
