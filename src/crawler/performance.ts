import { Performance } from '../types/audit';
import { Page } from 'puppeteer';
import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';

export async function analyzePerformance(page: Page): Promise<Performance> {
  const performance: Performance = {
    loadTime: '0s',
    bottlenecks: [],
  };
  
  // Measure page load time
  const metrics = await page.metrics();
  performance.loadTime = `${(metrics.TaskDuration / 1000).toFixed(2)}s`;
  
  try {
    // Launch a Chrome instance
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = {
      port: chrome.port,
      output: 'json',
      onlyCategories: ['performance'],
    };

    // Run Lighthouse
    const runnerResult = await lighthouse(page.url(), options);

    // Collect audit results
    const audits = runnerResult.lhr.audits;
    
    // Analyze performance bottlenecks
    if (audits['largest-contentful-paint'].score < 0.9) {
      performance.bottlenecks.push('Slow Largest Contentful Paint');
    }
    if (audits['total-blocking-time'].score < 0.9) {
      performance.bottlenecks.push('High Total Blocking Time');
    }
    if (audits['cumulative-layout-shift'].score < 0.9) {
      performance.bottlenecks.push('Layout Shifts Detected');
    }
    
    // Set cache strategy if detected
    if (audits['uses-long-cache-ttl'].score > 0) {
      performance.cacheStrategy = 'Browser caching enabled';
    }

    // Close Chrome after the audit
    await chrome.kill();
  } catch (error) {
    console.error('Error running Lighthouse:', error);
    performance.bottlenecks.push('Unable to complete performance audit');
  }
  
  return performance;
}