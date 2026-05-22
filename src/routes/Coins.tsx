import { Helmet } from 'react-helmet';
import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';
import { isDarkAtom } from '../atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import CoinIcon from '../components/CoinIcon';
import { CoinMarket, fetchCoins, getFallbackCoins } from './api';

const Container = styled.div`
	width: min(100%, 1080px);
	margin: 0 auto;
	padding: 32px 20px 56px;
`;

const Header = styled.header`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 20px;
	margin-bottom: 24px;
	padding: 28px;
	border: 1px solid ${(props) => props.theme.borderColor};
	border-radius: 24px;
	background: ${(props) => props.theme.panelColor};
	box-shadow: ${(props) => props.theme.shadow};

	@media (max-width: 640px) {
		padding: 22px;
		border-radius: 18px;
	}
`;

const Eyebrow = styled.p`
	margin-bottom: 8px;
	color: ${(props) => props.theme.accentColor};
	font-size: 13px;
	font-weight: 800;
	letter-spacing: 0.08em;
	text-transform: uppercase;
`;

const Title = styled.h1`
	font-size: clamp(32px, 6vw, 54px);
	font-weight: 800;
	letter-spacing: -0.04em;
`;

const Description = styled.p`
	max-width: 620px;
	margin-top: 12px;
	color: ${(props) => props.theme.mutedTextColor};
	font-size: 15px;
	line-height: 1.7;
`;

const ThemeButton = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 44px;
	height: 44px;
	border: 1px solid ${(props) => props.theme.borderColor};
	border-radius: 14px;
	background: ${(props) => props.theme.listColor};
	color: ${(props) => props.theme.textColor};
	font-size: 18px;
`;

const Controls = styled.div`
	display: grid;
	grid-template-columns: minmax(0, 1fr) 180px;
	gap: 10px;
	margin-bottom: 18px;

	@media (max-width: 640px) {
		grid-template-columns: 1fr;
	}
`;

const Control = styled.div`
	label {
		display: block;
		margin-bottom: 8px;
		color: ${(props) => props.theme.mutedTextColor};
		font-size: 13px;
		font-weight: 700;
	}

	input,
	select {
		width: 100%;
		height: 46px;
		padding: 0 14px;
		border: 1px solid ${(props) => props.theme.borderColor};
		border-radius: 12px;
		background: ${(props) => props.theme.listColor};
		color: ${(props) => props.theme.textColor};
		outline: none;
	}

	input:focus,
	select:focus {
		border-color: ${(props) => props.theme.accentColor};
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
	}
`;

const StatusMessage = styled.div`
	margin: 16px 0;
	padding: 14px 16px;
	border: 1px solid ${(props) => props.theme.borderColor};
	border-radius: 14px;
	background: ${(props) => props.theme.listColor};
	color: ${(props) => props.theme.mutedTextColor};
	font-size: 14px;
	font-weight: 700;
`;

const CoinList = styled.ul`
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 14px;

	@media (max-width: 760px) {
		grid-template-columns: 1fr;
	}
`;

const CoinElement = styled.li`
	background-color: ${(props) => props.theme.listColor};
	border: 1px solid ${(props) => props.theme.borderColor};
	border-radius: 20px;
	box-shadow: ${(props) => props.theme.shadow};
	transition: transform 0.18s ease, border-color 0.18s ease;

	&:hover {
		transform: translateY(-3px);
		border-color: ${(props) => props.theme.accentColor};
	}

	a {
		display: grid;
		grid-template-columns: 1fr 150px;
		gap: 16px;
		padding: 18px;
		min-height: 152px;
	}

	@media (max-width: 520px) {
		a {
			grid-template-columns: 1fr;
		}
	}
`;

const CoinMain = styled.div`
	display: flex;
	gap: 12px;
	align-items: flex-start;
`;

const CoinName = styled.strong`
	display: block;
	font-size: 18px;
	font-weight: 800;
	letter-spacing: -0.02em;
`;

const CoinMeta = styled.span`
	display: block;
	margin-top: 4px;
	color: ${(props) => props.theme.mutedTextColor};
	font-size: 13px;
	font-weight: 700;
	text-transform: uppercase;
`;

const Price = styled.p`
	margin-top: 16px;
	font-size: 24px;
	font-weight: 800;
	letter-spacing: -0.03em;
`;

const MetricRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-top: 10px;
`;

const Metric = styled.span<{ isNegative?: boolean }>`
	display: inline-flex;
	align-items: center;
	min-height: 28px;
	padding: 0 9px;
	border-radius: 999px;
	background: ${(props) => props.theme.badgeBgColor};
	color: ${(props) => (props.isNegative ? props.theme.negativeColor : props.theme.positiveColor)};
	font-size: 12px;
	font-weight: 800;
`;

const Rank = styled.span`
	display: inline-flex;
	align-items: center;
	min-height: 28px;
	padding: 0 9px;
	border-radius: 999px;
	background: ${(props) => props.theme.badgeBgColor};
	color: ${(props) => props.theme.accentColor};
	font-size: 12px;
	font-weight: 800;
`;

