import { useQuery } from 'react-query';
import styled from 'styled-components';
import { CoinDetail, createFallbackDetail, fetchCoinsTickers } from './api';

const ListPriceWrap = styled.article`
	margin-top: 18px;
	padding: 22px;
	border: 1px solid ${(props) => props.theme.borderColor};
	border-radius: 18px;
	background-color: ${(props) => props.theme.listColor};
	box-shadow: ${(props) => props.theme.shadow};
`;

const Title = styled.p`
	font-size: 22px;
	font-weight: 800;
	letter-spacing: -0.03em;
`;

const PriceGrid = styled.ul`
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 10px;
	margin-top: 16px;

	@media (max-width: 640px) {
		grid-template-columns: 1fr;
	}
`;

const PriceItem = styled.li`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 14px;
	min-height: 62px;
	padding: 14px;
	border: 1px solid ${(props) => props.theme.softBorderColor};
	border-radius: 14px;
	background-color: ${(props) => props.theme.panelColor};

	span:first-child {
		color: ${(props) => props.theme.mutedTextColor};
		font-size: 13px;
		font-weight: 800;
	}

	span:last-child {
		font-weight: 800;
		text-align: right;
	}
`;

const Notice = styled.p`
	margin-top: 14px;
	color: ${(props) => props.theme.mutedTextColor};
	font-size: 14px;
	font-weight: 700;
`;

interface PriceProps {
	coinId: string;
}

const formatCurrency = (value?: number | null) => {
	if (typeof value !== 'number' || Number.isNaN(value)) return '-';
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: value >= 100 ? 0 : 4,
	}).format(value);
};

const formatNumber = (value?: number | null) => {
	if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) return '-';
	return new Intl.NumberFormat('en-US', {
		notation: 'compact',
		maximumFractionDigits: 2,
	}).format(value);
};

const formatPercent = (value?: number | null) => {
	if (typeof value !== 'number' || Number.isNaN(value)) return '-';
	return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

function Price({ coinId }: PriceProps) {
	const { isLoading, isError, data } = useQuery<CoinDetail>(
		['price', coinId],
		() => fetchCoinsTickers(coinId),
		{
			staleTime: 1000 * 60 * 5,
			retry: 1,
		},
	);
	const priceData = data || createFallbackDetail(coinId);
	const marketData = priceData.market_data;

	if (isLoading && !data) {
		return <Notice>가격 정보를 불러오는 중입니다.</Notice>;
	}

	return (
		<ListPriceWrap>
			<Title>가격 정보</Title>
			{isError && <Notice>실시간 가격 API 연결에 실패해 샘플 가격을 표시합니다.</Notice>}
			<PriceGrid>
				<PriceItem>
					<span>현재가</span>
					<span>{formatCurrency(marketData?.current_price?.usd)}</span>
				</PriceItem>
				<PriceItem>
					<span>역대 최고가</span>
					<span>{formatCurrency(marketData?.ath?.usd)}</span>
				</PriceItem>
				<PriceItem>
					<span>ATH 대비</span>
					<span>{formatPercent(marketData?.ath_change_percentage?.usd)}</span>
				</PriceItem>
				<PriceItem>
					<span>24시간</span>
					<span>{formatPercent(marketData?.price_change_percentage_24h)}</span>
				</PriceItem>
				<PriceItem>
					<span>7일</span>
					<span>{formatPercent(marketData?.price_change_percentage_7d)}</span>
				</PriceItem>
				<PriceItem>
					<span>30일</span>
					<span>{formatPercent(marketData?.price_change_percentage_30d)}</span>
				</PriceItem>
				<PriceItem>
					<span>유통량</span>
					<span>{formatNumber(marketData?.circulating_supply)}</span>
				</PriceItem>
				<PriceItem>
					<span>최대 공급량</span>
					<span>{formatNumber(marketData?.max_supply)}</span>
				</PriceItem>
			</PriceGrid>
		</ListPriceWrap>
	);
}

export default Price;
