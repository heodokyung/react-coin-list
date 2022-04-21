import styled from 'styled-components';

const Father = styled.div``;

const Box = styled.div`
  background-color: ${(props) => props.bgColor};
  width: 100px;
  height: 100px;
  text-align: center;
`;

const Circle = styled(Box)`
  border-radius: 50%;
`;

const Text = styled.span`
  color: white;
`;

const Btn = styled.button`
  background-color: tomato;
  border-radius: 8px;
  color: white;
  font-size: 14px;
`;

const Input = styled.input.attrs({ maxLength: 100, required: true })`
  border: 2px solid #222;
  height: 40px;
`;

function App() {
  return (
    <Father>
      <Box bgColor="teal">
        <Text>Hello</Text>
      </Box>
      <Circle bgColor="tomato">
        <Text>Hi</Text>
      </Circle>

      <hr />

      <Btn>Log in</Btn>
      <Btn as="a" href="/">
        Log in
      </Btn>

      <hr />

      <Input type={'password'} />
      <br />
      <Input type={'checkbox'} />
      <br />
      <Input type={'radio'} />
      <br />
      <Input type={'text'} />
      <br />
      <Input type={'number'} />
    </Father>
  );
}

export default App;
