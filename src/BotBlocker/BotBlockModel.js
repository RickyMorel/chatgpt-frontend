import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import ClientBlockComponent from './ClientBlockComponent';
import { PopupStyle } from '../Popups/PopupManager';
import { Color } from '../Colors';

class BotBlockModel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: null,
      searchInput: '',
      filteredClients: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.modalIsOpen !== prevProps.modalIsOpen) {
      this.fetchClientData();
    }
  }

  fetchClientData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/client-crud');
      this.setState({
        clients: response.data,
        filteredClients: response.data,
      });
    } catch (error) {
      this.setState({ error: error });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSearchInputChange = (event) => {
    const searchInput = event.target.value;
    this.setState({ searchInput }, () => {
      this.filterClients();
    });
  };

  filterClients = () => {
    const { clients, searchInput } = this.state;
    const filteredClients = clients.filter(client =>
      client.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      client.phoneNumber.toLowerCase().includes(searchInput.toLowerCase())
    );
    this.setState({ filteredClients });
  };

  render() {
    const { modalIsOpen, closeModalFunc } = this.props;
    const { loading, error, filteredClients } = this.state;

    const clientBlocks = filteredClients?.map(x => (
      <ClientBlockComponent key={x.id} {...x} />
    ));

    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModalFunc}
        contentLabel="Example Modal"
        style={PopupStyle.Small}
      >
      <div className={`card bordered ${Color.Background}`}>
        <div className="card-content">
          <span className="card-title">Bloquear Chat</span>
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={this.state.searchInput}
            onChange={this.handleSearchInputChange}
          />
          {clientBlocks}
        </div>
        <div className="card-action">
          <button className={`waves-effect waves-light btn ${Color.Fourth}`} onClick={closeModalFunc}>Cerrar</button>
        </div>
      </div>
      </Modal>
    );
  }
}

export default BotBlockModel;
