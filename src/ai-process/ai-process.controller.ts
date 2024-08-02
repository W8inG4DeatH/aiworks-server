import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  Sse,
} from '@nestjs/common';
import { AiProcessService } from './ai-process.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IAiFile, IOpenAIModel } from 'src/files/files.interfaces';

@Controller('aiprocess')
export class AiProcessController {
  constructor(private readonly aiProcessService: AiProcessService) {}

  @Post()
  async Files(
    @Body('openAiModel') openAiModel: IOpenAIModel,
    @Body('files') files: IAiFile[],
    @Body('myAIPrompt') myAIPrompt: string,
  ): Promise<{ message: string }> {
    try {
      console.log(`Received request to  files.`);
      await this.aiProcessService.processFiles(openAiModel, files, myAIPrompt);
      return { message: 'All files have been processed and modified.' };
    } catch (error) {
      console.error('Error in Files:', error);
      throw new InternalServerErrorException('Error processing request');
    }
  }

  @Post('tokens')
  async getTokensForFiles(
    @Body('files') files: IAiFile[],
    @Body('myAIPrompt') myAIPrompt: string,
  ): Promise<IAiFile[]> {
    try {
      const updatedFiles = await this.aiProcessService.countTokensForFiles(
        files,
        myAIPrompt,
      );
      return updatedFiles;
    } catch (error) {
      console.error('Error in getTokensForFiles:', error);
      throw new InternalServerErrorException('Error processing request');
    }
  }

  @Sse('progress')
  sendProgress(): Observable<MessageEvent> {
    return this.aiProcessService
      .getProgress()
      .pipe(map((progress) => ({ data: progress }) as MessageEvent));
  }
}
