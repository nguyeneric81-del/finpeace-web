import { calculateMinimumVariancePortfolio } from './src/lib/portfolioOptimizer';

async function main() {
  const result = await calculateMinimumVariancePortfolio(['VHM', 'VJC', 'VIB', 'VCB', 'SSI']);
  console.log(result);
}
main();
