import { CandleChartInterval_LT } from 'binance-api-node';

export interface IPurchaseSignal {
  time: number;
  type: 'buy' | 'sell';
  price: number;
  volume: number;
}

export interface ICandle {
  openTime: number;
  closeTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
}
export interface IcandlesOptions {
  pair: string;
  period: CandleChartInterval_LT;
}
