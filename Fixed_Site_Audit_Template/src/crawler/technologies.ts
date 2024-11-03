
import { Page } from 'puppeteer';

export async function detectTechnologies(page: Page): Promise<string[]> {
  const technologies: string[] = [];

  const scripts = await page.$$eval('script', elements => elements.map(el => el.src));
  if (scripts.some(src => src.includes('react'))) technologies.push('React');
  if (scripts.some(src => src.includes('vue'))) technologies.push('Vue.js');
  if (scripts.some(src => src.includes('angular'))) technologies.push('Angular');
  if (scripts.some(src => src.includes('jquery'))) technologies.push('jQuery');

  return technologies;
}
