document.getElementById('urlForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const urlInput = document.getElementById('url');
    const resultDiv = document.getElementById('result');
    const submitButton = e.target.querySelector('button');
    const url = urlInput.value;

    try {
        // Disable button and show loading state
        submitButton.disabled = true;
        resultDiv.innerHTML = `
            <div class="info">
                <p>Analyzing URL... Please wait</p>
                <div class="loading-spinner"></div>
            </div>
        `;
        
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (response.ok) {
            resultDiv.innerHTML = `
                <div class="success">
                    <h3>Analysis Results</h3>
                    
                    <div class="result-section">
                        <h4>Basic Information</h4>
                        <p><strong>URL:</strong> ${data.url}</p>
                        <p><strong>Status:</strong> ${data.status} ${getStatusText(data.status)}</p>
                        <p><strong>Response Time:</strong> ${data.responseTime}ms</p>
                        <p><strong>Content Type:</strong> ${data.contentType}</p>
                        <p><strong>Server:</strong> ${data.server}</p>
                    </div>

                    <div class="result-section">
                        <h4>SEO Information</h4>
                        <p><strong>Title:</strong> ${data.seo.title}</p>
                        <p><strong>Description:</strong> ${data.seo.description}</p>
                    </div>

                    <div class="result-section">
                        <h4>Security</h4>
                        <p><strong>HTTPS:</strong> ${data.security.https ? '✅ Yes' : '❌ No'}</p>
                        <p><strong>HSTS:</strong> ${data.security.hsts ? '✅ Enabled' : '❌ Disabled'}</p>
                    </div>

                    <div class="result-section">
                        <h4>Response Headers</h4>
                        <pre>${JSON.stringify(data.headers, null, 2)}</pre>
                    </div>
                </div>
            `;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="error">
                <h3>Error</h3>
                <p>${error.message}</p>
                ${error.details ? `<p class="error-details">${error.details}</p>` : ''}
                <p class="error-help">Please check the URL and try again.</p>
            </div>
        `;
    } finally {
        // Re-enable button
        submitButton.disabled = false;
    }
});

function getStatusText(status) {
    const statusTexts = {
        200: '(OK)',
        201: '(Created)',
        301: '(Moved Permanently)',
        302: '(Found)',
        400: '(Bad Request)',
        401: '(Unauthorized)',
        403: '(Forbidden)',
        404: '(Not Found)',
        500: '(Internal Server Error)',
        502: '(Bad Gateway)',
        503: '(Service Unavailable)'
    };
    return statusTexts[status] || '';
}