const SparklineBox = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 0;
	border-left: 1px solid ${(props) => props.theme.softBorderColor};
	padding-left: 14px;

	svg {
		width: 100%;
		height: 90px;
		overflow: visible;
	}

	path {
		fill: none;
		stroke: ${(props) => props.theme.chartColor};
		stroke-width: 2.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	@media (max-width: 520px) {
		border-left: 0;
		border-top: 1px solid ${(props) => props.theme.softBorderColor};
		padding: 12px 0 0;
	}
`;

const EmptyText = styled.p`
	padding: 32px;
	border: 1px dashed ${(props) => props.theme.borderColor};
	border-radius: 18px;
	color: ${(props) => props.theme.mutedTextColor};
	text-align: center;
	font-weight: 700;
`;

const formatCurrency = (value?: number) => {
	if (typeof value !== 'number' || Number.isNaN(value)) return '-';
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: value >= 100 ? 0 : 4,
	}).format(value);
};

const formatPercent = (value?: number | null) => {
	if (typeof value !== 'number' || Number.isNaN(value)) return '0.00%';
	return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

const getSparklinePath = (prices?: number[]) => {
	if (!prices || prices.length < 2) return '';

	const width = 140;
	const height = 70;
	const min = Math.min(...prices);
	const max = Math.max(...prices);
	const range = max - min || 1;

	return prices
		.map((price, index) => {
			const x = (index / (prices.length - 1)) * width;
			const y = height - ((price - min) / range) * height + 10;
			return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
		})
		.join(' ');
};

const sortCoins = (coins: CoinMarket[], sortKey: string) => {
	const nextCoins = [...coins];

	if (sortKey === 'price') {
		return nextCoins.sort((a, b) => b.current_price - a.current_price);
	}

	if (sortKey === 'change24h') {
		return nextCoins.sort(
			(a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0),
		);
	}

	return nextCoins.sort((a, b) => (a.market_cap_rank || 9999) - (b.market_cap_rank || 9999));
};

function Coins() {
	const [keyword, setKeyword] = useState('');
	const [sortKey, setSortKey] = useState('rank');
	const { isLoading, isError, data } = useQuery<CoinMarket[]>('allCoins', fetchCoins, {
		staleTime: 1000 * 60 * 5,
		retry: 1,
	});
	const isDarkMode = useRecoilValue(isDarkAtom);
	const setDarkAtom = useSetRecoilState(isDarkAtom);
	const toggleDarkMode = () => setDarkAtom((prev) => !prev);
	const coins = data && data.length ? data : getFallbackCoins();

	const filteredCoins = useMemo(() => {
		const normalizedKeyword = keyword.trim().toLowerCase();
		const filtered = normalizedKeyword
			? coins.filter(
					(coin) =>
						coin.name.toLowerCase().includes(normalizedKeyword) ||
						coin.symbol.toLowerCase().includes(normalizedKeyword),
			  )
			: coins;

		return sortCoins(filtered, sortKey);
	}, [coins, keyword, sortKey]);

	return (
		<Container>
			<Helmet>
				<title>Coin Market</title>
			</Helmet>
			<Header>
				<div>
					<Eyebrow>Crypto market</Eyebrow>
					<Title>Coins</Title>
					<Description>
						실시간 시세 API에서 코인 가격, 로고, 7일 미니 차트를 가져옵니다. API가 실패하면
						기본 샘플 데이터와 문자 배지로 화면을 유지합니다.
					</Description>
				</div>
				<ThemeButton type='button' onClick={toggleDarkMode} aria-label='테마 변경'>
					{isDarkMode ? <BsFillSunFill /> : <BsFillMoonFill />}
				</ThemeButton>
			</Header>

			<Controls>
				<Control>
					<label htmlFor='coin-search'>코인 검색</label>
					<input
						id='coin-search'
						value={keyword}
						onChange={(event) => setKeyword(event.target.value)}
						placeholder='Bitcoin, ETH, SOL...'
					/>
				</Control>
				<Control>
					<label htmlFor='coin-sort'>정렬</label>
					<select id='coin-sort' value={sortKey} onChange={(event) => setSortKey(event.target.value)}>
						<option value='rank'>시가총액 순</option>
						<option value='price'>가격 높은 순</option>
						<option value='change24h'>24시간 상승률 순</option>
					</select>
				</Control>
			</Controls>

			{isLoading && <StatusMessage>코인 시세를 불러오는 중입니다.</StatusMessage>}
			{isError && (
				<StatusMessage>
					실시간 API 연결에 실패해 샘플 데이터를 표시합니다. 네트워크 또는 무료 API 제한을 확인해 주세요.
				</StatusMessage>
			)}

			{filteredCoins.length ? (
				<CoinList>
					{filteredCoins.map((coin) => {
						const change24h = coin.price_change_percentage_24h || 0;
						const path = getSparklinePath(coin.sparkline_in_7d?.price);

						return (
							<CoinElement key={coin.id}>
								<Link
									to={{
										pathname: `/${coin.id}/chart`,
										state: { name: coin.name },
									}}
								>
									<div>
										<CoinMain>
											<CoinIcon image={coin.image} symbol={coin.symbol} name={coin.name} />
											<div>
												<CoinName>{coin.name}</CoinName>
												<CoinMeta>{coin.symbol}</CoinMeta>
											</div>
										</CoinMain>
										<Price>{formatCurrency(coin.current_price)}</Price>
										<MetricRow>
											<Rank>#{coin.market_cap_rank || '-'}</Rank>
											<Metric isNegative={change24h < 0}>24H {formatPercent(change24h)}</Metric>
										</MetricRow>
									</div>
									<SparklineBox aria-label={`${coin.name} 7일 미니 차트`}>
										{path ? (
											<svg viewBox='0 0 140 90' preserveAspectRatio='none' aria-hidden='true'>
												<path d={path} />
											</svg>
										) : (
											<span>차트 없음</span>
										)}
									</SparklineBox>
								</Link>
							</CoinElement>
						);
					})}
				</CoinList>
			) : (
				<EmptyText>검색 결과가 없습니다.</EmptyText>
			)}
		</Container>
	);
}

export default Coins;
