import { Security } from '../types/audit';
import { Page } from 'puppeteer';

export async function analyzeSecurity(page: Page): Promise<Security> {
  const security: Security = {
    ssl: false,
    protocols: [],
    vulnerabilities: [],
  };
  
  // Check SSL
  const url = page.url();
  security.ssl = url.startsWith('https://');
  
  // Get security headers
  const securityHeaders = await page.evaluate(() => {
    return {
      contentSecurity: document.head.querySelector('meta[http-equiv="Content-Security-Policy"]')?.getAttribute('content'),
      xFrameOptions: document.head.querySelector('meta[http-equiv="X-Frame-Options"]')?.getAttribute('content'),
      xContentTypeOptions: document.head.querySelector('meta[http-equiv="X-Content-Type-Options"]')?.getAttribute('content'),
    };
  });
  
  // Analyze security protocols
  if (security.ssl) {
    security.protocols.push('HTTPS');
    // Check TLS version
    try {
      const response = await page.evaluate(() => {
        // @ts-ignore
        return window.performance.getEntriesByType('resource')[0].nextHopProtocol;
      });
      if (response) {
        security.protocols.push(response.toUpperCase());
      }
    } catch (error) {
      console.error('Error detecting TLS version:', error);
    }
  }
  
  // Check for common vulnerabilities
  if (!securityHeaders.contentSecurity) {
    security.vulnerabilities?.push('Missing Content Security Policy');
  }
  if (!securityHeaders.xFrameOptions) {
    security.vulnerabilities?.push('Missing X-Frame-Options header');
  }
  if (!securityHeaders.xContentTypeOptions) {
    security.vulnerabilities?.push('Missing X-Content-Type-Options header');
  }
  
  return security;
}