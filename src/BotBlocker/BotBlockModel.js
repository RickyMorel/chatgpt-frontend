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
      isGloballyBlocked: false,
      clientIsBlockedStateList: []
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
      let newList = []
      response.data.forEach(client => {
        const newClientState = {client: client, isBlocked: client.chatIsBlocked}
        newList.push(newClientState)
      });
      this.setState({
        clients: response.data,
        filteredClients: response.data,
        clientIsBlockedStateList: newList
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

  handleGlobalBlock = async (event) => {
    try {
      const globallyBlocked = event.target.checked;
      const response = await axios.put('http://localhost:3000/client-crud/blockClientChat', {isBlocked: globallyBlocked});
      console.log("handleGlobalBlock", globallyBlocked)
      this.setState({
        isGloballyBlocked: globallyBlocked
      });
      return response
    } catch (error) {
      return error
    }
  };

  clientRegisterBlockedStateFunc = (phoneNumber, isBlocked) => {
    console.log("clientRegisterBlockedStateFunc", phoneNumber, isBlocked)
    let newList = [...this.state.clientIsBlockedStateList]
    const client = this.state.clients.find(x => x.phoneNumber == phoneNumber)
    const newClientState = {client: client, isBlocked: isBlocked}
    const prevClientState = this.state.clientIsBlockedStateList.find(x => x.client.phoneNumber == phoneNumber)

    if(prevClientState){
      const clientIndex = this.state.clientIsBlockedStateList.indexOf(prevClientState)
      newList[clientIndex] = newClientState
    }
    else {
      newList.push(newClientState)
    }

    this.setState({
      clientIsBlockedStateList: newList
    })

    console.log("newList", newList)
  }

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
    const { loading, error, filteredClients, isGloballyBlocked } = this.state;

    const clientBlocks = filteredClients?.map(x => {
      let chatIsBlocked = this.state.clientIsBlockedStateList.find(y => y.client.phoneNumber == x.phoneNumber).isBlocked

      return <ClientBlockComponent key={x.id} {...x} chatIsBlocked={chatIsBlocked} isGloballyBlocked={isGloballyBlocked} 
        clientRegisterBlockedStateFunc={this.clientRegisterBlockedStateFunc}/>
  });

    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModalFunc}
        contentLabel="Example Modal"
        style={PopupStyle.Small}
      >
      <div className={`card bordered ${Color.Background}`}>
        <div className="card-content">
          <div className="row">
            <div className="col s8">
              <span className="card-title">Bloquear Chat</span>
            </div>
            <div className="col s4">
              <label className='small-text'>Bloquear Chatbot</label>
            <div class="switch">
              <label>
                No
                <input type="checkbox" onChange={this.handleGlobalBlock}/>
                <span class="lever"></span>
                Si
              </label>
            </div>
            </div>
          </div>
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={this.state.searchInput}
            onChange={this.handleSearchInputChange}
          />
          {clientBlocks}
        </div>
        <div className="card-action">
          <button className={`waves-effect waves-light btn ${Color.Button_1}`} onClick={closeModalFunc}>Cerrar</button>
        </div>
      </div>
      </Modal>
    );
  }
}

export default BotBlockModel;
