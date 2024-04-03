import { CandleChartResult } from 'binance-api-node';
import { IPurchaseSignal } from './types';

export const generatePurchaseSignals = (candles: CandleChartResult[]) => {
  const purchaseSignals = candles.map(
    (candle) =>
      ({
        time: candle.openTime,
        type: Math.random() <= 0.5 ? 'sell' : 'buy',
        price: (+candle.high + +candle.low) / 2,
        volume: Math.random() * 1.2,
      }) as IPurchaseSignal,
  );
  return purchaseSignals;
};
