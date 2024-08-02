import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GoogleCloudTranslationService } from './google-cloud-translation.service';
import { GoogleCloudTranslationController } from './google-cloud-translation.controller';
import { AppGateway } from '../app.gateway';

@Module({
  imports: [HttpModule],
  controllers: [GoogleCloudTranslationController],
  providers: [GoogleCloudTranslationService, AppGateway],
})
export class GoogleCloudTranslationModule {}
