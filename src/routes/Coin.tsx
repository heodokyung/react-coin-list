import Helmet from 'react-helmet';
import {
	Link,
	Route,
	Switch,
	useHistory,
	useLocation,
	useParams,
	useRouteMatch,
} from 'react-router-dom';
import styled from 'styled-components';
import Price from './Price';
import Chart from './Chart';
import { useQuery } from 'react-query';
import { fetchCoinsInfo, fetchCoinsTickers } from './api';
import { I_PriceData } from '../atoms';

const commonBox = styled.div`
	background: ${(props) => props.theme.listColor};
	color: 1px solid ${(props) => props.theme.textColor};
	border-radius: 6px;
	border: 1px solid #ddd;
`;

const Container = styled.div`
	padding: 0 20px;
	max-width: 480px;
	margin: 0 auto;
`;

const Title = styled.h1`
	position: relative;
	display: block;
	font-size: 36px;
	font-weight: bold;
	width: 100%;
	text-align: center;

	color: ${(props) => props.theme.accentColor};
	a {
		display: flex;
		position: absolute;
		left: 0;
	}
`;

const Loader = styled.p`
	text-align: center;
	font-size: 20px;
	font-weight: bold;
	margin-top: 20px;
`;

const Overview = styled(commonBox)`
	display: flex;
	justify-content: space-between;
	margin-top: 15px;
	padding: 10px 20px;
`;
const OverviewItem = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	span {
		font-size: 18px;
	}
	span:first-child {
		font-size: 12px;
		font-weight: bold;
		text-transform: uppercase;
		margin-bottom: 8px;
	}
`;

const Description = styled(commonBox)`
	margin: 20px 0px;
	background-color: ${(props) => props.theme.listColor};
	padding: 20px;
	line-height: 20px;
`;

const Split = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	margin: 25px 0px;
	gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
	text-align: center;
	text-transform: uppercase;
	font-size: 12px;
	font-weight: 400;
	padding: 16px 0px;
	border-radius: 10px;
	font-size: 14px;
	border: 1px solid #ddd;
	color: ${(props) =>
		props.isActive ? props.theme.bgColor : props.theme.textColor};
	background-color: ${(props) =>
		props.isActive ? props.theme.accentColor : props.theme.listColor};
	a {
		display: block;
	}
`;

const BtnWrap = styled(Split)`
	padding-top: 20px;
	margin-top: 50px;
	border-top: 2px solid ${(props) => props.theme.textColor};
`;

const LinkHome = styled(Link)`
	display: inline-block;
	border: 1px solid #ddd;
	padding: 0 20px;
	border-radius: 4px;
	background: ${(props) => props.theme.listColor};
	color: #222;
	font-size: 16px;
	font-weight: bold;
	text-align: center;
	box-sizing: border-box;
	height: 48px;
	line-height: 46px;
`;

const Header = styled.header`
	height: 10vh;
	display: flex;
	align-items: center;
	justify-content: center;
	border-bottom: 1px solid ${(props) => props.theme.textColor};
`;

interface I_Params {
	coinId: string;
}

interface I_State {
	name: string;
	pathname: string;
}

interface I_InfoData {
	id: string;
	name: string;
	symbol: string;
	rank: number;
	is_new: boolean;
	is_active: boolean;
	type: string;
	description: string;
	message: string;
	open_source: boolean;
	started_at: string;
	development_status: string;
	hardware_wallet: boolean;
	proof_type: string;
	org_structure: string;
	hash_algorithm: string;
	first_data_at: string;
	last_data_at: string;
}

function Coin() {
	const numberCommas = (x: any) => {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	};

	let history = useHistory();

	const { coinId } = useParams<I_Params>();
	const { state } = useLocation<I_State>();

	// react-router 6버전에서는 useRouteMatch()가 사라지고 useMatch()를 이용해야 함
	// 6버전에서는 Switch 가 Routes 로 변경됐고 대신 Outlet을 사용하면 nested router를 쉽게 이용
	// https://reactrouter.com/docs/en/v6/getting-started/overview
	// https://ui.dev/react-router-nested-routes

	const chartMatch = useRouteMatch(process.env.PUBLIC_URL + '/:coinId/chart');
	const priceMatch = useRouteMatch(process.env.PUBLIC_URL + `/:coinId/price`);

	// Query Select 처리로 주석 처리
	/*
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<I_InfoData>();
  const [price, setPrice] = useState<I_PriceData>();
  useEffect(() => {
    (async () => {
      const infoData = await (
        await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
      ).json();

      const priceData = await (
        await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
      ).json();

      setInfo(infoData);
      setPrice(priceData);
      setLoading(false);
    })();
  }, [coinId]);
  */

	const { isLoading: infoLoading, data: infoData } = useQuery<I_InfoData>(
		['info', coinId],
		() => fetchCoinsInfo(coinId),
	);

	const { isLoading: priceLoading, data: priceData } = useQuery<I_PriceData>(
		['price', coinId],
		() => fetchCoinsTickers(coinId),
		{
			refetchInterval: 3000,
		},
	);

	const loading = infoLoading || priceLoading;
	return (
		<Container>
			<Helmet>
				<title>{state?.name ? state.name : 'Coin List'}</title>
			</Helmet>
			<Header>
				<Title>
					<Link to={process.env.PUBLIC_URL + `/`}>&larr;</Link>
					{state?.name ? state.name : loading ? 'Loading...' : infoData?.name}
				</Title>
			</Header>

			{loading ? (
				<Loader>Loading....</Loader>
			) : (
				<>
					<Overview>
						<OverviewItem>
							<span>Rank:</span>
							<span>{infoData?.rank}</span>
						</OverviewItem>
						<OverviewItem>
							<span>Price:(USD)</span>
							<span>${priceData?.quotes.USD.price.toFixed(2)}</span>
						</OverviewItem>
					</Overview>
					<Description as='p'>{infoData?.description}</Description>
					<Overview>
						<OverviewItem>
							<span>Total Suply:</span>
							<span>{numberCommas(priceData?.total_supply)}</span>
						</OverviewItem>
						<OverviewItem>
							<span>Max Supply:</span>
							<span>{numberCommas(priceData?.max_supply)}</span>
						</OverviewItem>
					</Overview>

					<Split>
						<Tab isActive={chartMatch !== null}>
							<Link to={process.env.PUBLIC_URL + `/${coinId}/chart`}>
								Chart
							</Link>
						</Tab>
						<Tab isActive={priceMatch !== null}>
							<Link to={process.env.PUBLIC_URL + `/${coinId}/price`}>
								Price
							</Link>
						</Tab>
					</Split>

					<Switch>
						<Route path={process.env.PUBLIC_URL + `/:coinId/price`}>
							<Price coinId={coinId} />
						</Route>
						<Route path={process.env.PUBLIC_URL + `/:coinId/chart`}>
							<Chart coinId={coinId} />
						</Route>
					</Switch>
				</>
			)}
			<BtnWrap>
				<LinkHome
					as='button'
					onClick={() => {
						history.goBack();
					}}
				>
					이전
				</LinkHome>
				<LinkHome to={process.env.PUBLIC_URL + '/'}>목록보기</LinkHome>
			</BtnWrap>
		</Container>
	);
}

export default Coin;
