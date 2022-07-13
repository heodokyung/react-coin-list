import axios from 'axios';

// 코인 API
const BASE_URL = 'https://api.coinpaprika.com/v1';

// 차트 API (아래 예시 참조)
// https://ohlcv-api.nomadcoders.workers.dev?coinId=btc-bitcoin
const PRICE_URL = 'https://ohlcv-api.nomadcoders.workers.dev';

// 기본 Main 코인 리스트
export const fetchCoins = async () => {
	return await axios
		.get(`${BASE_URL}/coins/`)
		.then((response) => response.data);
};

// 코인 정보
export const fetchCoinsInfo = async (coinId: string) => {
	return await axios
		.get(`${BASE_URL}/coins/${coinId}`)
		.then((response) => response.data);
};

// 가격 정보
export const fetchCoinsTickers = async (coinId: string) => {
	return await axios
		.get(`${BASE_URL}/tickers/${coinId}`)
		.then((response) => response.data);
};

// 차트
export const fetchCoinsChart = async (coinId: string) => {
	return await axios
		.get(`${PRICE_URL}/?coinId=${coinId}`)
		.then((response) => response.data);
};
