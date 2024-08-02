export interface IAiFile {
  Name: string;
  FullPath: string;
  Content?: string;
  InputTokens?: number;
  OutputTokens?: number;
  CostInDollars?: number;
  Selected: boolean;
  Processed: boolean;
  Done: boolean;
}

export enum IOpenAIModel {
  GPT4o = 'gpt-4o',
  GPT4Turbo = 'gpt-4-turbo',
  GPT4 = 'gpt-4',
  GPT35 = 'gpt-3.5-turbo-0125',
}
