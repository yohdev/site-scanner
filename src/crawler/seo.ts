import { SEOData } from '../types/audit';
import { CheerioAPI } from 'cheerio';

export async function analyzeSEO($: CheerioAPI): Promise<SEOData> {
  const seoData: SEOData = {
    keywords: [],
    metadata: {},
  };
  
  // Extract metadata
  $('meta').each((_, element) => {
    const name = $(element).attr('name');
    const content = $(element).attr('content');
    if (name && content) {
      seoData.metadata[name] = content;
    }
  });
  
  // Extract keywords
  const keywordsContent = $('meta[name="keywords"]').attr('content');
  if (keywordsContent) {
    seoData.keywords = keywordsContent.split(',').map(k => k.trim());
  }
  
  // Extract additional SEO-relevant content
  const title = $('title').text();
  if (title) {
    seoData.metadata['title'] = title;
  }
  
  const description = $('meta[name="description"]').attr('content');
  if (description) {
    seoData.metadata['description'] = description;
  }
  
  // Check for structured data
  const structuredData = $('script[type="application/ld+json"]');
  if (structuredData.length > 0) {
    seoData.metadata['hasStructuredData'] = 'true';
  }
  
  return seoData;
}