import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { AppGateway } from '../app.gateway';

@Injectable()
export class GoogleCloudTranslationService {
  private apiKey = 'api.keys';
  private apiUrl = 'https://translation.googleapis.com/language/translate/v2';
  private translationProgress: {
    [key: string]: { status: string; language: string };
  } = {};

  constructor(
    private http: HttpService,
    private gateway: AppGateway,
  ) {}

  async translateText(text: string, targetLanguage: string): Promise<string> {
    const response = await this.http
      .post(this.apiUrl, null, {
        params: {
          q: text,
          target: targetLanguage,
          key: this.apiKey,
        },
      })
      .toPromise();

    return response.data.data.translations[0].translatedText;
  }

  async translateFile(
    projectDirectoryPath: string[],
    sourceFileName: string,
    sourceLanguage: string,
    targetLanguages: string[],
  ) {
    const sourceFilePath = join(...projectDirectoryPath, sourceFileName);

    try {
      const sourceData = await readFile(sourceFilePath, 'utf-8');
      const sourceTranslations = JSON.parse(sourceData);

      for (const targetLanguage of targetLanguages) {
        const targetFilePath = join(
          ...projectDirectoryPath,
          `${targetLanguage}.json`,
        );
        let translations = {};

        try {
          const data = await readFile(targetFilePath, 'utf-8');
          translations = JSON.parse(data);
        } catch (error) {
          // If file does not exist, initialize an empty translations object
        }

        await this.translateRecursive(
          sourceTranslations,
          translations,
          targetLanguage,
        );

        await writeFile(
          targetFilePath,
          JSON.stringify(translations, null, 2),
          'utf-8',
        );
        this.translationProgress[targetLanguage] = {
          status: 'completed',
          language: targetLanguage,
        };
        // Emit progress for each language
        this.gateway.server.emit(
          'translation.progress',
          this.translationProgress[targetLanguage],
        );
      }
    } catch (error) {
      console.error(`Error reading source file: ${error.message}`);
      throw error;
    }

    return { message: 'Translation complete' };
  }

  async translateRecursive(source: any, target: any, targetLanguage: string) {
    for (const key in source) {
      if (typeof source[key] === 'object') {
        if (!target[key]) {
          target[key] = {};
        }
        await this.translateRecursive(source[key], target[key], targetLanguage);
      } else {
        if (!target.hasOwnProperty(key)) {
          target[key] = await this.translateText(source[key], targetLanguage);
        }
      }
    }

    // Reorder keys in target to match the order of keys in source
    const orderedTarget = this.orderKeys(source, target);
    Object.assign(target, orderedTarget);
  }

  orderKeys(source: any, target: any): any {
    const orderedTarget = {};
    for (const key in source) {
      if (target.hasOwnProperty(key)) {
        if (
          typeof source[key] === 'object' &&
          typeof target[key] === 'object'
        ) {
          orderedTarget[key] = this.orderKeys(source[key], target[key]);
        } else {
          orderedTarget[key] = target[key];
        }
      }
    }
    return orderedTarget;
  }

  getTranslationProgress(language: string) {
    return (
      this.translationProgress[language] || { status: 'not_started', language }
    );
  }
}
