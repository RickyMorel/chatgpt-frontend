import { useState } from 'react';
import Todos from './Todos';

function Home() {
  const [todos, setTodos] = useState([
    {id: 1, content: 'buy some milk'},
    {id: 2, content: 'play mario kart'}
  ])

  return (
    <div className="App container">
      <h1 className="center blue-text">Todo's</h1>
      <Todos todos={todos}/>
      <div className="content">
        <h1>App Component</h1>
      </div>
    </div>
  );
}

export default Home;