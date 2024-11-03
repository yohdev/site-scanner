
import { CheerioAPI } from 'cheerio';

export function extractContent($: CheerioAPI): string[] {
  const content: string[] = [];

  $('p').each((_, element) => {
    content.push($(element).text().trim());
  });

  $('h1, h2, h3, h4, h5, h6').each((_, element) => {
    content.push($(element).text().trim());
  });

  $('li').each((_, element) => {
    content.push($(element).text().trim());
  });

  return content;
}
