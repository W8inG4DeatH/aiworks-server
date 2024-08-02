import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { AppGateway } from '../app.gateway';

@Module({
  imports: [HttpModule],
  controllers: [FilesController],
  providers: [FilesService, AppGateway],
})
export class FilesModule {}
