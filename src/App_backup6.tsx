import styled from 'styled-components';

const Container = styled.div`
  background-color: ${(props) => props.theme.bgColor};
`;

const Title = styled.h1`
  color: ${(props) => props.theme.textColor};
`;

const Btn = styled.button`
  color: ${(props) => props.theme.bgColor};
`;

function App() {
  return (
    <div>
      <Container>
        <Title>Hello</Title>
        <Btn type="button">Log in</Btn>
      </Container>
    </div>
  );
}
export default App;
