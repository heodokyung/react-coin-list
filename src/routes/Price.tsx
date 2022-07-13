import { useQuery } from 'react-query';
import styled from 'styled-components';
import { I_PriceData } from '../atoms';
import { fetchCoinsTickers } from './api';

const ListPriceWrap = styled.article`
	margin-top: 50px;

	span {
		font-weight: bold;
	}
	ul {
		margin-top: 15px;
	}
	li {
		padding: 20px 10px;
		border-top: 1px solid #ddd;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: ${(props) => props.theme.listColor};
	}
`;
const Title = styled.p`
	font-size: 24px;
	font-weight: bold;
`;

interface PriceProps {
	coinId: string;
}

function Price({ coinId }: PriceProps) {
	const { isLoading, data } = useQuery<I_PriceData>(
		['price', coinId],
		() => fetchCoinsTickers(coinId),
		{
			// 재갱신 시간
			refetchInterval: 10000,
		},
	);
	// 한국환율로 계산하려면 한국수출입은행 API 사용
	// https://www.koreaexim.go.kr/ir/HPHKIR020M01?apino=2&viewtype=C&searchselect=&searchword=
	return (
		<div>
			{isLoading ? (
				'Loading chart...'
			) : (
				<ListPriceWrap>
					<Title>가격정보</Title>
					<ul>
						<li>
							<span>최고가(USD):</span>${data?.quotes.USD.ath_price.toFixed(2)}
						</li>
						<li>
							<span>현재가(USD):</span>${data?.quotes.USD.price.toFixed(2)}
						</li>
						<li>
							<span>등락율:</span> {data?.quotes.USD.percent_from_price_ath}%
						</li>
						<li>
							<span>15분 전:</span> {data?.quotes.USD.percent_change_15m}%
						</li>
						<li>
							<span>1시간 전:</span> {data?.quotes.USD.percent_change_1h}%
						</li>
						<li>
							<span>24시간 전:</span> {data?.quotes.USD.percent_change_24h}%
						</li>
						<li>
							<span>30일 전:</span> {data?.quotes.USD.percent_change_30d}%
						</li>
					</ul>
				</ListPriceWrap>
			)}
		</div>
	);
}

export default Price;
