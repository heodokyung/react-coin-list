import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { ReactQueryDevtools } from 'react-query/devtools';
import Router from './Router';
import reset from 'styled-reset';
import { lightTheme, darkTheme } from './theme';
import { useRecoilValue } from 'recoil';
import { isDarkAtom } from './atoms';

const GlobalStyle = createGlobalStyle`
  ${reset}

  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400&display=swap');

  * {
    box-sizing: border-box;
  }

  body {
    line-height: 1;
    font-family: 'Source Sans Pro', sans-serif;
    background-color: ${(props) => props.theme.bgColor};
    color:${(props) => props.theme.textColor}
  }
  a {
    text-decoration: none;
    color:inherit;
    background-color: inherit;
  }
`;

function App() {
	// 다크 모드 관리
	const isDarkMode = useRecoilValue(isDarkAtom);

	return (
		<>
			<ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
				<GlobalStyle />
				<Router />
				<ReactQueryDevtools initialIsOpen={true} />
			</ThemeProvider>
		</>
	);
}
export default App;
