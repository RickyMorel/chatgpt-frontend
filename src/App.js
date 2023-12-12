import React, { Component } from 'react';
import BotBlockModel from './BotBlocker/BotBlockModel';
import DayLocationForm from './DayLocationForm';
import ExcelFileInput from './Excel/ExcelFileInput';
import ExcelFileOutput from './Excel/ExcelFileOutput';
import {spawnPopup, PopupStyle} from './Popups/PopupManager'
import SuccessfulPopup from './Popups/SuccessfulPopup';
import { PopupProvider } from './Popups/PopupProvider';
import {Helmet} from 'react-helmet';
import { Color } from './Colors';
import ProductListModal from './Products/ProductListModal';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: [
        { id: 1, content: 'buy some milk' },
        { id: 2, content: 'play mario kart' },
      ],
      modalIsOpen: 0,
    };
  }

  openModal = (modalNum) => {
    this.setState({ modalIsOpen: modalNum });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: 0 });
  };

  render() {
    const { modalIsOpen } = this.state;

    return (
        <div className="App container">
            <Helmet>
              <style>{`body { background-color: #E9EBE3; }`}</style>
            </Helmet>
            <h1 className="center">WhiskChat</h1>
            <button onClick={() => this.openModal(1)}>Bloquear Chat</button>
            <button onClick={() => this.openModal(2)}>Ver Productos</button>
            <BotBlockModel
              modalIsOpen={modalIsOpen == 1}
              closeModalFunc={this.closeModal}
            />
            <ProductListModal
              modalIsOpen={modalIsOpen == 2}
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
