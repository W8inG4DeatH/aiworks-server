import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfidentialClientApplication } from '@azure/msal-node';

@Injectable()
export class MicrosoftAuthService {
  private msalClient: ConfidentialClientApplication;

  constructor() {
    this.msalClient = new ConfidentialClientApplication({
      auth: {
        clientId: '',
        authority: ``,
        clientSecret: '',
      },
    });
  }

  async getAccessToken(): Promise<string> {
    try {
      const tokenResponse =
        await this.msalClient.acquireTokenByClientCredential({
          scopes: ['https://graph.microsoft.com/.default'],
        });

      console.log('Acquired token:', tokenResponse.accessToken);
      return tokenResponse.accessToken;
    } catch (error) {
      console.error(
        'Error acquiring token:',
        error.response?.data || error.message || error,
      );
      throw new InternalServerErrorException('Error acquiring access token');
    }
  }
}
