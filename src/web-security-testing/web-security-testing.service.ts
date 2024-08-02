import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import * as https from 'https';

@Injectable()
export class WebSecurityTestingService {
  private httpsAgent = new https.Agent({ rejectUnauthorized: false });

  constructor(private httpService: HttpService) {}

  async runTest(testName: string, input: string, targetUrl: string) {
    try {
      console.log(
        `Running ${testName} test on ${targetUrl} with input: ${input}`,
      );
      const response = await firstValueFrom(
        this.httpService
          .post(targetUrl, { input }, { httpsAgent: this.httpsAgent })
          .pipe(
            catchError((error: AxiosError) => {
              console.error(
                `Error during ${testName} test on ${targetUrl}:`,
                error.message,
              );
              throw {
                error: true,
                message: error.message,
                errorType: error.response ? 'server' : 'network',
              };
            }),
          ),
      );

      console.log(`${testName} test on ${targetUrl} completed successfully`);
      return this.analyzeResponse(testName, response.data, input);
    } catch (error) {
      console.error(`Error in ${testName} test: ${error.message}`);
      return error;
    }
  }

  analyzeResponse(testName: string, responseData: any, input: string) {
    let result = 'No Vulnerability';
    let message = `No ${testName} vulnerability detected`;

    // Example conditions for different tests
    if (testName === 'SQL Injection' && /syntax error/i.test(responseData)) {
      result = 'Vulnerability';
      message = 'Potential SQL Injection vulnerability detected';
    } else if (
      testName === 'XSS' &&
      /<script>alert\('XSS'\);<\/script>/i.test(responseData)
    ) {
      result = 'Vulnerability';
      message = 'Potential XSS vulnerability detected';
    } else if (
      testName === 'CSRF' &&
      responseData.includes('invalid_csrf_token')
    ) {
      result = 'Vulnerability';
      message = 'Potential CSRF vulnerability detected';
    }

    return {
      result,
      message,
      input,
      response: responseData,
    };
  }

  async runSqlInjectionTest(input: string, targetUrl: string) {
    return this.runTest('SQL Injection', input, targetUrl);
  }

  async runXssTest(input: string, targetUrl: string) {
    return this.runTest('XSS', input, targetUrl);
  }

  async runCsrfTest(input: string, targetUrl: string) {
    return this.runTest('CSRF', input, targetUrl);
  }

  async runIdorTest(input: string, targetUrl: string) {
    return this.runTest('IDOR', input, targetUrl);
  }

  async runRceTest(input: string, targetUrl: string) {
    return this.runTest('RCE', input, targetUrl);
  }

  async runDirectoryTraversalTest(input: string, targetUrl: string) {
    return this.runTest('Directory Traversal', input, targetUrl);
  }

  async runSecurityMisconfigurationTest(input: string, targetUrl: string) {
    return this.runTest('Security Misconfiguration', input, targetUrl);
  }

  async runSensitiveDataExposureTest(input: string, targetUrl: string) {
    return this.runTest('Sensitive Data Exposure', input, targetUrl);
  }

  async runBrokenAuthenticationTest(input: string, targetUrl: string) {
    return this.runTest('Broken Authentication', input, targetUrl);
  }

  async runAccessControlTest(input: string, targetUrl: string) {
    return this.runTest('Access Control', input, targetUrl);
  }

  async runCorsTest(input: string, targetUrl: string) {
    return this.runTest('CORS', input, targetUrl);
  }

  async runFileUploadTest(input: string, targetUrl: string) {
    return this.runTest('File Upload', input, targetUrl);
  }

  async runBruteForceTest(input: string, targetUrl: string) {
    return this.runTest('Brute Force', input, targetUrl);
  }

  async runDosTest(input: string, targetUrl: string) {
    return this.runTest('DoS', input, targetUrl);
  }

  async runSslTlsTest(input: string, targetUrl: string) {
    return this.runTest('SSL/TLS', input, targetUrl);
  }
}
