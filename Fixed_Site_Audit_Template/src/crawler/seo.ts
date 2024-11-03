
import { CheerioAPI } from 'cheerio';

export function analyzeSEO($: CheerioAPI): { title: string, description: string } {
  const title = $('title').text().trim() || 'No title found';
  const description = $('meta[name="description"]').attr('content')?.trim() || 'No description found';

  return { title, description };
}
