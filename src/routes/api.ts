const BASE_URL = 'https://api.coinpaprika.com/v1';

export function fetchCoins() {
  // 아래의 3줄 코드를 밑에 한줄 코드로 변경
  // const response = await fetch('https://api.coinpaprika.com/v1/coins');
  // const json = await response.json();
  // return json;

  return fetch(`${BASE_URL}/coins`).then((response) => response.json());
}

// 코인 정보
export function fetchCoinsInfo(coinId: string) {
  return fetch(`${BASE_URL}/coins/${coinId}`).then((response) =>
    response.json()
  );
}

// 가격 정보
export function fetchCoinsTickers(coinId: string) {
  return fetch(`${BASE_URL}/tickers/${coinId}`).then((response) =>
    response.json()
  );
}

// Chart, price
export function fetchCoinsChart(coinId: string, DateLimit: number = 2) {
  const endDate = Math.floor(Date.now() / 1000);
  // 2주의 데이터를 가져옴 (60 * 60 * 24 * 7) => 일주일
  const startDate = endDate - 60 * 60 * 24 * 7 * DateLimit;
  return fetch(
    `${BASE_URL}/coins/${coinId}/ohlcv/historical?start=${startDate}&end=${endDate}`
  ).then((response) => response.json());
}
