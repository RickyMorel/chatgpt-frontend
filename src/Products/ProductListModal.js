import axios from 'axios';
import React, { Component } from 'react';
import Modal from 'react-modal';
import { Color } from '../Colors';
import { PopupStyle } from '../Popups/PopupManager';
import ProductComponent from './ProductComponent';

class ProductListModal extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          products: null,
          filteredProducts: null,
          searchInput: '',
        };
    }

  componentDidUpdate(prevProps) {
    if (this.props.modalIsOpen !== prevProps.modalIsOpen) {
      this.fetchClientData();
    }
  }

  fetchClientData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/inventory/allItems');
      this.setState({
        products: response.data,
        filteredProducts: response.data,
      });
    } catch (error) {

    }
  };

  handleSearchInputChange = (event) => {
    const searchInput = event.target.value;
    this.setState({ searchInput }, () => {
      this.filterProducts();
    });
  };

  filterProducts = () => {
    const { products, searchInput } = this.state;
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchInput.toLowerCase())
    );
    this.setState({ filteredProducts });
  };

  render() {
    const { modalIsOpen, closeModalFunc } = this.props;
    const { filteredProducts } = this.state;

    const productBlocks = filteredProducts?.map(x => (
      <ProductComponent key={x.id} {...x} />
    ));

    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModalFunc}
        contentLabel="Example Modal"
        style={PopupStyle.Medium}
      >
      <div className={`card bordered ${Color.Background}`}>
        <div className="card-content">
          <span className="card-title">Productos Cargados</span>
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={this.state.searchInput}
            onChange={this.handleSearchInputChange}
          />
          {productBlocks}
        </div>
        <div className="card-action">
          <button className={`waves-effect waves-light btn ${Color.Button_1}`} onClick={closeModalFunc}>Cerrar</button>
        </div>
      </div>
      </Modal>
    );
  }
}

export default ProductListModal;
