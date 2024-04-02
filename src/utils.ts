import { CandleChartResult } from 'binance-api-node';

interface PurchaseSignal {
  time: number;
  type: 'buy' | 'sell';
  price: number;
  volume: number;
}

export const generatePurchaseSignals = (candles: CandleChartResult[]) => {
  const purchaseSignals = candles.map(
    (candle) =>
      ({
        time: candle.openTime,
        type: Math.random() <= 0.5 ? 'sell' : 'buy',
        price: (+candle.high + +candle.low) / 2,
        volume: Math.random() * 1.2,
      }) as PurchaseSignal,
  );
  console.log(purchaseSignals.slice(0, 3));
  return purchaseSignals;
};
