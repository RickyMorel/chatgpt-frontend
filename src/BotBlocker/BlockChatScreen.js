import React, { Component } from 'react';
import axios from 'axios';
import ClientBlockComponent from './ClientBlockComponent';
import { Color } from '../Colors';

class BlockChatScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: null,
      searchInput: '',
      filteredClients: null,
      isGloballyBlocked: false,
      clientIsBlockedStateList: [],
      nextDayIndex: -1,
      dayLocations: [],
      clientLocations: []
    };
  }

  componentDidMount() {
    this.GetAllData()
  }

  GetAllData = async () => {
    this.props.setIsLoading(true)

    await this.fetchClientData();
    await this.fetchGlobalData()
    await this.fetchAllClientLocations()

    this.props.setIsLoading(false)
  }

  fetchClientData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/client-crud/blockChat`);
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

  fetchGlobalData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/global-config`);
      this.setState({
        isGloballyBlocked: response.data.isGloballyBlocked,
        nextDayIndex: response.data.nextMessageDayIndex,
        dayLocations: response.data.dayLocations
      });
    } catch (error) {
      this.setState({ error: error });
    }
  }

  fetchAllClientLocations = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/client-crud/getAllClientZones`);

      this.setState({
        clientLocations: [...response.data]
      })
    } catch (error) {
      console.log("error", error)
      return error
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
      const response = await axios.put(`${process.env.REACT_APP_HOST_URL}/global-config`, {isGloballyBlocked: globallyBlocked});
      this.setState({
        isGloballyBlocked: globallyBlocked
      });
      return response
    } catch (error) {
      return error
    }
  };

  handleClearAllBlocks = async (event) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_HOST_URL}/client-crud/unblockAllChats`);
      let clients = [...this.state.clientIsBlockedStateList]
      clients.forEach(client => {
        client.isBlocked = false
      });
      this.setState({
        clientIsBlockedStateList: [...clients]
      });
      return response
    } catch (error) {
      return error
    }
  };

  clientRegisterBlockedStateFunc = (phoneNumber, isBlocked) => {
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
  }

  filterClients = () => {
    const { clients, searchInput } = this.state;
    const filteredClients = clients.filter(client =>
      client.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      client.phoneNumber.toLowerCase().includes(searchInput.toLowerCase()) ||
      client.address.toLowerCase().includes(searchInput.toLowerCase())
    );
    this.setState({ filteredClients });
  };

  render() {
    const { modalIsOpen, closeModalFunc } = this.props;
    const { loading, error, filteredClients, isGloballyBlocked, nextDayIndex, dayLocations } = this.state;
    
    const tomorrowsDayLocationIndex = dayLocations.findIndex(x => x.day == nextDayIndex)

    let orderedClients = filteredClients != undefined ? [...filteredClients] : []
    
    orderedClients = orderedClients.sort((a, b) => {
      const willMessageTommorrow_a = dayLocations[tomorrowsDayLocationIndex]?.locations?.find(location => location == a.address)
      const willMessageTommorrow_b = dayLocations[tomorrowsDayLocationIndex]?.locations?.find(location => location == b.address)

      if (willMessageTommorrow_a) return -1;

      if (willMessageTommorrow_b) return 1;

      return 0;
    });

    orderedClients = orderedClients.sort((a, b) => {
      // If a is marked and b is not, a comes first
      if (!a.chatIsBlocked && b.chatIsBlocked) return -1;
      // If b is marked and a is not, b comes first
      if (a.chatIsBlocked && !b.chatIsBlocked) return 1;
      // Otherwise, maintain the current order
      return 0;
    });

    var clientsToMessage = 0
    const clientBlocks = orderedClients?.map(x => {
      let chatIsBlocked = this.state.clientIsBlockedStateList.find(y => y.client.phoneNumber == x.phoneNumber).isBlocked
      const willMessageTommorrow = dayLocations[tomorrowsDayLocationIndex]?.locations?.find(location => location == x.address)
      if(chatIsBlocked == false && willMessageTommorrow != undefined) {clientsToMessage = clientsToMessage + 1}

      return <ClientBlockComponent key={x.id} {...x} willMessageTommorrow={willMessageTommorrow} chatIsBlocked={chatIsBlocked} isGloballyBlocked={isGloballyBlocked} allClientLocations = {this.state.clientLocations}
        showPopup={this.props.showPopup} clientRegisterBlockedStateFunc={this.clientRegisterBlockedStateFunc} tomorrowsDayLocationIndex={tomorrowsDayLocationIndex} dayLocations={dayLocations}/>
  });

    return (
      <div className={`card bordered ${Color.Background}`}>
        <div className="card-content">
        <div className="row">
            <div className="col s3">
              <span className="card-title">Bloquear Chat</span>
            </div>
            <div className="col s3">
              <span className="">Clientes a mensajear: </span>
              {
              <span className="bold green-text">{clientsToMessage}</span>
              }
            </div>
            <div className="col s4">
              <label className='small-text'>Bloquear Chatbot</label>
              <div class="switch">
                <label>
                  No
                  <input type="checkbox" onChange={this.handleGlobalBlock} checked={this.state.isGloballyBlocked}/>
                  <span class="lever"></span>
                  Si
                </label>
              </div>
            </div>
            <div className="col s2">
              <label className='right'>Resetear</label>
              <a className={`waves-effect waves-light btn-small right ${Color.Fifths}`} onClick={this.handleClearAllBlocks}>
                <i className="material-icons">autorenew</i>
              </a>
            </div>
          </div>
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={this.state.searchInput}
            onChange={this.handleSearchInputChange}
          />
          <div style={{ overflowY: 'scroll', height: '63vh', "overflow-x": "hidden" }}>
            {clientBlocks}
          </div>
        </div>
      </div>
    );
  }
}

export default BlockChatScreen;
