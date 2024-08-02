import { Controller, Post, Body, Param } from '@nestjs/common';
import { WebSecurityTestingService } from './web-security-testing.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as https from 'https';

@Controller('web-security-testing')
export class WebSecurityTestingController {
  private readonly httpsAgent = new https.Agent({ rejectUnauthorized: false });

  constructor(
    private readonly webSecurityTestingService: WebSecurityTestingService,
    private readonly httpService: HttpService,
  ) {}

  @Post(':testName/main-test')
  async runTest(
    @Body() body: { input: string; targetUrl: string },
    @Param('testName') testName: string,
  ) {
    try {
      let response;
      console.log(
        `Sending request to ${body.targetUrl} with input: ${body.input}`,
      );
      try {
        response = await lastValueFrom(
          this.httpService.post(
            body.targetUrl,
            { input: body.input },
            { httpsAgent: this.httpsAgent },
          ),
        );
        console.log(`Received response from ${body.targetUrl}:`, response.data);
      } catch (error) {
        console.error(
          `Error during request to ${body.targetUrl}:`,
          error.message,
        );
        return {
          error: true,
          message: error.response?.statusText || error.message,
          errorType: 'network',
        };
      }

      switch (testName) {
        case 'sql-injection':
          return this.webSecurityTestingService.runSqlInjectionTest(
            body.input,
            body.targetUrl,
          );
        case 'xss':
          return this.webSecurityTestingService.runXssTest(
            body.input,
            body.targetUrl,
          );
        case 'csrf':
          return this.webSecurityTestingService.runCsrfTest(
            body.input,
            body.targetUrl,
          );
        case 'idor':
          return this.webSecurityTestingService.runIdorTest(
            body.input,
            body.targetUrl,
          );
        case 'rce':
          return this.webSecurityTestingService.runRceTest(
            body.input,
            body.targetUrl,
          );
        case 'directory-traversal':
          return this.webSecurityTestingService.runDirectoryTraversalTest(
            body.input,
            body.targetUrl,
          );
        case 'security-misconfiguration':
          return this.webSecurityTestingService.runSecurityMisconfigurationTest(
            body.input,
            body.targetUrl,
          );
        case 'sensitive-data-exposure':
          return this.webSecurityTestingService.runSensitiveDataExposureTest(
            body.input,
            body.targetUrl,
          );
        case 'broken-authentication':
          return this.webSecurityTestingService.runBrokenAuthenticationTest(
            body.input,
            body.targetUrl,
          );
        case 'access-control':
          return this.webSecurityTestingService.runAccessControlTest(
            body.input,
            body.targetUrl,
          );
        case 'cors':
          return this.webSecurityTestingService.runCorsTest(
            body.input,
            body.targetUrl,
          );
        case 'file-upload':
          return this.webSecurityTestingService.runFileUploadTest(
            body.input,
            body.targetUrl,
          );
        case 'brute-force':
          return this.webSecurityTestingService.runBruteForceTest(
            body.input,
            body.targetUrl,
          );
        case 'dos':
          return this.webSecurityTestingService.runDosTest(
            body.input,
            body.targetUrl,
          );
        case 'ssl-tls':
          return this.webSecurityTestingService.runSslTlsTest(
            body.input,
            body.targetUrl,
          );
        default:
          return {
            error: true,
            message: 'Test not implemented',
            errorType: 'server',
          };
      }
    } catch (error) {
      console.error(`Server error: ${error.message}`);
      return { error: true, message: error.message, errorType: 'server' };
    }
  }
}
