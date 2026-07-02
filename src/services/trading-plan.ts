import { getLatestYieldCurveSignal } from '../lib/macro-insights';

export interface TradingPlanContext {
  userId: string;
  portfolioValue: number;
  currentRiskTolerance: 'Aggressive' | 'Moderate' | 'Conservative';
}

export async function adjustTradingPlanByMacroSignal(context: TradingPlanContext) {
  const yieldSignal = await getLatestYieldCurveSignal();
  
  if (!yieldSignal) {
    console.warn("No yield curve signal found, proceeding with default trading plan constraints.");
    return {
      action: 'HOLD',
      reason: 'No macroeconomic signal data available.',
      maxEquityExposure: context.currentRiskTolerance === 'Aggressive' ? 0.9 : 0.6
    };
  }
  
  // Adjust based on the model's Risk-On / Risk-Off signal
  if (yieldSignal.risk_signal === 'Risk-Off') {
    return {
      action: 'REDUCE_EXPOSURE',
      reason: `Yield curve slope is flattened/inverted (Slope: ${yieldSignal.slope.toFixed(2)}). Macro risk is elevated.`,
      maxEquityExposure: 0.3, // Defensive stance
      recommendedSectors: ['Utilities', 'Consumer Staples', 'Healthcare']
    };
  } else if (yieldSignal.risk_signal === 'Risk-On') {
    return {
      action: 'INCREASE_EXPOSURE',
      reason: `Yield curve slope is steepening (Slope: ${yieldSignal.slope.toFixed(2)}). Macro environment supports growth.`,
      maxEquityExposure: context.currentRiskTolerance === 'Aggressive' ? 1.0 : 0.8, // Aggressive stance
      recommendedSectors: ['Financials', 'Real Estate', 'Consumer Discretionary']
    };
  } else {
    // Neutral
    return {
      action: 'MAINTAIN',
      reason: 'Yield curve signal is neutral. Maintain current allocations.',
      maxEquityExposure: context.currentRiskTolerance === 'Aggressive' ? 0.8 : 0.6,
      recommendedSectors: []
    };
  }
}
