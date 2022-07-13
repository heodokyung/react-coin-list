import React from 'react';
import { useQuery } from 'react-query';
import { fetchCoinsChart } from './api';
import ApexChart from 'react-apexcharts';
import { isDarkAtom } from './../atoms';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

const Title = styled.p`
	font-size: 24px;
	font-weight: bold;
`;
const Group = styled.div`
	& + & {
		margin-top: 30px;
	}
`;
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
			// 재갱신 시간
			refetchInterval: 10000,
		},
	);
	const isDarkMode = useRecoilValue(isDarkAtom);
	return (
		<div>
			{isLoading ? (
				'Loading chart...'
			) : (
				<>
					<Group>
						<Title>Line Chart</Title>
						<ApexChart
							type='line'
							series={[
								{
									name: 'Price',
									data: data?.map((price) => price.close) as number[],
								},
							]}
							options={{
								theme: {
									mode: isDarkMode ? 'dark' : 'light',
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
									show: true,
								},
								xaxis: {
									axisBorder: { show: false },
									axisTicks: { show: true },
									labels: {
										show: false,
										datetimeFormatter: { month: "mmm 'yy" },
									},
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
										formatter: (value) => `$${value.toFixed(0)}`,
									},
								},
							}}
						/>
					</Group>

					<Group>
						<Title>Candlestick Chart</Title>
						<ApexChart
							type='candlestick'
							series={[
								{
									data: data?.map((price) => ({
										x: price.time_open,
										y: [price.open, price.high, price.low, price.close],
									})) as unknown as number[],
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
									width: 2,
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
									gradient: { gradientToColors: ['#2d07d8'], stops: [0, 100] },
								},
								colors: ['#440ae4'],
								tooltip: {
									y: {
										formatter: (value) => `$${value.toFixed(2)}`,
									},
								},
							}}
						/>
					</Group>
				</>
			)}
		</div>
	);
}

export default Chart;
