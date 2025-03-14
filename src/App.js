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
import LoginScreen from './Login/LoginScreen';
import Cookies from 'js-cookie';
import ClientOrderPlacingScreen from './ClientOrderPlacing/ClientOrderPlacingScreen';
import Utils from './Utils';
import ClientCartScreen from './ClientOrderPlacing/ClientCartScreen';
import CreateExampleConversationScreen from './ExampleConversations/CreateExampleConversationScreen';
import HttpRequest from './HttpRequest';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: 0,
      isLoading: false,
      loaderMessge: "",
      botNumber: "",
      instanceStatus: "a",
      isReloading: false,
      globalConfig: undefined
    };

    this.intervalId = null
  }
  
  componentDidMount() {
    const token = Cookies.get('token');
    window.token = token
    this.GetInstanceStatus()
    this.fetchGlobalConfig()
    //Get the instance status every second until y link whatsapp
    this.intervalId = setInterval(this.GetInstanceStatus, 2000);

    this.GetBotNumber()
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  componentDidUpdate() {
    if(this.state.instanceStatus == "authenticated") {clearInterval(this.intervalId);}
  }

  fetchGlobalConfig = async () => {
    try {
        const response = await HttpRequest.get(`/global-config`);

        this.setState({globalConfig: response.data})
    } catch (error) {}
  }

  GetBotNumber = async () => {
    try {
      const response = await HttpRequest.get(`/global-config/botNumber`);
      this.setState({
        botNumber: response.data,
      })
    } catch (error) {
    }
  };

  GetInstanceStatus = async () => {
    try {
      const response = await HttpRequest.get(`/whatsapp/getInstanceStatus`);

      this.setState({
        instanceStatus: response.data.accountStatus.status,
      })
    } catch (error) {
    }
  };

  setIsLoading = (loading, specialMessage = "") => {
    this.setState({
      isLoading: loading,
      loaderMessge: specialMessage
    })
  }

  setIsReloading = (isReloading) => {
    this.setState({
      isReloading: isReloading,
    })
  }

  render() {
    const currentPath = window.location.pathname;

    return (
    this.state.isReloading ? 
    <img src='./images/splash.png' className="img-fluid" style={{ width: '100%', height: "100%" }} />
    :
    <Router>
      {
        this.state.instanceStatus != "authenticated" && 
        this.state.instanceStatus != "a" &&
        !Utils.loginExemptPaths.includes(currentPath) ?
        <QrCodeScreen status={this.state.instanceStatus}/> 
        : 
        <></>
      }
      <LoadSpinner isLoading={this.state.isLoading} loaderMessge={this.state.loaderMessge} />
      <div className="row">
        {
          Utils.loginExemptPaths.includes(currentPath) ?
          <></>
          :
          <div className="col-auto">
            <SideNav globalConfig={this.state.globalConfig} botNumber={this.state.botNumber} setIsReloading={this.setIsReloading} style={{ height: '100vh', width: '236px'}}/>
          </div>
        }
        <div className="col">
          <Helmet>
            <style>{`body { background-color: ${ColorHex.Background}; }`}</style>
          </Helmet>
          <Switch>
            <Route exact path="/loadData">
              <div style={{margin: '15px'}}><MainMenu showPopup={this.props.showPopup} setIsLoading={this.setIsLoading} /></div>
            </Route>
            <Route exact path="/inventory">
              <div style={{margin: '15px'}}><InventoryScreen globalConfig={this.state.globalConfig} showPopup={this.props.showPopup} showPopup_2_Buttons={this.props.showPopup_2_Buttons} setIsLoading={this.setIsLoading} /></div>
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
            <Route exact path="/">
              <div style={{margin: '15px'}}><LoginScreen showPopup={this.props.showPopup} setIsLoading={this.setIsLoading} botNumber={this.state.botNumber}/></div>
            </Route>
            <Route exact path="/clientOrderPlacing">
              <div style={{margin: '15px'}}><ClientOrderPlacingScreen showPopup={this.props.showPopup} setIsLoading={this.setIsLoading} botNumber={this.state.botNumber}/></div>
            </Route>
            <Route exact path="/clientCart" 
              render={(props) => (
                <div style={{margin: '15px'}}>
                  <ClientCartScreen 
                    {...props}  
                    showPopup={this.props.showPopup} 
                    setIsLoading={this.setIsLoading} 
                    botNumber={this.state.botNumber}
                  />
                </div>
              )} 
            />
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
            <Route exact path="/createExampleConversation" 
              render={(props) => (
                <div style={{margin: '15px'}}>
                  <CreateExampleConversationScreen showPopup={this.props.showPopup} setIsLoading={this.setIsLoading} {...props}/>
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
