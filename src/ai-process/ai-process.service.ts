import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, Subject } from 'rxjs';
import * as fs from 'fs';
import { encode } from 'gpt-3-encoder';
import { IAiFile, IOpenAIModel } from 'src/files/files.interfaces';

@Injectable()
export class AiProcessService {
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly apiKey = 'generate key';

  private progressSubject = new Subject<{ completed: number; total: number }>();

  constructor(private httpService: HttpService) {}

  getProgress() {
    return this.progressSubject.asObservable();
  }

  async File(
    openAiModel: IOpenAIModel,
    filePath: string,
    fileContent: string,
    myAIPrompt: string,
  ): Promise<void> {
    try {
      const processedContent = await this.sendToGpt(
        openAiModel,
        fileContent,
        myAIPrompt,
      );
      fs.writeFileSync(filePath, processedContent, 'utf8');
    } catch (error) {
      console.error(`Error ing file ${filePath}:`, error);
      throw new InternalServerErrorException('Error ing file');
    }
  }

  private async sendToGpt(
    openAiModel: IOpenAIModel,
    content: string,
    prompt: string,
  ): Promise<string> {
    try {
      const body = {
        model: IOpenAIModel.GPT4Turbo,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `${prompt}: ${content}` },
        ],
        max_tokens: 2048,
        temperature: 0.2,
      };

      const headers = {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      };

      const response = await lastValueFrom(
        this.httpService.post(this.apiUrl, body, { headers }),
      );

      console.log('OpenAI API response:', response.data);

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error(
        'Error calling OpenAI API:',
        error.response ? error.response.data : error.message,
      );
      throw new InternalServerErrorException(
        'Error communicating with OpenAI API',
      );
    }
  }

  async processFiles(
    openAiModel: IOpenAIModel,
    files: IAiFile[],
    myAIPrompt: string,
  ): Promise<void> {
    try {
      const totalFiles = files.length;
      let completedFiles = 0;

      // Send initial progress update
      this.progressSubject.next({
        completed: completedFiles,
        total: totalFiles,
      });

      // Regularly send progress updates every 5 seconds
      const intervalId = setInterval(() => {
        this.progressSubject.next({
          completed: completedFiles,
          total: totalFiles,
        });
      }, 5000);

      for (const file of files) {
        const filePath = file.FullPath;
        const fileContent = fs.readFileSync(filePath, 'utf8');
        await this.File(openAiModel, filePath, fileContent, myAIPrompt);
        completedFiles++;
        this.progressSubject.next({
          completed: completedFiles,
          total: totalFiles,
        });
      }

      // Clear interval after processing
      clearInterval(intervalId);
    } catch (error) {
      console.error(`Error processing files:`, error);
      throw new InternalServerErrorException('Error processing files');
    }
  }

  // Method to count tokens for given files and prompt
  async countTokensForFiles(
    files: IAiFile[],
    prompt: string,
  ): Promise<IAiFile[]> {
    return files.map((file) => {
      const fileContent = fs.readFileSync(file.FullPath, 'utf8');
      const inputMessages = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `${prompt}: ${fileContent}` },
      ];

      const inputTokens = inputMessages.reduce(
        (acc, message) => acc + encode(message.content).length,
        0,
      );
      const outputTokens = encode(fileContent).length;

      return { ...file, InputTokens: inputTokens, OutputTokens: outputTokens };
    });
  }
}
