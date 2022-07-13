import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchCoins } from './api';
import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';
import { isDarkAtom } from '../atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';

const Container = styled.div`
	padding: 0 20px;
	max-width: 480px;
	margin: 0 auto;
`;
const Header = styled.header`
	position: relative;
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
	background-color: ${(props) => props.theme.listColor};
	color: ${(props) => props.theme.textColor};

	&:first-of-type {
		margin-top: 0;
	}

	a {
		display: flex;
		align-items: center;
		padding: 15px;
		transition: color 0.2s ease-in;
		border: 1px solid ${(props) => props.theme.textColor};
		border-radius: 8px;
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

const ThemeButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	background: transparent;
	padding: 10px;
	color: ${(prop) => prop.theme.textColor};
	border: 1px solid ${(prop) => prop.theme.textColor};
	border-radius: 8px;
	background-color: ${(prop) => prop.theme.listColor};
	position: absolute;
	right: 0;
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
	const isDarkMode = useRecoilValue(isDarkAtom);
	const setDarkAtom = useSetRecoilState(isDarkAtom);
	const toggleDarkMode = () => setDarkAtom((prev) => !prev);

	return (
		<Container>
			<Helmet>
				<title>Coins List</title>
			</Helmet>
			<Header>
				<Title>Coins</Title>
				<ThemeButton type='button' onClick={toggleDarkMode}>
					{isDarkMode ? <BsFillSunFill /> : <BsFillMoonFill />}
				</ThemeButton>
			</Header>
			{isLoading ? (
				<Loader>Loading....</Loader>
			) : (
				<CoinList>
					{/* 데이터 100개만 가져오기 */}
					{data?.slice(0, 100).map((coinEl) => (
						<CoinElemnet key={coinEl.id}>
							<Link
								to={{
									pathname: process.env.PUBLIC_URL + `/${coinEl.id}/chart`,
									state: { name: coinEl.name },
								}}
							>
								<SimbolImg
									// src={`https://cryptocurrencyliveprices.com/img/${coinEl.id}.png`}
									src={`https://coinicons-api.vercel.app/api/icon/${coinEl.symbol.toLowerCase()}`}
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
