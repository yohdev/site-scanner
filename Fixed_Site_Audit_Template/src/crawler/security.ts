
import { Page } from 'puppeteer';

export async function analyzeSecurity(page: Page): Promise<{ ssl: boolean }> {
  const ssl = page.url().startsWith('https');
  return { ssl };
}
