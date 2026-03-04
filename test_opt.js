const fetch = require('node-fetch');

async function testOpt() {
    const assets = [
        { ticker: 'SSI', price_series: [30, 31, 31, 30, 29, 31, 32, 32, 33, 34, 35, 36, 36, 37, 38, 39, 39, 40, 41, 42] },
        { ticker: 'VIX', price_series: [10.5, 11.2, 11.5, 12.1, 13, 14.2, 15.5, 16.3, 16.8, 17.2, 17.5, 17.8, 18.1, 18.3, 18.5, 19, 19.2, 19.5, 20.8, 21.5] },
        { ticker: 'FPT', price_series: [60, 62, 63, 65, 66, 68, 70, 71, 73, 75, 76, 78, 79, 80, 82, 85, 88, 90, 93, 95] }
    ];

    const n = assets.length;
    const minLen = Math.min(...assets.map(a => Array.isArray(a.price_series) ? a.price_series.length : 0));

    const formattedAssets = [];

    for (let i = 0; i < n; i++) {
        const prices = assets[i].price_series.slice(0, minLen);
        const returns = [];
        for (let t = 1; t < minLen; t++) {
            const pt1 = Math.max(prices[t - 1], 0.0001);
            const pt = Math.max(prices[t], 0.0001);
            returns.push(Math.log(pt / pt1));
        }
        // Nest in assetReturns
        formattedAssets.push({ assetReturns: returns });
    }

    try {
        console.log("Testing { assets: [{ assetReturns }] }...");
        const covResponse = await fetch('https://api.portfoliooptimizer.io/v1/assets/covariance/matrix/estimation/empirical', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                assets: formattedAssets
            }),
        });

        if (!covResponse.ok) {
            console.error('Covariance Error:', await covResponse.text());
        } else {
            const covData = await covResponse.json();
            console.log("Covariance Success!");

            await new Promise(r => setTimeout(r, 2000));

            const minVarResponse = await fetch('https://api.portfoliooptimizer.io/v1/portfolio/optimization/minimum-variance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assets: n, assetsCovarianceMatrix: covData.assetsCovarianceMatrix }),
            });

            if (!minVarResponse.ok) {
                console.error('MinVar Error:', await minVarResponse.text());
            } else {
                console.log("MinVar Success:", await minVarResponse.json());
            }
        }
    } catch (err) {
        console.error(err);
    }
}
testOpt();
