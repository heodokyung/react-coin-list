import { createGlobalStyle, ThemeProvider } from 'styled-components';
import Router from './Router';
import reset from 'styled-reset';
import { lightTheme, darkTheme } from './theme';
import { useRecoilValue } from 'recoil';
import { isDarkAtom } from './atoms';

const GlobalStyle = createGlobalStyle`
	${reset}

	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

	* {
		box-sizing: border-box;
	}

	body {
		min-width: 320px;
		line-height: 1.5;
		font-family: 'Inter', 'Apple SD Gothic Neo', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
		background-color: ${(props) => props.theme.bgColor};
		color: ${(props) => props.theme.textColor};
	}

	button,
	input,
	select {
		font: inherit;
	}

	button {
		cursor: pointer;
	}

	a {
		text-decoration: none;
		color: inherit;
	}

	img {
		display: block;
		max-width: 100%;
	}
`;

function App() {
	const isDarkMode = useRecoilValue(isDarkAtom);

	return (
		<ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
			<GlobalStyle />
			<Router />
		</ThemeProvider>
	);
}
export default App;
