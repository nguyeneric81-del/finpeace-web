const https = require('https');

// Helper function to make POST requests
function post(url, data) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: 443,
            path: urlObj.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.write(JSON.stringify(data));
        req.end();
    });
}

async function runTest() {
    console.log('🚀 Starting Portfolio Optimizer API Test...');

    const tickers = ['FPT', 'TCB', 'HPG'];

    // A valid symmetric positive semi-definite covariance matrix for 3 assets
    // e.g., FPT is less volatile, TCB is more volatile.
    const assetsCovarianceMatrix = [
        [0.0025, 0.0010, 0.0005],
        [0.0010, 0.0100, 0.0020],
        [0.0005, 0.0020, 0.0075]
    ];

    console.log('📊 1. Prepared Historical Covariance Matrix for:', tickers.join(', '));
    console.table(assetsCovarianceMatrix);

    try {
        // Calculate Minimum Variance Portfolio
        console.log('\n⚖️ 2. Requesting Minimum Variance Portfolio Allocation...');
        const minVarResponse = await post('https://api.portfoliooptimizer.io/v1/portfolio/optimization/minimum-variance', {
            assets: 3,
            assetsCovarianceMatrix: assetsCovarianceMatrix
        });

        if (!minVarResponse.assetsWeights) {
            throw new Error('Failed to get portfolio weights: ' + JSON.stringify(minVarResponse));
        }

        // Output Results
        console.log('\n🎯 === OPTIMAL ALLOCATION (Minimum Variance) ===');
        minVarResponse.assetsWeights.forEach((weight, index) => {
            console.log(`- ${tickers[index]}: ${(weight * 100).toFixed(2)}%`);
        });
        console.log('===============================================\n');
        console.log('💡 Rationale: This allocation mathematically minimizes the overall volatility based on the historical correlation between these 3 assets.');

    } catch (error) {
        console.error('❌ Error during API test:', error.message || error);
    }
}

runTest();
