import fetch from 'node-fetch';
import https from 'https';

// Create HTTPS agent with better SSL handling
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    keepAlive: true,
    timeout: 30000
});

export async function analyzeUrl(url) {
    try {
        // Validate and clean the URL
        const parsedUrl = new URL(url);
        const startTime = Date.now();
        
        const response = await fetch(parsedUrl.toString(), {
            agent: parsedUrl.protocol === 'https:' ? httpsAgent : null,
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; URLAnalyzer/1.0)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive'
            },
            follow: 5, // Follow up to 5 redirects
            compress: true
        });

        const responseTime = Date.now() - startTime;
        const contentType = response.headers.get('content-type') || 'Unknown';
        
        // Only try to parse HTML if content-type is HTML
        let title = 'No title found';
        let metaDescription = 'No description found';
        
        if (contentType.includes('text/html')) {
            const html = await response.text();
            
            // More robust title extraction
            const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
            if (titleMatch) {
                title = titleMatch[1].trim();
            }
            
            // More robust meta description extraction
            const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
                            html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i);
            if (metaMatch) {
                metaDescription = metaMatch[1].trim();
            }
        }

        // Convert headers to a plain object
        const headers = {};
        for (const [key, value] of response.headers) {
            headers[key] = value;
        }
        
        return {
            url: parsedUrl.toString(),
            status: response.status,
            responseTime,
            contentType,
            server: response.headers.get('server') || 'Unknown',
            headers,
            seo: {
                title,
                description: metaDescription
            },
            security: {
                https: parsedUrl.protocol === 'https:',
                hsts: !!response.headers.get('strict-transport-security'),
                xssProtection: !!response.headers.get('x-xss-protection'),
                contentSecurityPolicy: !!response.headers.get('content-security-policy')
            }
        };
    } catch (error) {
        console.error('Analysis error:', error);
        
        let errorMessage = 'Failed to analyze URL';
        let errorDetails = error.message;
        
        if (error.name === 'AbortError') {
            errorMessage = 'Request timed out';
            errorDetails = 'The server took too long to respond';
        } else if (error.code === 'ENOTFOUND') {
            errorMessage = 'Domain not found';
            errorDetails = 'The domain does not exist or DNS resolution failed';
        } else if (error.code === 'ECONNREFUSED') {
            errorMessage = 'Connection refused';
            errorDetails = 'The server actively refused the connection';
        } else if (error.code === 'CERT_HAS_EXPIRED') {
            errorMessage = 'SSL certificate expired';
            errorDetails = 'The website\'s SSL certificate has expired';
        } else if (error.type === 'system') {
            errorMessage = 'Network error';
            errorDetails = 'A network error occurred while trying to reach the server';
        }
        
        throw {
            message: errorMessage,
            details: errorDetails,
            code: error.code || 'UNKNOWN_ERROR'
        };
    }
}