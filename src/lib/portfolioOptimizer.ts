/**
 * Utility functions for interacting with the portfoliooptimizer.io API
 */

export interface PortfolioOptimizationResult {
    tickers: string[];
    weights: number[];
    error?: string;
}

export interface TickerData {
    ticker: string;
    price_series?: number[];
}

export interface PortfolioOptimizationResult {
    tickers: string[];
    weights: number[];
    error?: string;
}

export async function calculateMinimumVariancePortfolio(assets: TickerData[]): Promise<PortfolioOptimizationResult> {
    const tickers = assets.map(a => a.ticker);
    const n = tickers.length;

    if (!assets || n < 2) {
        return { tickers, weights: tickers.map(() => 1 / (n || 1)), error: 'Need at least 2 tickers for optimization.' };
    }

    // Prepare returns data
    const assetsReturns: number[][] = [];
    const minLen = Math.min(...assets.map(a => Array.isArray(a.price_series) ? a.price_series.length : 0));

    // Fallback if price_series is missing or too short
    if (minLen < 5) {
        console.warn('Missing or too short price_series data. Falling back to simple even weights.');
        return { tickers, weights: tickers.map(() => 1 / n), error: 'Insufficient price data.' };
    }

    // Calculate logarithmic returns: r_t = ln(P_t / P_{t-1})
    for (let i = 0; i < n; i++) {
        const prices = assets[i].price_series!.slice(0, minLen);
        const returns: number[] = [];
        for (let t = 1; t < minLen; t++) {
            const pt1 = Math.max(prices[t - 1], 0.0001); // Avoid div by zero or log negative
            const pt = Math.max(prices[t], 0.0001);
            returns.push(Math.log(pt / pt1));
        }
        assetsReturns.push(returns);
    }

    try {
        // Step 1: Calculate Empirical Covariance Matrix
        const formattedAssets = assetsReturns.map(returns => ({
            assetReturns: returns
        }));

        const covResponse = await fetch('https://api.portfoliooptimizer.io/v1/assets/covariance/matrix/estimation/empirical', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assets: formattedAssets }),
        });

        if (!covResponse.ok) {
            console.error('Portfolio Optimizer Covariance Error:', await covResponse.text());
            return { tickers, weights: tickers.map(() => 1 / n), error: `Covariance API Error: ${covResponse.statusText}` };
        }

        const covData = await covResponse.json();
        const covarianceMatrix = covData.assetsCovarianceMatrix;

        // Step 2: Calculate Minimum Variance Portfolio
        const minVarResponse = await fetch('https://api.portfoliooptimizer.io/v1/portfolio/optimization/minimum-variance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                assets: n,
                assetsCovarianceMatrix: covarianceMatrix,
            }),
        });

        if (!minVarResponse.ok) {
            console.error('Portfolio Optimizer MinVar Error:', await minVarResponse.text());
            return { tickers, weights: tickers.map(() => 1 / n), error: `MinVar API Error: ${minVarResponse.statusText}` };
        }

        const data = await minVarResponse.json();

        if (data && data.assetsWeights) {
            return {
                tickers,
                weights: data.assetsWeights,
            };
        }

        return { tickers, weights: tickers.map(() => 1 / n), error: 'Invalid response format from optimization API' };

    } catch (error) {
        console.error('Error calling Portfolio Optimizer:', error);
        return { tickers, weights: tickers.map(() => 1 / n), error: 'Failed to connect to optimization service' };
    }
}
