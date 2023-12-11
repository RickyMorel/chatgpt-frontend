import React, { Component } from 'react';
import BotBlockModel from './BotBlocker/BotBlockModel';
import DayLocationForm from './DayLocationForm';
import ExcelFileInput from './Excel/ExcelFileInput';
import ExcelFileOutput from './Excel/ExcelFileOutput';
import {spawnPopup, PopupStyle} from './Popups/PopupManager'
import SuccessfulPopup from './Popups/SuccessfulPopup';
import { PopupProvider } from './Popups/PopupProvider';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: [
        { id: 1, content: 'buy some milk' },
        { id: 2, content: 'play mario kart' },
      ],
      modalIsOpen: false,
    };
  }

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  render() {
    const { modalIsOpen } = this.state;

    return (
        <div className="App container">
            <h1 className="center blue-text">Todo's</h1>
            <button onClick={this.openModal}>Open Modal</button>
            <BotBlockModel
              modalIsOpen={modalIsOpen}
              openModalFunc={this.openModal}
              closeModalFunc={this.closeModal}
            />
            {this.state.currentPopup}
            <ExcelFileInput dataTypeName={'clientes'} />
            <ExcelFileInput dataTypeName={'productos'} />
            <DayLocationForm showPopup={this.props.showPopup}/>
            <ExcelFileOutput />
        </div>
    );
  }
}

export default App;
