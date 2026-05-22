import Helmet from 'react-helmet';
import { Link, Route, Switch, useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import Price from './Price';
import Chart from './Chart';
import { useQuery } from 'react-query';
import { CoinDetail, createFallbackDetail, fetchCoinsInfo } from './api';
import CoinIcon from '../components/CoinIcon';

const commonBox = styled.div`
	background: ${(props) => props.theme.listColor};
	border-radius: 18px;
	border: 1px solid ${(props) => props.theme.borderColor};
	box-shadow: ${(props) => props.theme.shadow};
`;

const Container = styled.div`
	width: min(100%, 900px);
	margin: 0 auto;
	padding: 32px 20px 56px;
`;

const Header = styled.header`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	margin-bottom: 18px;
	padding: 22px;
	border: 1px solid ${(props) => props.theme.borderColor};
	border-radius: 22px;
	background: ${(props) => props.theme.panelColor};
	box-shadow: ${(props) => props.theme.shadow};
`;

const CoinTitleGroup = styled.div`
	display: flex;
	align-items: center;
	gap: 14px;
	min-width: 0;
`;

const Title = styled.h1`
	font-size: clamp(26px, 5vw, 42px);
	font-weight: 800;
	letter-spacing: -0.04em;
`;

const SymbolText = styled.p`
	margin-top: 4px;
	color: ${(props) => props.theme.mutedTextColor};
	font-size: 13px;
	font-weight: 800;
	text-transform: uppercase;
`;

const BackLink = styled(Link)`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 72px;
	height: 42px;
	border: 1px solid ${(props) => props.theme.borderColor};
	border-radius: 12px;
	background: ${(props) => props.theme.listColor};
	color: ${(props) => props.theme.textColor};
	font-size: 14px;
	font-weight: 800;
`;

const Loader = styled.p`
	padding: 24px;
	border: 1px solid ${(props) => props.theme.borderColor};
	border-radius: 16px;
	background: ${(props) => props.theme.listColor};
	color: ${(props) => props.theme.mutedTextColor};
	text-align: center;
	font-weight: 800;
`;

const Notice = styled(Loader)`
	margin-bottom: 16px;
	text-align: left;
`;

const Overview = styled(commonBox)`
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 1px;
	overflow: hidden;

	@media (max-width: 760px) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
`;

const OverviewItem = styled.div`
	padding: 18px;
	background: ${(props) => props.theme.listColor};

	span {
		display: block;
	}

	span:first-child {
		margin-bottom: 8px;
		color: ${(props) => props.theme.mutedTextColor};
		font-size: 12px;
		font-weight: 800;
		text-transform: uppercase;
	}

	span:last-child {
		font-size: 18px;
		font-weight: 800;
		letter-spacing: -0.02em;
	}
`;

const Description = styled(commonBox)`
	margin: 18px 0;
	padding: 22px;
	color: ${(props) => props.theme.mutedTextColor};
	font-size: 15px;
	line-height: 1.75;
`;

const Split = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	margin: 18px 0;
	gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
	text-align: center;
	font-size: 14px;
	font-weight: 800;
	border-radius: 14px;
	border: 1px solid ${(props) => (props.isActive ? props.theme.accentColor : props.theme.borderColor)};
	color: ${(props) => (props.isActive ? props.theme.accentTextColor : props.theme.textColor)};
	background-color: ${(props) => (props.isActive ? props.theme.accentColor : props.theme.listColor)};

	a {
		display: block;
		padding: 15px 0;
	}
`;

const BtnWrap = styled(Split)`
	padding-top: 18px;
	margin-top: 22px;
	border-top: 1px solid ${(props) => props.theme.borderColor};
`;

const ActionButton = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 48px;
	border: 1px solid ${(props) => props.theme.borderColor};
	border-radius: 14px;
	background: ${(props) => props.theme.listColor};
	color: ${(props) => props.theme.textColor};
	font-size: 15px;
	font-weight: 800;
`;

const ActionLink = styled(Link)`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 48px;
	border: 1px solid ${(props) => props.theme.borderColor};
	border-radius: 14px;
	background: ${(props) => props.theme.listColor};
	color: ${(props) => props.theme.textColor};
	font-size: 15px;
	font-weight: 800;
`;

interface Params {
	coinId: string;
}

interface LocationState {
	name?: string;
}

const formatCurrency = (value?: number) => {
	if (typeof value !== 'number' || Number.isNaN(value)) return '-';
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: value >= 100 ? 0 : 4,
	}).format(value);
};

