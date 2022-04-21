import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchCoins } from './api';

const Container = styled.div`
  padding: 0 20px;
  max-width: 480px;
  margin: 0 auto;
`;
const Header = styled.header`
  height: 10vh;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid ${(props) => props.theme.textColor};
`;
const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: ${(props) => props.theme.accentColor};
`;
const CoinList = styled.ul`
  margin-top: 20px;
`;
const CoinElemnet = styled.li`
  margin-top: 10px;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.textColor};

  &:first-of-type {
    margin-top: 0;
  }

  a {
    display: flex;
    align-items: center;
    padding: 15px;
    transition: color 0.2s ease-in;
  }

  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Loader = styled.p`
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
`;

const SimbolImg = styled.img`
  width: 35px;
  height: auto;
  margin-right: 10px;
`;

interface I_Coin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

function Coins() {
  // React Query 활용
  /*
  const [coins, setCoins] = useState<I_Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // (() => console.log(1))();

    (async () => {
      // api.ts로 옮김
      // const response = await fetch('https://api.coinpaprika.com/v1/coins');
      // const json = await response.json();
      setCoins(json.slice(0, 100));
      setLoading(false);
    })();
  }, []);

  // https://cryptocurrencyliveprices.com/img/${coin.id}.png
  */

  // useQuery는 2가지 argument를 필요로 함.
  // 첫번째:queryKey, 두번째:fetcher 함수
  const { isLoading, data } = useQuery<I_Coin[]>('allCoins', fetchCoins);

  return (
    <Container>
      <Helmet>
        <title>Coins List</title>
      </Helmet>
      <Header>
        <Title>Coins</Title>
      </Header>
      {isLoading ? (
        <Loader>Loading....</Loader>
      ) : (
        <CoinList>
          {data?.slice(0, 100).map((coinEl) => (
            <CoinElemnet key={coinEl.id}>
              <Link
                to={{
                  pathname: `/${coinEl.id}`,
                  state: { name: coinEl.name },
                }}
              >
                <SimbolImg
                  src={`https://cryptocurrencyliveprices.com/img/${coinEl.id}.png`}
                />
                {coinEl.name} &rarr;
              </Link>
            </CoinElemnet>
          ))}
        </CoinList>
      )}
    </Container>
  );
}

export default Coins;
