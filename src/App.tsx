import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { ReactQueryDevtools } from 'react-query/devtools';
import Router from './Router';
import reset from 'styled-reset';
import { lightTheme, darkTheme } from './theme';
import { useState } from 'react';
import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';

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
  }
`;

const ThemeButton = styled.button`
  position: fixed;
  top: 10px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 10px;
  color: ${(prop) => prop.theme.textColor};
  border: 1px solid ${(prop) => prop.theme.textColor};
  border-radius: 8px;
`;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    console.log(isDarkMode);
  };

  return (
    <>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <ThemeButton type="button" onClick={() => toggleDarkMode()}>
          {isDarkMode ? <BsFillSunFill /> : <BsFillMoonFill />}
        </ThemeButton>
        <GlobalStyle />
        <Router />
        <ReactQueryDevtools initialIsOpen={true} />
      </ThemeProvider>
    </>
  );
}
export default App;
