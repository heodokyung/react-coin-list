import React from 'react';
import { useQuery } from 'react-query';
import { fetchCoinsChart } from './api';
import ApexChart from 'react-apexcharts';

interface I_ChartProps {
  coinId: string;
}

interface I_ChartData {
  time_open: string;
  time_close: string;
  open: number; // 시작가
  high: number; // 최고가
  low: number; // 최저가
  close: number; // 종가
  volume: number;
  market_cap: number;
}

function Chart({ coinId }: I_ChartProps) {
  const { isLoading, data } = useQuery<I_ChartData[]>(
    ['chart', coinId],
    () => fetchCoinsChart(coinId),
    {
      refetchInterval: 10000,
    }
  );
  return (
    <div>
      {isLoading ? (
        'Loading chart...'
      ) : (
        <ApexChart
          type="line"
          series={[
            {
              name: 'Price',
              data: data?.map((price) => price.close) as number[],
            },
          ]}
          options={{
            theme: {
              mode: 'dark',
            },
            chart: {
              width: '500',
              toolbar: {
                show: false,
              },
              background: 'transparent',
            },
            stroke: {
              curve: 'smooth',
              width: 4,
            },
            yaxis: {
              show: false,
            },
            xaxis: {
              axisBorder: { show: false },
              axisTicks: { show: false },
              labels: { show: false },
              type: 'datetime',
              categories: data?.map((price) => price.time_close),
            },
            fill: {
              type: 'gradient',
              gradient: { gradientToColors: ['#0be881'], stops: [0, 100] },
            },
            colors: ['#0fbcf9'],
            tooltip: {
              y: {
                formatter: (value) => `$${value.toFixed(2)}`,
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
