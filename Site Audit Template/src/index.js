import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { analyzeUrl } from './services/analyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('src/public'));

// Error handler middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        details: err.message
    });
});

// Routes
app.post('/analyze', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ 
                error: 'URL is required',
                details: 'Please provide a URL to analyze'
            });
        }

        // Basic URL validation
        try {
            new URL(url);
        } catch (e) {
            return res.status(400).json({ 
                error: 'Invalid URL format',
                details: 'Please provide a valid URL including the protocol (http:// or https://)'
            });
        }

        const analysis = await analyzeUrl(url);
        res.json(analysis);
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            error: error.message || 'Failed to analyze URL',
            details: error.details || 'An unexpected error occurred',
            code: error.code
        });
    }
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});