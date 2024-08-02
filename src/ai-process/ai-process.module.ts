import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AiProcessService } from './ai-process.service';
import { AiProcessController } from './ai-process.controller';

@Module({
  imports: [HttpModule],
  controllers: [AiProcessController],
  providers: [AiProcessService],
})
export class AiProcessModule {}
