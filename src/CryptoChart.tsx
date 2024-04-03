import Binance from 'binance-api-node';
import { useEffect, useState } from 'react';

import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-luxon';
import 'luxon';

import ArrowIconUp from './assets/icon_triangle_up.svg';
import ArrowIconDown from './assets/icon_triangle_down.svg';

import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  PointElement,
  ChartOptions,
  TimeScale,
  TimeSeriesScale,
  ScatterController,
} from 'chart.js';
import {
  CandlestickElement,
  CandlestickController,
} from 'chartjs-chart-financial';
import { generatePurchaseSignals } from './utils';
import { ChartData } from 'chart.js';
import { ICandle, IPurchaseSignal, IcandlesOptions } from './types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  CandlestickElement,
  CandlestickController,
  TimeScale,
  TimeSeriesScale,
  PointElement,
  ScatterController,
);

const client = Binance();

function CryptoChart() {
  const [candles, setCandles] = useState<ICandle[]>([]);
  const [purchaseSignals, setPurchaseSignals] = useState<IPurchaseSignal[]>([]);
  const [candlesOptions] = useState<IcandlesOptions>({
    pair: 'BTCUSDT',
    period: '1M',
  });

  useEffect(() => {
    client.ws.candles(candlesOptions.pair, candlesOptions.period, (candle) => {
      setCandles((prevCandles) => {
        const lastPrevCandle = prevCandles[prevCandles.length - 1];
        const newCandle = {
          ...candle,
          openTime: candle.startTime,
        } as ICandle;

        if (lastPrevCandle.openTime === newCandle.openTime) {
          return [...prevCandles.slice(0, -1), newCandle];
        }
        return [...prevCandles, newCandle];
      });
    });

    const fetchCandles = async () => {
      const fetchedCandles = await client.candles({
        symbol: candlesOptions.pair,
        interval: candlesOptions.period,
      });
      setCandles(fetchedCandles);
      setPurchaseSignals(generatePurchaseSignals(fetchedCandles));
    };

    fetchCandles();
  }, [candlesOptions]);

  const getArrowImage = (imagePath: string) => {
    const arrowImage = new Image();
    arrowImage.src = imagePath;
    arrowImage.width = 7;
    arrowImage.height = 5;
    return arrowImage;
  };

  const chartData: ChartData = {
    labels: candles.map((candel) => candel.openTime),
    datasets: [
      {
        label: 'candles',
        data: candles.map((candle) => ({
          x: +candle.openTime,
          o: +candle.open,
          h: +candle.high,
          l: +candle.low,
          c: +candle.close,
        })),
      },
      {
        label: 'Buy',
        type: 'scatter',
        data: purchaseSignals
          .filter((signal) => signal.type === 'buy')
          .map((signal) => ({
            x: signal.time,
            y: signal.price * signal.volume,
          })),
        pointStyle: getArrowImage(ArrowIconUp),
        backgroundColor: 'green',
      },
      {
        label: 'Sell',
        type: 'scatter',
        data: purchaseSignals
          .filter((signal) => signal.type === 'sell')
          .map((signal) => ({
            x: signal.time,
            y: signal.price * signal.volume,
          })),
        pointStyle: getArrowImage(ArrowIconDown),
        backgroundColor: 'red',
      },
    ],
  };

  const options: ChartOptions = {
    scales: {
      x: {
        type: 'timeseries',
        time: {
          unit: 'month',
        },
      },
      y: {
        display: true,
      },
    },
  };

  return (
    <>
      <Chart type='candlestick' data={chartData} options={options} />
    </>
  );
}

export default CryptoChart;
