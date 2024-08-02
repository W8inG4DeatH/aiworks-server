import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ITeamsChat } from './teams-chats.interfaces';
import { MicrosoftAuthService } from '../auth/microsoft.auth.service';

@Injectable()
export class TeamsChatsService {
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly apiKey = 'xxx';

  constructor(
    private httpService: HttpService,
    private microsoftauthService: MicrosoftAuthService,
  ) {}

  async getChats(): Promise<ITeamsChat[]> {
    try {
      const accessToken = await this.microsoftauthService.getAccessToken();
      console.log('Access Token:', accessToken);

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      };

      console.log('Requesting chats from Teams API');
      const response = await lastValueFrom(
        this.httpService.get('https://graph.microsoft.com/v1.0/chats', {
          headers,
        }),
      );

      console.log('Response from Teams API:', response.data);

      const chats = response.data.value.map((chat) => ({
        id: chat.id,
        title: chat.topic || 'No Title',
        lastMessage: chat.lastMessagePreview?.body?.content || 'No Messages',
        participants: chat.members.map((member) => member.displayName),
        lastUpdated: new Date(chat.lastUpdatedDateTime),
      }));

      return chats;
    } catch (error) {
      console.error(
        'Error fetching chats from Teams:',
        error.response?.data || error.message || error,
      );
      throw new InternalServerErrorException('Error fetching chats from Teams');
    }
  }

  async summarizeChat(chatId: string): Promise<{ summary: string }> {
    try {
      const chatContent = await this.getChatContent(chatId);
      const prompt = `Summarize the following chat: ${chatContent}`;

      const response = await lastValueFrom(
        this.httpService.post(
          this.apiUrl,
          { prompt },
          {
            headers: { Authorization: `Bearer ${this.apiKey}` },
          },
        ),
      );

      const summary = response.data.choices[0].text;
      return { summary };
    } catch (error) {
      console.error(
        'Error summarizing chat:',
        error.response?.data || error.message || error,
      );
      throw new InternalServerErrorException('Error summarizing chat');
    }
  }

  async answerChat(chatId: string): Promise<{ answer: string }> {
    try {
      const chatContent = await this.getChatContent(chatId);
      const prompt = `Provide a helpful response to the following chat: ${chatContent}`;

      const response = await lastValueFrom(
        this.httpService.post(
          this.apiUrl,
          { prompt },
          {
            headers: { Authorization: `Bearer ${this.apiKey}` },
          },
        ),
      );

      const answer = response.data.choices[0].text;
      return { answer };
    } catch (error) {
      console.error(
        'Error answering chat:',
        error.response?.data || error.message || error,
      );
      throw new InternalServerErrorException('Error answering chat');
    }
  }

  private async getChatContent(chatId: string): Promise<string> {
    chatId;
    // Logic to get chat content by chatId
    return '';
  }
}
