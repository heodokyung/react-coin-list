# React Coin List

React와 TypeScript로 만든 암호화폐 시세 대시보드입니다. 코인 목록, 현재가, 24시간/7일 변동률, 코인 로고, 상세 정보, 가격 차트를 확인할 수 있습니다.

## 바로가기

- URL: https://heodokyung.github.io/react-coin-list/

## 주요 기능

- 시가총액 기준 코인 목록 조회
- 코인명/심볼 검색
- 시가총액 순위, 현재가, 거래량, 24시간/7일 변동률 표시
- CoinGecko 이미지 URL 기반 코인 로고 표시
- 이미지 로딩 실패 시 심볼 문자 배지로 대체
- 코인 상세 정보 페이지
- 7일 가격 차트 및 가격 요약 탭
- 라이트/다크 모드 전환
- GitHub Pages 정적 배포 지원

## 기술 스택

- React 18
- TypeScript
- styled-components
- React Query
- Recoil
- React Router v5
- ApexCharts / react-apexcharts
- Axios
- GitHub Actions + GitHub Pages

## 데이터 API

이 프로젝트는 CoinGecko 공개 API를 사용합니다.

- 코인 목록/시세: `/coins/markets`
- 코인 상세: `/coins/{id}`
- 차트 데이터: `/coins/{id}/market_chart`

무료 공개 API 특성상 요청 제한이나 일시적인 응답 실패가 발생할 수 있습니다. 이를 대비해 화면이 완전히 깨지지 않도록 일부 fallback 데이터를 포함했습니다.

## 로컬 실행

```bash
npm install
npm start
```

개발 서버가 실행되면 브라우저에서 아래 주소로 접속합니다.

```text
http://localhost:3000
```

## 빌드

```bash
npm run build
```

GitHub Pages용 빌드는 아래 명령으로도 실행할 수 있습니다.

```bash
npm run build:pages
```

## 배포 방식

기존 `gh-pages` 브랜치 직접 배포 방식 대신 GitHub Actions 공식 Pages 배포 흐름을 사용합니다.

```text
main 브랜치 push
→ GitHub Actions 실행
→ npm ci
→ TypeScript 검사
→ React build
→ build 폴더를 Pages artifact로 업로드
→ GitHub Pages 배포
```

배포 설정은 아래 파일에서 관리합니다.

```text
.github/workflows/deploy.yml
```

GitHub 저장소 설정에서 Pages Source를 다음처럼 설정해야 합니다.

```text
Settings → Pages → Build and deployment → Source: GitHub Actions
```

`github-pages` 환경 보호 규칙을 사용 중이라면 `main` 브랜치 배포가 허용되어 있어야 합니다.

## 프로젝트 구조

```text
src/
├─ components/
│  └─ CoinIcon.tsx
├─ routes/
│  ├─ api.ts
│  ├─ Chart.tsx
│  ├─ Coin.tsx
│  ├─ Coins.tsx
│  └─ Price.tsx
├─ App.tsx
├─ Router.tsx
├─ atoms.ts
├─ styled.d.ts
└─ theme.ts
```

## 확인 포인트

배포 후 아래 항목을 확인합니다.

- 메인 화면에서 코인 목록이 보이는지
- 코인 로고 또는 문자 배지가 정상 표시되는지
- 검색과 정렬이 동작하는지
- 상세 페이지 이동이 가능한지
- 차트 탭과 가격 탭이 정상 표시되는지
- 새로고침해도 GitHub Pages에서 404가 발생하지 않는지

## 참고

이 프로젝트는 포트폴리오용 토이 프로젝트입니다. 표시되는 시세와 차트는 투자 판단용 데이터가 아니며, 실제 투자 결정에는 거래소 또는 공식 데이터 제공자의 최신 정보를 확인해야 합니다.
