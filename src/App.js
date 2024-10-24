import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import BlockChatScreen from './BotBlocker/BlockChatScreen';
import EditClientScreen from './BotBlocker/EditClientScreen';
import { ColorHex } from './Colors';
import DayLocationForm from './DayLocation/DayLocationForm';
import InventoryEditItemScreen from './Inventory/InventoryEditItemScreen';
import InventoryScreen from './Inventory/InventoryScreen';
import LoadSpinner from './LoadSpinner';
import MainMenu from './MainMenu';
import AddOrderScreen from './Orders/AddOrderScreen';
import OrderScreen from './Orders/OrderScreen';
import ProblematicChatsScreen from './ProblematicChats/ProblematicChatsScreen';
import SideNav from './SideNav';
import ClientStatsScreen from './Stats/ClientStatsScreen';
import KPIStatsScreen from './Stats/KPIStatsScreen';
import QrCodeScreen from './qrCodeScreen';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: 0,
      isLoading: false,
      loaderMessge: "",
      botNumber: "",
      instanceStatus: "a",
    };

    this.intervalId = null
  }
  
  componentDidMount() {
    this.GetInstanceStatus()
    //Get the instance status every second until y link whatsapp
    this.intervalId = setInterval(this.GetInstanceStatus, 2000);

    this.GetBotNumber()
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  componentDidUpdate() {
    console.log("this.state.instanceStatu", this.state.instanceStatus)
    if(this.state.instanceStatus == "authenticated") {clearInterval(this.intervalId);}
  }

  GetBotNumber = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/global-config/botNumber`);
      this.setState({
        botNumber: response.data,
      })
    } catch (error) {
      this.props.showPopup(new Error(error.response.data.message))
    }
  };

  GetInstanceStatus = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/whatsapp/getInstanceStatus`);
      console.log("GetInstanceStatus", response)

      this.setState({
        instanceStatus: response.data.accountStatus.status,
      })
    } catch (error) {
      this.props.showPopup(new Error(error.response.data.message))
    }
  };

  setIsLoading = (loading, specialMessage = "") => {
    this.setState({
      isLoading: loading,
      loaderMessge: specialMessage
    })
  }

  render() {
    return (
    <Router>
      {this.state.instanceStatus != "authenticated" && this.state.instanceStatus != "a" ? <QrCodeScreen status={this.state.instanceStatus}/> : <></>}
      <LoadSpinner isLoading={this.state.isLoading} loaderMessge={this.state.loaderMessge} />
      <div className="row">
        <div className="col-auto">
          <SideNav botNumber={this.state.botNumber} style={{ height: '100vh', width: '236px'}}/>
        </div>
        <div className="col">
          <Helmet>
            <style>{`body { background-color: ${ColorHex.Background}; }`}</style>
          </Helmet>
          <Switch>
            <Route exact path="/">
              <div style={{margin: '15px'}}><MainMenu showPopup={this.props.showPopup} setIsLoading={this.setIsLoading} /></div>
            </Route>
            <Route exact path="/inventory">
              <div style={{margin: '15px'}}><InventoryScreen showPopup={this.props.showPopup} showPopup_2_Buttons={this.props.showPopup_2_Buttons} setIsLoading={this.setIsLoading} /></div>
            </Route>
            <Route exact path="/dayLocation">
              <div style={{margin: '15px'}}><DayLocationForm showPopup={this.props.showPopup} setIsLoading={this.setIsLoading} /></div>
            </Route>
            <Route exact path="/blockChats">
              <div style={{margin: '15px'}}><BlockChatScreen showPopup={this.props.showPopup} setIsLoading={this.setIsLoading} /></div>
            </Route>
            <Route exact path="/orders">
              <div style={{margin: '15px'}}><OrderScreen showPopup={this.props.showPopup} setIsLoading={this.setIsLoading} /></div>
            </Route>
            <Route exact path="/stats">
              <div style={{margin: '15px'}}><KPIStatsScreen showPopup={this.props.showPopup} setIsLoading={this.setIsLoading} /></div>
            </Route>
            <Route exact path="/stats/clients">
              <div style={{margin: '15px'}}><ClientStatsScreen showPopup={this.props.showPopup} setIsLoading={this.setIsLoading} /></div>
            </Route>
            <Route exact path="/problematicChats">
              <div style={{margin: '15px'}}><ProblematicChatsScreen showPopup={this.props.showPopup} setIsLoading={this.setIsLoading} botNumber={this.state.botNumber}/></div>
            </Route>
            <Route exact path="/createItem" 
              render={(props) => (
                <div style={{margin: '15px'}}>
                  <InventoryEditItemScreen 
                    {...props}  
                    showPopup={this.props.showPopup} 
                    setIsLoading={this.setIsLoading} 
                  />
                </div>
              )} 
            />
            <Route exact path="/createOrder" 
              render={(props) => (
                <div style={{margin: '15px'}}>
                  <AddOrderScreen showPopup={this.props.showPopup} setIsLoading={this.setIsLoading} {...props}/>
                </div>
              )} 
            />
            <Route exact path="/editClient" 
              render={(props) => (
                <div style={{margin: '15px'}}>
                  <EditClientScreen 
                    {...props}  
                    showPopup={this.props.showPopup} 
                    setIsLoading={this.setIsLoading} 
                  />
                </div>
              )} 
            />
          </Switch>
        </div>
      </div>
    </Router>
    );
  }
}

export default App;
