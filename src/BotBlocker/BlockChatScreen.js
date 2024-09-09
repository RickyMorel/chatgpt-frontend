import React, { Component } from 'react';
import axios from 'axios';
import ClientBlockComponent from './ClientBlockComponent';
import { Color, ColorHex } from '../Colors';
import PaginatedScrollView from './PaginatedScrollView';
import CssProperties from '../CssProperties';
import StatCard from '../Searchbar/StatCard';
import CustomButton from '../Searchbar/CustomButton';
import CustomToggle from '../Searchbar/CustomToggle';
import SearchBar from '../Searchbar/Searchbar';
import CustomSelect from '../Searchbar/CustomSelect';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

class BlockChatScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: [],
      searchInput: '',
      filteredClients: [],
      isGloballyBlocked: false,
      clientIsBlockedStateList: [],
      nextDayIndex: -1,
      dayLocations: [],
      clientLocations: [],
      pageNumber: 1,
      pageSize: 15,
      clientsToMessageTommorrow: 0
    };
  }

  componentDidMount() {
    this.GetAllData()
  }

  GetAllData = async () => {
    this.props.setIsLoading(true)

    await this.fetchClientsToMessageTommorrowAmount();
    await this.fetchClientData();
    await this.fetchGlobalData()
    await this.fetchAllClientLocations()

    this.props.setIsLoading(false)
  }

  fetchClientsToMessageTommorrowAmount = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/client-crud/countClientsToDeliverTommorrow`);
      this.setState({
        clientsToMessageTommorrow: response.data
      });
    } catch (error) {
      this.setState({ error: error });
    }
  }

  fetchClientData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/client-crud/blockChat?pageNumber=${this.state.pageNumber}&pageSize=${this.state.pageSize}`);
      let newList = [...this?.state?.clientIsBlockedStateList]
      let newClientList = [...this?.state?.clients]
      for(const client of response.data) {
        const newClientState = {client: client, isBlocked: client.chatIsBlocked}

        if(!newList.find(x => x.client.phoneNumber == client.phoneNumber)) { newList.push(newClientState); }
        if(!newClientList.find(x => x.phoneNumber == client.phoneNumber)) { newClientList.push(client); }
      } 

      let newPage = this.state.pageNumber + 1
      this.setState({
        clients: newClientList,
        filteredClients: newClientList,
        clientIsBlockedStateList: newList,
        pageNumber: newPage
      });
      return response.data
    } catch (error) {
      console.log("error", error)
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

  tryFetchSearchedClients = async () => {
    //Don't call search endpoint if the searcher still brings a few clients
    if(this.state.filteredClients.length > 5) {return;}

    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/client-crud/searchClientByNumber?searchNumber=${this.state.searchInput}&limit=${5}`);
      console.log("tryFetchSearchedClients response", response.data)
      let clients = [...this.state.clients]
      let filteredClients = [...this.state.filteredClients]
      let blockedStateList = [...this.state.clientIsBlockedStateList]
      for(const client of response.data) {
        if(clients.find(x => x.phoneNumber == client.phoneNumber) == undefined) { clients.push(client); }
        if(filteredClients.find(x => x.phoneNumber == client.phoneNumber) == undefined) { filteredClients.push(client); }
        if(blockedStateList.find(x => x.client.phoneNumber == client.phoneNumber) == undefined) 
        {         
          const newClientState = {client: client, isBlocked: client.chatIsBlocked}
          blockedStateList.push(newClientState)
        }
      }

      this.setState({
        clients: clients,
        filteredClients: filteredClients,
        clientIsBlockedStateList: blockedStateList
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
    })
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
    this.setState({ filteredClients }, () => {
      this.tryFetchSearchedClients()
    })
  };

  render() {
    const { modalIsOpen, closeModalFunc } = this.props;
    const { loading, error, filteredClients, isGloballyBlocked, nextDayIndex, dayLocations } = this.state;
    
    const tomorrowsDayLocationIndex = dayLocations.findIndex(x => x.day == nextDayIndex)

    let orderedClients = filteredClients != undefined ? [...filteredClients] : []
    
    orderedClients.sort((a, b) => {
      const willMessageTommorrow_a = dayLocations[tomorrowsDayLocationIndex]?.locations?.find(location => location == a.address)
      const willMessageTommorrow_b = dayLocations[tomorrowsDayLocationIndex]?.locations?.find(location => location == b.address)

    // First, sort by location and whether they will message tomorrow
    if (willMessageTommorrow_a && !willMessageTommorrow_b) return -1;
    if (!willMessageTommorrow_a && willMessageTommorrow_b) return 1;
    
    // If both will message tomorrow or neither will, sort by chatIsBlocked
    if (!a.chatIsBlocked && b.chatIsBlocked) return -1;
    if (a.chatIsBlocked && !b.chatIsBlocked) return 1;

      return 0;
    });

    let orderedLocations = this.state.clientLocations.sort()

    const clientBlocks = orderedClients?.map(x => {
      let chatIsBlocked = this.state.clientIsBlockedStateList.find(y => y.client.phoneNumber == x.phoneNumber).isBlocked
      const willMessageTommorrow = dayLocations[tomorrowsDayLocationIndex]?.locations?.find(location => location == x.address)

      return <ClientBlockComponent key={x.id} {...x} willMessageTommorrow={willMessageTommorrow} chatIsBlocked={chatIsBlocked} isGloballyBlocked={isGloballyBlocked} allClientLocations = {orderedLocations}
        showPopup={this.props.showPopup} clientRegisterBlockedStateFunc={this.clientRegisterBlockedStateFunc} tomorrowsDayLocationIndex={tomorrowsDayLocationIndex} dayLocations={dayLocations}/>
    });

    return (
      <div>
        <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>Clientes</p>

        <div style={{display: 'flex'}}>
            <div class="flex-grow-1"><StatCard title="Clientes a Mensajear" amountColor={ColorHex.TextBody} amountFunction={() => this.state.clientsToMessageTommorrow}/></div>
            <div class="flex-grow-1" style={{paddingLeft: '25px'}}><StatCard title="Mensajes Enviados" amountColor={ColorHex.GreenFabri} amountFunction={() => 711}/></div>
            <div className="col-10"></div>
        </div>

        <div style={{display: 'flex', width: '100%', paddingTop: '25px', justifyContent: 'flex-start', alignItems: 'center'}}>
          <div style={{flexGrow: 0}}><CustomButton text="Enviar Mensajes" icon={faPaperPlane} onClickCallback={this.handleCheckOrders}/></div>
          <div style={{flexGrow: 0, marginLeft: '45px'}}><CustomToggle text="Bloquear Chat Bot" onChange={this.handleGlobalBlock} checked={this.state.isGloballyBlocked}/></div>
        </div>

        <div style={orderPanelStyling}>
          <div className='row'>
            <div className="col-10">
              <SearchBar width='100%' height='45px' itemList={this.state.products} searchText="Buscar Clientes..." OnSearchCallback={(value) => this.handleSearch(value, false)}/>
            </div>
            <div className="col-2">
              <CustomSelect
                width='292px'
                height='45px'
                // options={dayDropdownOptions}
                // onChange={(value) => this.handleDayTabClick(value)}
                // value={dayDropdownOptions.find(x => x.value == selectedDayNumber)}
                isSearchable={false}
              />
            </div>
          </div>
          <div style={{ alignItems: 'center', width: '100%', marginTop: '25px'}}>
            <div style={{ alignItems: 'center', height: '45px', width: '98%', display: 'flex'}}>
              <div style={headerStyle} className='col-3'>Nombre del Cliente</div>
              <div style={headerStyle} className='col-3'>Ubicacion</div>
              <div style={headerStyle} className='col-3'>Numero de Telefono</div>
              <div style={headerStyle} className='col-2'>Cliente a Mensajear</div>
              <div style={headerStyle} className='col-1'></div>
            </div>

            <PaginatedScrollView clientBlocks={clientBlocks} fetchMoreData={this.fetchClientData} pageSize={this.state.pageSize}/>
          </div>
        </div>
      </div>
      // <div className={`card bordered ${Color.Background}`}>
      //   <div className="card-content">
      //   <div className="row">
      //       <div className="col s3">
      //         <span className="card-title">Bloquear Chat</span>
      //       </div>
      //       <div className="col s3">
      //         <span className="">Clientes a mensajear: </span>
      //         {
      //         <span className="bold green-text">{this.state.clientsToMessageTommorrow}</span>
      //         }
      //       </div>
      //       <div className="col s4">
      //         <label className='small-text'>Bloquear Chatbot</label>
      //         <div class="switch">
      //           <label>
      //             No
      //             <input type="checkbox" onChange={this.handleGlobalBlock} checked={this.state.isGloballyBlocked}/>
      //             <span class="lever"></span>
      //             Si
      //           </label>
      //         </div>
      //       </div>
      //       <div className="col s2">
      //         <label className='right'>Resetear</label>
      //         <a className={`waves-effect waves-light btn-small right ${Color.Fifths}`} onClick={this.handleClearAllBlocks}>
      //           <i className="material-icons">autorenew</i>
      //         </a>
      //       </div>
      //     </div>
      //     <input
      //       type="text"
      //       placeholder="Buscar clientes..."
      //       value={this.state.searchInput}
      //       onChange={this.handleSearchInputChange}
      //     />
      //     <PaginatedScrollView clientBlocks={clientBlocks} fetchMoreData={this.fetchClientData} pageSize={this.state.pageSize}/>
      //   </div>
      // </div>
    );
  }
}

const headerStyle = {
  textAlign: 'center',
  color: ColorHex.TextBody,
  ...CssProperties.BodyTextStyle
}

const orderPanelStyling = {
  width: '100%',
  height: '70vh',
  marginTop: '10px',
  marginTop: '25px',
  padding: '25px',
  boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
  border: `1px solid ${ColorHex.BorderColor}`,
  borderRadius: '10px',
  backgroundColor: ColorHex.White
}

export default BlockChatScreen;
