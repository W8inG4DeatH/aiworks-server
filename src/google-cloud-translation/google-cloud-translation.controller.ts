import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GoogleCloudTranslationService } from './google-cloud-translation.service';

@Controller('api/google-cloud-translation')
export class GoogleCloudTranslationController {
  constructor(
    private readonly googleCloudTranslationService: GoogleCloudTranslationService,
  ) {}

  @Post()
  async translate(
    @Body()
    body: {
      projectDirectoryPath: string[];
      sourceFileName: string;
      sourceLanguage: string;
      targetLanguages: string[];
    },
  ) {
    console.log(body);
    const result = await this.googleCloudTranslationService.translateFile(
      body.projectDirectoryPath,
      body.sourceFileName,
      body.sourceLanguage,
      body.targetLanguages,
    );
    return result;
  }

  @Get('progress/:language')
  getProgress(@Param('language') language: string) {
    return this.googleCloudTranslationService.getTranslationProgress(language);
  }
}
