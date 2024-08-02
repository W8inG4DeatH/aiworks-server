import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiProcessModule } from './ai-process/ai-process.module';
import { TeamsChatsProcessingModule } from './teams-chats-processing/teams-chats-processing.module';
import { FilesModule } from './files/files.module';
import { GoogleCloudTranslationModule } from './google-cloud-translation/google-cloud-translation.module';
import { WebSecurityTestingModule } from './web-security-testing/web-security-testing.module';
import { AppGateway } from './app.gateway';
import { MicrosoftAuthService } from './auth/microsoft.auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AiProcessModule,
    TeamsChatsProcessingModule,
    FilesModule,
    GoogleCloudTranslationModule,
    WebSecurityTestingModule,
  ],
  providers: [AppGateway, MicrosoftAuthService],
})
export class AppModule {}
