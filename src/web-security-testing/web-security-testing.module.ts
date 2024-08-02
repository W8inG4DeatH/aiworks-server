import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WebSecurityTestingController } from './web-security-testing.controller';
import { WebSecurityTestingService } from './web-security-testing.service';

@Module({
  imports: [HttpModule],
  controllers: [WebSecurityTestingController],
  providers: [WebSecurityTestingService],
})
export class WebSecurityTestingModule {}
