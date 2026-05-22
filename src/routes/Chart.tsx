import React from 'react';
import { useQuery } from 'react-query';
import { CoinChartData, createFallbackChart, fetchCoinsChart } from './api';
import ApexChart from 'react-apexcharts';
import { isDarkAtom } from './../atoms';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

const ChartWrap = styled.div`
	display: grid;
	gap: 16px;
	margin-top: 18px;
`;

const ChartCard = styled.section`
	padding: 20px;
	border: 1px solid ${(props) => props.theme.borderColor};
	border-radius: 18px;
	background: ${(props) => props.theme.listColor};
	box-shadow: ${(props) => props.theme.shadow};
`;

const ChartHeader = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 16px;
	margin-bottom: 10px;
`;

const Title = styled.p`
	font-size: 22px;
	font-weight: 800;
	letter-spacing: -0.03em;
`;

const SubText = styled.p`
	margin-top: 4px;
	color: ${(props) => props.theme.mutedTextColor};
	font-size: 13px;
	font-weight: 700;
`;

const Notice = styled.p`
	padding: 16px;
	border: 1px solid ${(props) => props.theme.borderColor};
	border-radius: 14px;
	background: ${(props) => props.theme.listColor};
	color: ${(props) => props.theme.mutedTextColor};
	font-size: 14px;
	font-weight: 700;
`;

interface ChartProps {
	coinId: string;
}

const formatPrice = (value: number) =>
	new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: value >= 100 ? 0 : 4,
	}).format(value);

function Chart({ coinId }: ChartProps) {
	const { isLoading, isError, data } = useQuery<CoinChartData>(
		['chart', coinId],
		() => fetchCoinsChart(coinId),
		{
			staleTime: 1000 * 60 * 5,
			retry: 1,
		},
	);
	const isDarkMode = useRecoilValue(isDarkAtom);
	const chartData = data || createFallbackChart(coinId);
	const chartMode = isDarkMode ? 'dark' : 'light';
	const chartTextColor = isDarkMode ? '#e5e7eb' : '#475569';
	const gridColor = isDarkMode ? '#334155' : '#e5e7eb';

	if (isLoading && !data) {
		return <Notice>차트 데이터를 불러오는 중입니다.</Notice>;
	}

	const priceSeries = chartData.prices.map((point) => [point.time, point.price]);
	const candlestickSeries = chartData.ohlc.map((point) => ({
		x: point.time,
		y: [point.open, point.high, point.low, point.close],
	}));

	return (
		<ChartWrap>
			{isError && <Notice>실시간 차트 API 연결에 실패해 샘플 차트를 표시합니다.</Notice>}
			<ChartCard>
				<ChartHeader>
					<div>
						<Title>7일 가격 추이</Title>
						<SubText>시간 단위 가격 데이터를 기준으로 표시합니다.</SubText>
					</div>
				</ChartHeader>
				<ApexChart
					type='area'
					series={[
						{
							name: 'Price',
							data: priceSeries,
						},
					] as any}
					options={{
						theme: {
							mode: chartMode,
						},
						chart: {
							toolbar: { show: false },
							background: 'transparent',
							zoom: { enabled: false },
						},
						stroke: {
							curve: 'smooth',
							width: 3,
						},
						dataLabels: { enabled: false },
						grid: {
							borderColor: gridColor,
							strokeDashArray: 4,
						},
						xaxis: {
							type: 'datetime',
							labels: {
								style: { colors: chartTextColor },
							},
							axisBorder: { show: false },
							axisTicks: { show: false },
						},
						yaxis: {
							labels: {
								style: { colors: chartTextColor },
								formatter: (value: number) => formatPrice(value),
							},
						},
						fill: {
							type: 'solid',
							opacity: 0.12,
						},
						colors: [isDarkMode ? '#93c5fd' : '#2563eb'],
						tooltip: {
							x: { format: 'MM/dd HH:mm' },
							y: {
								formatter: (value: number) => formatPrice(value),
							},
						},
					}}
				/>
			</ChartCard>

			<ChartCard>
				<ChartHeader>
					<div>
						<Title>요약 캔들 차트</Title>
						<SubText>7일 데이터를 구간별 OHLC 형태로 요약했습니다.</SubText>
					</div>
				</ChartHeader>
				<ApexChart
					type='candlestick'
					series={[
						{
							data: candlestickSeries,
						},
					] as any}
					options={{
						theme: { mode: chartMode },
						chart: {
							toolbar: { show: false },
							background: 'transparent',
							zoom: { enabled: false },
						},
						plotOptions: {
							candlestick: {
								colors: {
									upward: '#16a34a',
									downward: '#dc2626',
								},
							},
						},
						grid: {
							borderColor: gridColor,
							strokeDashArray: 4,
						},
						xaxis: {
							type: 'datetime',
							labels: {
								style: { colors: chartTextColor },
							},
							axisBorder: { show: false },
							axisTicks: { show: false },
						},
						yaxis: {
							labels: {
								style: { colors: chartTextColor },
								formatter: (value: number) => formatPrice(value),
							},
						},
						tooltip: {
							x: { format: 'MM/dd HH:mm' },
							y: {
								formatter: (value: number) => formatPrice(value),
							},
						},
					}}
				/>
			</ChartCard>
		</ChartWrap>
	);
}

export default Chart;
