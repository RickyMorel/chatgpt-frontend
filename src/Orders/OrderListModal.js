import axios from 'axios';
import React, { Component } from 'react';
import Modal from 'react-modal';
import { Color } from '../Colors';
import { PopupStyle } from '../Popups/PopupManager';
import OrderComponent from './OrderComponent';

class OrderListModal extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          orders: null,
          filteredOrders: null,
          searchInput: '',
        };
    }

  componentDidUpdate(prevProps) {
    if (this.props.modalIsOpen !== prevProps.modalIsOpen) {
      this.fetchOrderData();
    }
  }

  fetchOrderData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/order`);
      this.setState({
        orders: response.data,
        filteredOrders: response.data,
      });
    } catch (error) {

    }
  };

  handleSearchInputChange = (event) => {
    const searchInput = event.target.value;
    this.setState({ searchInput }, () => {
      this.filterOrders();
    });
  };

  filterOrders = () => {
    const { orders, searchInput } = this.state;
    const filteredOrders = orders.filter(order =>
        order.name.toLowerCase().includes(searchInput.toLowerCase())
    );
    this.setState({ filteredOrders });
  };

  render() {
    const { modalIsOpen, closeModalFunc } = this.props;
    const { filteredOrders } = this.state;

    let i = 0
    const orderBlocks = filteredOrders?.map(x => {
      i += 1
      return <OrderComponent key={x.phoneNumber} {...x} orderNumber ={i} />
    });

    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModalFunc}
        contentLabel="Example Modal"
        style={PopupStyle.Medium}
      >
      <div className={`card bordered ${Color.Background}`}>
        <div className="card-content">
          <span className="card-title">Pedidos Recibidos</span>
          <input
            type="text"
            placeholder="Buscar pedidos..."
            value={this.state.searchInput}
            onChange={this.handleSearchInputChange}
          />
          <ul class="collapsible expandable">
            {orderBlocks}
          </ul>
        </div>
        <div className="card-action">
          <button className={`waves-effect waves-light btn ${Color.Button_1}`} onClick={closeModalFunc}>Cerrar</button>
        </div>
      </div>
      </Modal>
    );
  }
}

export default OrderListModal;
