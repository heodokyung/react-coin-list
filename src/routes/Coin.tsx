import React, { useEffect, useState } from 'react';
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
import styled, { css } from 'styled-components';
import Price from './Price';
import Chart from './Chart';
import { useQuery } from 'react-query';
import { fetchCoinsInfo, fetchCoinsTickers } from './api';

const Container = styled.div`
  padding: 0 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Title = styled.h1`
  display: block;
  font-size: 36px;
  font-weight: bold;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.p`
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  background-color: ${(props) => props.theme.bgColor};
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.textColor};
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Description = styled.p`
  margin: 20px 0px;
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
  background-color: ${(props) => props.theme.bgColor};
  padding: 7px 0px;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.textColor};
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
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
  border: 1px solid ${(props) => props.theme.textColor};
  padding: 0 20px;
  border-radius: 4px;
  background: #fff;
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
interface I_PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

function Coin() {
  const numberCommas = (x: any) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  let history = useHistory();

  const { coinId } = useParams<I_Params>();
  const { state } = useLocation<I_State>();
  console.log(coinId);

  // react-router 6버전에서는 useRouteMatch()가 사라지고 useMatch()를 이용해야 함
  // 6버전에서는 Switch 가 Routes 로 변경됐고 대신 Outlet을 사용하면 nested router를 쉽게 이용
  // https://reactrouter.com/docs/en/v6/getting-started/overview
  // https://ui.dev/react-router-nested-routes

  const chartMatch = useRouteMatch('/:coinId/chart');
  const priceMatch = useRouteMatch('/:coinId/price');

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
    () => fetchCoinsInfo(coinId)
  );

  const { isLoading: priceLoading, data: priceData } = useQuery<I_PriceData>(
    ['price', coinId],
    () => fetchCoinsTickers(coinId),
    {
      refetchInterval: 3000,
    }
  );

  const loading = infoLoading || priceLoading;
  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? 'Loading...' : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <Title>
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
              <span>Symbol:</span>
              <span>${infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>{priceData?.quotes.USD.price.toFixed(2)}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
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
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
          </Split>

          <Switch>
            <Route path={`/:coinId/price`}>
              <Price coinId={coinId} />
            </Route>
            <Route path={`/:coinId/chart`}>
              <Chart coinId={coinId} />
            </Route>
          </Switch>
        </>
      )}
      <BtnWrap>
        <LinkHome
          as="button"
          onClick={() => {
            history.goBack();
          }}
        >
          이전
        </LinkHome>
        <LinkHome to="/">목록보기</LinkHome>
      </BtnWrap>
    </Container>
  );
}

export default Coin;
