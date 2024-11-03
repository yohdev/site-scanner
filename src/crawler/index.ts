import puppeteer from 'puppeteer';
import { load } from 'cheerio';
import { SiteAudit } from '../types/audit';
import { analyzeSecurity } from './security';
import { analyzePerformance } from './performance';
import { detectTechnologies } from './technologies';
import { analyzeSEO } from './seo';
import { extractContent } from './content';

export async function crawlSite(url: string): Promise<SiteAudit> {
  const browser = await puppeteer.launch();
  const pages = new Set<string>();
  const visited = new Set<string>();
  
  try {
    pages.add(url);
    
    while (pages.size > 0) {
      const currentUrl = Array.from(pages)[0];
      pages.delete(currentUrl);
      
      if (visited.has(currentUrl)) continue;
      visited.add(currentUrl);
      
      const page = await browser.newPage();
      await page.goto(currentUrl, { waitUntil: 'networkidle0' });
      
      // Extract links and add to pages set
      const links = await page.$$eval('a', anchors => 
        anchors.map(a => a.href).filter(href => 
          href.startsWith(url)
        )
      );
      links.forEach(link => pages.add(link));
      
      // Collect page data
      const html = await page.content();
      const $ = load(html);
      
      // Run various analyses
      const technologies = await detectTechnologies(page);
      const security = await analyzeSecurity(page);
      const performance = await analyzePerformance(page);
      const seo = await analyzeSEO($);
      const content = await extractContent($);
      
      await page.close();
    }
    
    // Compile final audit data
    const auditData: SiteAudit = {
      id: Date.now().toString(),
      url,
      lastUpdated: new Date(),
      totalPages: visited.size,
      stack: {
        languages: ['JavaScript', 'HTML', 'CSS'],
        frameworks: [],
        libraries: [],
      },
      database: {
        type: 'Unknown',
      },
      integrations: [],
      plugins: [],
      content: {
        assets: [],
        seo: {
          keywords: [],
          metadata: {},
        },
      },
      navigation: {
        primary: [],
        secondary: [],
      },
      performance: {
        loadTime: '0s',
        protocols: [],
      },
      security: {
        ssl: false,
        protocols: [],
      },
      analytics: {
        provider: 'Unknown',
        metrics: {},
      },
    };
    
    return auditData;
    
  } finally {
    await browser.close();
  }
}