const formatCompact = (value?: number | null) => {
	if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) return '-';
	return new Intl.NumberFormat('en-US', {
		notation: 'compact',
		maximumFractionDigits: 2,
	}).format(value);
};

const cleanDescription = (description?: string) => {
	if (!description) return '이 코인에 대한 설명 정보가 없습니다.';
	return description.replace(/<[^>]*>?/gm, '').slice(0, 520) || '이 코인에 대한 설명 정보가 없습니다.';
};

function Coin() {
	const history = useHistory();
	const { coinId } = useParams<Params>();
	const { state } = useLocation<LocationState>();
	const chartMatch = useRouteMatch('/:coinId/chart');
	const priceMatch = useRouteMatch('/:coinId/price');

	const { isLoading, isError, data } = useQuery<CoinDetail>(
		['info', coinId],
		() => fetchCoinsInfo(coinId),
		{
			staleTime: 1000 * 60 * 5,
			retry: 1,
		},
	);

	const coinData = data || createFallbackDetail(coinId);
	const currentPrice = coinData.market_data?.current_price?.usd;
	const marketCap = coinData.market_data?.market_cap?.usd;
	const volume = coinData.market_data?.total_volume?.usd;
	const image = coinData.image?.large || coinData.image?.small || coinData.image?.thumb;
	const title = state?.name || coinData.name || 'Coin';

	return (
		<Container>
			<Helmet>
				<title>{title}</title>
			</Helmet>
			<Header>
				<CoinTitleGroup>
					<CoinIcon image={image} symbol={coinData.symbol} name={title} size={52} />
					<div>
						<Title>{isLoading && !data ? 'Loading...' : title}</Title>
						<SymbolText>{coinData.symbol}</SymbolText>
					</div>
				</CoinTitleGroup>
				<BackLink to='/'>목록</BackLink>
			</Header>

			{isLoading && !data ? (
				<Loader>코인 정보를 불러오는 중입니다.</Loader>
			) : (
				<>
					{isError && (
						<Notice>실시간 상세 API 연결에 실패해 샘플 데이터를 표시합니다.</Notice>
					)}
					<Overview>
						<OverviewItem>
							<span>Rank</span>
							<span>#{coinData.market_cap_rank || '-'}</span>
						</OverviewItem>
						<OverviewItem>
							<span>Price</span>
							<span>{formatCurrency(currentPrice)}</span>
						</OverviewItem>
						<OverviewItem>
							<span>Market Cap</span>
							<span>{formatCompact(marketCap)}</span>
						</OverviewItem>
						<OverviewItem>
							<span>24H Volume</span>
							<span>{formatCompact(volume)}</span>
						</OverviewItem>
					</Overview>
					<Description as='p'>{cleanDescription(coinData.description?.en)}</Description>

					<Split>
						<Tab isActive={chartMatch !== null}>
							<Link to={`/${coinId}/chart`}>Chart</Link>
						</Tab>
						<Tab isActive={priceMatch !== null}>
							<Link to={`/${coinId}/price`}>Price</Link>
						</Tab>
					</Split>

					<Switch>
						<Route path='/:coinId/price'>
							<Price coinId={coinId} />
						</Route>
						<Route path='/:coinId/chart'>
							<Chart coinId={coinId} />
						</Route>
					</Switch>
				</>
			)}
			<BtnWrap>
				<ActionButton
					type='button'
					onClick={() => {
						history.goBack();
					}}
				>
					이전
				</ActionButton>
				<ActionLink to='/'>목록보기</ActionLink>
			</BtnWrap>
		</Container>
	);
}

export default Coin;
