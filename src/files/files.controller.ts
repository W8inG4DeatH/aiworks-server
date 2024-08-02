import { Controller, Post, Body, Put, Delete } from '@nestjs/common';
import { FilesService } from './files.service';
import { IAiFile } from './files.interfaces';

@Controller('api/files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('search')
  async searchFiles(
    @Body()
    searchParams: {
      path: string;
      fileExtension: string;
      filters: string[];
    },
  ): Promise<IAiFile[]> {
    return this.filesService.searchFiles(searchParams);
  }

  @Post('txt/readall')
  async readAllTxtFiles(@Body('path') path: string): Promise<IAiFile[]> {
    return this.filesService.readAllTxtFiles(path);
  }

  @Put('txt/update')
  async updateTxtFile(@Body() file: IAiFile): Promise<void> {
    return this.filesService.updateTxtFile(file);
  }

  @Delete('txt/delete')
  async deleteTxtFile(@Body() file: IAiFile): Promise<void> {
    return this.filesService.deleteTxtFile(file);
  }
}
