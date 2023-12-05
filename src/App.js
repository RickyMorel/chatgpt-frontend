import { useState } from 'react';
import Navbar from './Navbar';
import Todos from './Todos';
import ExcelFileInput from './Excel/ExcelFileInput';
import DayLocationForm from './DayLocationForm';
import ExcelFileOutput from './Excel/ExcelFileOutput';
import BotBlockModel from './BotBlocker/BotBlockModel';

function App() {
  const [todos, setTodos] = useState([
    {id: 1, content: 'buy some milk'},
    {id: 2, content: 'play mario kart'}
  ])

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="App container">
      <h1 className="center blue-text">Todo's</h1>
      <button onClick={openModal}>Open Modal</button>
      <ExcelFileInput dataTypeName={"clientes"}/>
      <ExcelFileInput dataTypeName={"productos"}/>
      <DayLocationForm/>
      <ExcelFileOutput/>
      <BotBlockModel modalIsOpen={modalIsOpen} closeModalFunc={closeModal}/>
      {/* <Todos todos={todos}/> */}
      <div className="content">
        <h1>App Component</h1>
      </div>
    </div>
  );
}

export default App;
