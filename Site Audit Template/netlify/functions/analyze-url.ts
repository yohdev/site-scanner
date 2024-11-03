import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';
import { load } from 'cheerio';
import type { CheerioAPI } from 'cheerio';

const handler: Handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        error: 'Method not allowed',
        details: 'Only POST requests are accepted'
      })
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing request body',
          details: 'Request body is required'
        })
      };
    }

    let requestData;
    try {
      requestData = JSON.parse(event.body);
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid JSON',
          details: 'Request body must be valid JSON'
        })
      };
    }

    const { url } = requestData;

    if (!url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'URL is required',
          details: 'Please provide a URL to analyze'
        })
      };
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid URL format',
          details: 'Please provide a valid URL including the protocol (http:// or https://)'
        })
      };
    }

    const startTime = Date.now();
    let response;
    try {
      response = await fetch(parsedUrl.toString(), {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SiteAuditTool/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br'
        }
      });
    } catch (e) {
      const error = e as Error;
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          error: 'Failed to fetch URL',
          details: error.message
        })
      };
    }

    const responseTime = Date.now() - startTime;

    try {
      const html = await response.text();
      const $ = load(html);

      const result = {
        url: parsedUrl.toString(),
        status: response.status,
        responseTime,
        contentType: response.headers.get('content-type'),
        seo: {
          title: $('title').text().trim() || 'No title found',
          description: $('meta[name="description"]').attr('content')?.trim() || 'No description found'
        },
        security: {
          https: parsedUrl.protocol === 'https:',
          hsts: !!response.headers.get('strict-transport-security')
        },
        technologies: detectTechnologies($)
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result)
      };
    } catch (e) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Failed to parse response',
          details: 'Could not analyze the website content'
        })
      };
    }
  } catch (error) {
    console.error('Analysis error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'An unexpected error occurred'
      })
    };
  }
};

function detectTechnologies($: CheerioAPI): string[] {
  const technologies: string[] = [];

  // Detect JavaScript frameworks
  if ($('script[src*="react"]').length) technologies.push('React');
  if ($('script[src*="vue"]').length) technologies.push('Vue.js');
  if ($('script[src*="angular"]').length) technologies.push('Angular');
  if ($('script[src*="jquery"]').length) technologies.push('jQuery');

  // Detect CSS frameworks
  if ($('[class*="bootstrap"]').length) technologies.push('Bootstrap');
  if ($('[class*="tailwind"]').length) technologies.push('Tailwind CSS');

  // Detect CMS
  if ($('meta[name="generator"][content*="WordPress"]').length) technologies.push('WordPress');
  if ($('meta[name="generator"][content*="Drupal"]').length) technologies.push('Drupal');

  return technologies;
}

export { handler };