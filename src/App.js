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
      <button data-target="modal1" class="btn modal-trigger">Modal</button>
      <BotBlockModel modalIsOpen={modalIsOpen} openModalFunc={openModal} closeModalFunc={closeModal}/>
      <ExcelFileInput dataTypeName={"clientes"}/>
      <ExcelFileInput dataTypeName={"productos"}/>
      <DayLocationForm/>
      <ExcelFileOutput/>
    </div>
  );
}

export default App;
