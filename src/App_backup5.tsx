import { HtmlHTMLAttributes, useState } from 'react';

function App() {
  const [value, setValue] = useState('');
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
  };
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('hello', value);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="user name"
          value={value}
          onChange={onChange}
        />
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
export default App;
