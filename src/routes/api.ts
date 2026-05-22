import axios from 'axios';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export interface CoinMarket {
	id: string;
	symbol: string;
	name: string;
	image: string;
	current_price: number;
	market_cap: number;
	market_cap_rank: number | null;
	total_volume: number;
	price_change_percentage_24h: number | null;
	price_change_percentage_7d_in_currency: number | null;
	sparkline_in_7d?: {
		price: number[];
	};
}

export interface CoinDetail {
	id: string;
	symbol: string;
	name: string;
	image?: {
		thumb?: string;
		small?: string;
		large?: string;
	};
	description?: {
		en?: string;
	};
	market_cap_rank: number | null;
	hashing_algorithm?: string | null;
	genesis_date?: string | null;
	categories?: string[];
	market_data?: {
		current_price?: {
			usd?: number;
		};
		market_cap?: {
			usd?: number;
		};
		total_volume?: {
			usd?: number;
		};
		ath?: {
			usd?: number;
		};
		ath_change_percentage?: {
			usd?: number;
		};
		price_change_percentage_24h?: number;
		price_change_percentage_7d?: number;
		price_change_percentage_30d?: number;
		circulating_supply?: number;
		total_supply?: number | null;
		max_supply?: number | null;
	};
}

export interface CoinChartPoint {
	time: number;
	price: number;
}

export interface CoinOhlcPoint {
	time: number;
	open: number;
	high: number;
	low: number;
	close: number;
}

export interface CoinChartData {
	prices: CoinChartPoint[];
	ohlc: CoinOhlcPoint[];
}

const createFallbackSparkline = (basePrice: number, volatility = 0.06) =>
	Array.from({ length: 24 }, (_, index) => {
		const wave = Math.sin(index / 2.2) * volatility;
		const drift = (index - 12) * 0.0015;
		return Number((basePrice * (1 + wave + drift)).toFixed(2));
	});

const FALLBACK_COINS: CoinMarket[] = [
	{
		id: 'bitcoin',
		symbol: 'btc',
		name: 'Bitcoin',
		image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
		current_price: 104250,
		market_cap: 2070000000000,
		market_cap_rank: 1,
		total_volume: 42000000000,
		price_change_percentage_24h: 1.24,
		price_change_percentage_7d_in_currency: 4.82,
		sparkline_in_7d: { price: createFallbackSparkline(104250, 0.035) },
	},
	{
		id: 'ethereum',
		symbol: 'eth',
		name: 'Ethereum',
		image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
		current_price: 3840,
		market_cap: 462000000000,
		market_cap_rank: 2,
		total_volume: 21000000000,
		price_change_percentage_24h: -0.84,
		price_change_percentage_7d_in_currency: 2.18,
		sparkline_in_7d: { price: createFallbackSparkline(3840, 0.055) },
	},
	{
		id: 'solana',
		symbol: 'sol',
		name: 'Solana',
		image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
		current_price: 172,
		market_cap: 81000000000,
		market_cap_rank: 5,
		total_volume: 5200000000,
		price_change_percentage_24h: 2.72,
		price_change_percentage_7d_in_currency: 7.1,
		sparkline_in_7d: { price: createFallbackSparkline(172, 0.09) },
	},
	{
		id: 'ripple',
		symbol: 'xrp',
		name: 'XRP',
		image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
		current_price: 2.18,
		market_cap: 126000000000,
		market_cap_rank: 4,
		total_volume: 4900000000,
		price_change_percentage_24h: -1.31,
		price_change_percentage_7d_in_currency: -3.4,
		sparkline_in_7d: { price: createFallbackSparkline(2.18, 0.08) },
	},
	{
		id: 'cardano',
		symbol: 'ada',
		name: 'Cardano',
		image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
		current_price: 0.74,
		market_cap: 26500000000,
		market_cap_rank: 10,
		total_volume: 980000000,
		price_change_percentage_24h: 0.66,
		price_change_percentage_7d_in_currency: 1.86,
		sparkline_in_7d: { price: createFallbackSparkline(0.74, 0.07) },
	},
];

const findFallbackCoin = (coinId: string) =>
	FALLBACK_COINS.find((coin) => coin.id === coinId) || FALLBACK_COINS[0];

export const getFallbackCoins = () => FALLBACK_COINS;

export const fetchCoins = async () => {
	const { data } = await axios.get<CoinMarket[]>(`${COINGECKO_BASE_URL}/coins/markets`, {
		params: {
			vs_currency: 'usd',
			order: 'market_cap_desc',
			per_page: 50,
			page: 1,
			sparkline: true,
			price_change_percentage: '24h,7d',
		},
	});

	return data;
};

export const fetchCoinsInfo = async (coinId: string) => {
	const { data } = await axios.get<CoinDetail>(`${COINGECKO_BASE_URL}/coins/${coinId}`, {
		params: {
			localization: false,
			tickers: false,
			market_data: true,
			community_data: false,
			developer_data: false,
			sparkline: false,
		},
	});

	return data;
};

export const fetchCoinsTickers = fetchCoinsInfo;

const buildOhlcFromPrices = (prices: CoinChartPoint[]) => {
	const bucketSize = Math.max(1, Math.ceil(prices.length / 14));
	const buckets: CoinOhlcPoint[] = [];

	for (let index = 0; index < prices.length; index += bucketSize) {
		const group = prices.slice(index, index + bucketSize);
		if (!group.length) continue;

		const groupPrices = group.map((point) => point.price);
		buckets.push({
			time: group[0].time,
			open: groupPrices[0],
			high: Math.max(...groupPrices),
			low: Math.min(...groupPrices),
			close: groupPrices[groupPrices.length - 1],
		});
	}

	return buckets;
};

export const fetchCoinsChart = async (coinId: string): Promise<CoinChartData> => {
	const { data } = await axios.get<{ prices: [number, number][] }>(
		`${COINGECKO_BASE_URL}/coins/${coinId}/market_chart`,
		{
			params: {
				vs_currency: 'usd',
				days: 7,
				interval: 'hourly',
			},
		},
	);

	const prices = data.prices.map(([time, price]) => ({ time, price }));

	return {
		prices,
		ohlc: buildOhlcFromPrices(prices),
	};
};

export const createFallbackDetail = (coinId: string): CoinDetail => {
	const coin = findFallbackCoin(coinId);
	return {
		id: coin.id,
		symbol: coin.symbol,
		name: coin.name,
		image: {
			thumb: coin.image,
			small: coin.image,
			large: coin.image,
		},
		description: {
			en: `${coin.name} is a sample fallback asset shown when the live coin API is temporarily unavailable.`,
		},
		market_cap_rank: coin.market_cap_rank,
		categories: ['Fallback data'],
		market_data: {
			current_price: { usd: coin.current_price },
			market_cap: { usd: coin.market_cap },
			total_volume: { usd: coin.total_volume },
			ath: { usd: coin.current_price * 1.3 },
			ath_change_percentage: { usd: -18.4 },
			price_change_percentage_24h: coin.price_change_percentage_24h || 0,
			price_change_percentage_7d: coin.price_change_percentage_7d_in_currency || 0,
			price_change_percentage_30d: 6.2,
			circulating_supply: 0,
			total_supply: null,
			max_supply: null,
		},
	};
};

export const createFallbackChart = (coinId: string): CoinChartData => {
	const coin = findFallbackCoin(coinId);
	const prices = (coin.sparkline_in_7d?.price || []).map((price, index) => ({
		time: Date.now() - (24 - index) * 60 * 60 * 1000,
		price,
	}));

	return {
		prices,
		ohlc: buildOhlcFromPrices(prices),
	};
};
