import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import BotBlockModel from './BotBlocker/BotBlockModel';
import { Color } from './Colors';
import DayLocationForm from './DayLocationForm';
import ExcelFileInput from './Excel/ExcelFileInput';
import ExcelFileOutput from './Excel/ExcelFileOutput';
import OrderListModal from './Orders/OrderListModal';
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
            <h1 className="center">Chatbot</h1>
            <button className={`waves-effect waves-light btn ${Color.Button_1}`} onClick={() => this.openModal(1)}>
              <i className="material-icons left">contacts</i>
              Bloquear Chat
            </button>
            <button className={`waves-effect waves-light btn ${Color.Button_1}`} onClick={() => this.openModal(2)}>
              <i className="material-icons left">local_mall</i>
              Ver Productos
            </button>
            <button className={`waves-effect waves-light btn ${Color.Button_1}`} onClick={() => this.openModal(3)}>
              <i className="material-icons left">shopping_cart</i>
              Ver Pedidos
            </button>
            <BotBlockModel
              modalIsOpen={modalIsOpen == 1}
              closeModalFunc={this.closeModal}
            />
            <ProductListModal
              modalIsOpen={modalIsOpen == 2}
              closeModalFunc={this.closeModal}
            />
            <OrderListModal
              modalIsOpen={modalIsOpen == 3}
              closeModalFunc={this.closeModal}
            />
            {this.state.currentPopup}
            <div className='row'>
              <div style={{ height: '100%' }} className='col s6'>
                <h6>Actualizar Clientes</h6>
                <ExcelFileInput dataTypeName={'clientes'} />
                <p> </p>
                <h6>Actualizar Productos</h6>
                <ExcelFileInput dataTypeName={'productos'} />
              </div>
              <div className='col s6'>
                <DayLocationForm showPopup={this.props.showPopup}/>
              </div>
            </div>
            <ExcelFileOutput />
        </div>
    );
  }
}

export default App;
