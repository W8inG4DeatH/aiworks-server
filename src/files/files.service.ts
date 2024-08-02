import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IAiFile } from './files.interfaces';

@Injectable()
export class FilesService {
  async searchFiles({
    path: dirPath,
    fileExtension,
    filters,
  }: {
    path: string;
    fileExtension: string;
    filters: string[];
  }): Promise<IAiFile[]> {
    const files = await this.findFiles(dirPath, fileExtension, filters);
    return files.map((file) => ({
      Name: path.basename(file),
      FullPath: file,
      Selected: true,
      Processed: false,
      Done: false,
    }));
  }

  private async findFiles(
    dirPath: string,
    extension: string,
    filters: string[],
  ): Promise<string[]> {
    const files: string[] = [];

    const readDir = async (dir: string) => {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          await readDir(fullPath);
        } else if (entry.isFile() && entry.name.endsWith(extension)) {
          const fileContent = await fs.promises.readFile(fullPath, 'utf-8');
          if (
            filters.length === 0 ||
            filters.some((filter) => fileContent.includes(filter))
          ) {
            files.push(fullPath);
          }
        }
      }
    };

    await readDir(dirPath);

    return files;
  }

  async readAllTxtFiles(dirPath: string): Promise<IAiFile[]> {
    const files: IAiFile[] = [];
    const readDir = async (dir: string) => {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          await readDir(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.txt')) {
          const content = await fs.promises.readFile(fullPath, 'utf-8');
          files.push({
            Name: entry.name,
            FullPath: fullPath,
            Content: content,
            Selected: false,
            Processed: false,
            Done: false,
          });
        }
      }
    };

    await readDir(dirPath);
    return files;
  }

  async updateTxtFile(file: IAiFile): Promise<void> {
    await fs.promises.writeFile(file.FullPath, file.Content || '', 'utf-8');
  }

  async deleteTxtFile(file: IAiFile): Promise<void> {
    await fs.promises.unlink(file.FullPath);
  }
}
