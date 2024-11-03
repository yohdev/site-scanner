import { ContentAsset, Navigation } from '../types/audit';
import { CheerioAPI } from 'cheerio';

interface ContentAnalysis {
  assets: ContentAsset[];
  navigation: Navigation;
}

export async function extractContent($: CheerioAPI): Promise<ContentAnalysis> {
  const content: ContentAnalysis = {
    assets: [],
    navigation: {
      primary: [],
      secondary: [],
      tertiary: [],
    },
  };
  
  // Extract images
  $('img').each((_, element) => {
    const src = $(element).attr('src');
    if (src) {
      content.assets.push({
        type: 'image',
        location: src,
      });
    }
  });
  
  // Extract videos
  $('video source').each((_, element) => {
    const src = $(element).attr('src');
    if (src) {
      content.assets.push({
        type: 'video',
        location: src,
      });
    }
  });
  
  // Extract navigation
  // Primary navigation (usually main menu)
  $('nav, header').find('a').each((_, element) => {
    const text = $(element).text().trim();
    if (text) {
      content.navigation.primary.push(text);
    }
  });
  
  // Secondary navigation (usually footer or sidebar)
  $('footer').find('a').each((_, element) => {
    const text = $(element).text().trim();
    if (text) {
      content.navigation.secondary.push(text);
    }
  });
  
  // Tertiary navigation (additional menus)
  $('aside').find('a').each((_, element) => {
    const text = $(element).text().trim();
    if (text) {
      content.navigation.tertiary?.push(text);
    }
  });
  
  return content;
}