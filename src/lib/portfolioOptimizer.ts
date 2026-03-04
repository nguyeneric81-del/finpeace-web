/**
 * Utility functions for interacting with the portfoliooptimizer.io API
 */

export interface PortfolioOptimizationResult {
    tickers: string[];
    weights: number[];
    error?: string;
}

/**
 * Calculates the Minimum Variance Portfolio for a given set of tickers.
 * Note: In a real-world scenario, you would fetch real historical price data
 * for these tickers and calculate the empirical covariance matrix.
 * For this MVP, we are generating a simulated covariance matrix based on the tickers.
 * 
 * @param tickers Array of stock tickers (e.g., ['FPT', 'TCB', 'HPG'])
 * @returns Optimal weights for each ticker
 */
export async function calculateMinimumVariancePortfolio(tickers: string[]): Promise<PortfolioOptimizationResult> {
    if (!tickers || tickers.length < 2) {
        return { tickers, weights: tickers.map(() => 1 / (tickers.length || 1)), error: 'Need at least 2 tickers for optimization.' };
    }

    // 1. Generate a simulated positive semi-definite covariance matrix
    // In production, replace this with actual historical return covariance calculation!
    const n = tickers.length;
    const covarianceMatrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));

    // Create a symmetric diagonally dominant matrix (which is positive definite)
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const hashI = tickers[i].split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const hashJ = tickers[j].split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

            if (i === j) {
                // Variance (diagonal) - assign random but consistent variance
                // To ensure positive definiteness, value must be reasonably high compared to covariances
                covarianceMatrix[i][j] = 0.050 + (hashI % 10) * 0.010;
            } else {
                // Covariance (off-diagonal) - Must be symmetric
                const cov = 0.001 + ((hashI + hashJ) % 5) * 0.002;
                covarianceMatrix[i][j] = cov;
                covarianceMatrix[j][i] = cov; // Ensure symmetry
            }
        }
    }

    try {
        const response = await fetch('https://api.portfoliooptimizer.io/v1/portfolio/optimization/minimum-variance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                assets: n,
                assetsCovarianceMatrix: covarianceMatrix,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Portfolio Optimizer API Error:', errorText);
            return { tickers, weights: tickers.map(() => 1 / n), error: `API Error: ${response.statusText}` };
        }

        const data = await response.json();

        if (data && data.assetsWeights) {
            return {
                tickers,
                weights: data.assetsWeights,
            };
        }

        return { tickers, weights: tickers.map(() => 1 / n), error: 'Invalid response format from API' };

    } catch (error) {
        console.error('Error calling Portfolio Optimizer:', error);
        return { tickers, weights: tickers.map(() => 1 / n), error: 'Failed to connect to optimization service' };
    }
}
