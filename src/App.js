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
import BotConfigurationScreen from './BotConfiguration/BotConfigurationScreen';
import ExampleConversationsScreen from './ExampleConversations/ExampleConversationsScreen';
import QuestionsAndAnswersScreen from './QuestionsAndAnswers/QuestionsAndAnswersScreen';
import CreateQuestionAndAnswerScreen from './QuestionsAndAnswers/CreateQuestionAndAnswerScreen';
import CreateAccountScreen from './Login/CreateAccountScreen';
import { globalEmitter } from './GlobalEventEmitter';
import ChatBotWidget from './TestChatbot/ChatBotWidget';
import ParticleExplosion from './ParticleExplosion';
import { toast, ToastContainer } from 'react-toastify';

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
      globalConfig: undefined,
      setupConditions: undefined,
      trigger: false
    };

    this.intervalId = null
  }
  
  componentDidMount() {
    const token = Cookies.get('token');
    window.token = token

    if(token) {
      //Get the instance status every second until y link whatsapp
      this.intervalId = setInterval(this.GetInstanceStatus, 10000);
      this.fetchGlobalConfig()
      this.fetchSetupConditions()
      this.GetBotNumber()
    }

    globalEmitter.addEventListener('checkMetConditions', this.checkMetConditions);
    globalEmitter.addEventListener('loggedIn', this.handleLoggedIn);
  }

  checkMetConditions = async () => {
    await this.fetchSetupConditions(true)
  }

  handleLoggedIn = async () => {
    console.log("handleLoggedIn")

    this.GetInstanceStatus()
    this.fetchSetupConditions()
    this.GetBotNumber()
    const globalConfig = await this.fetchGlobalConfig()  
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

        return response.data
    } catch (error) {}
  }

  fetchSetupConditions = async (calledFromEvent = false) => {
    try {
        const response = await HttpRequest.get(`/global-config/getSetupConditions`);

        this.setState({
          setupConditions: response.data
        }, () => {
          if(!calledFromEvent) {return;}

          console.log("checkMetConditions this.state.setupConditions", this.state.setupConditions)

          if(this.state.setupConditions.minimumConditionsMet) { this.setState({trigger: true})}
        })
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
      console.log("GetInstanceStatus", response)

      this.setState({
        instanceStatus: response.data,
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

  handleToast = (message, color) => {
    toast.success(message, {
      style: {
          backgroundColor: color ?? ColorHex.GreenDark_1,
          color: '#fff',
          fontWeight: 'bold',
          padding: '10px',
      },
      progressStyle: {
          backgroundColor: '#fff',
      },
      autoClose: 10000,
      icon: false
    });
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
      <div>
        <ToastContainer />
      </div>
      <div className="row">
        {
          Utils.loginExemptPaths.includes(currentPath) ?
          <></>
          :
          <div className="col-auto">
            <SideNav toastCallback={this.handleToast} showPopup_2_Buttons={this.props.showPopup_2_Buttons} setupConditions={this.state.setupConditions} showSetupPopup={this.props.showSetupPopup} globalConfig={this.state.globalConfig} botNumber={this.state.botNumber} setIsReloading={this.setIsReloading} style={{ height: '100vh', width: '236px'}}/>
            <ChatBotWidget toastCallback={this.handleToast} tutorialTrigger={this.state.trigger} setupConditions={this.state.setupConditions} ownerId={this.state?.globalConfig?.ownerId}/>
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
              <div style={{margin: '15px'}}><InventoryScreen setupConditions={this.state.setupConditions} globalConfig={this.state.globalConfig} showPopup={this.props.showPopup} showPopup_2_Buttons={this.props.showPopup_2_Buttons} setIsLoading={this.setIsLoading} /></div>
            </Route>
            <Route exact path="/dayLocation">
              <div style={{margin: '15px'}}><DayLocationForm showPopup={this.props.showPopup} setIsLoading={this.setIsLoading} /></div>
            </Route>
            <Route exact path="/blockChats">
              <div style={{margin: '15px'}}><BlockChatScreen toastCallback={this.handleToast} showPopup={this.props.showPopup} setIsLoading={this.setIsLoading} /></div>
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
            <Route exact path="/" 
              render={(props) => (
                <div style={{margin: '15px'}}>
                  <LoginScreen 
                    {...props}  
                    showPopup={this.props.showPopup} 
                    setIsLoading={this.setIsLoading} 
                    botNumber={this.state.botNumber}
                  />
                </div>
              )} 
            />
            <Route exact path="/createAccount">
              <div style={{margin: '15px'}}><CreateAccountScreen showPopup={this.props.showPopup} setIsLoading={this.setIsLoading} botNumber={this.state.botNumber}/></div>
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
                    setupConditions={this.state.setupConditions}
                    toastCallback={this.handleToast}
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
                  <CreateExampleConversationScreen globalConfig={this.state.globalConfig} setupConditions={this.state.setupConditions} showPopup={this.props.showPopup} setIsLoading={this.setIsLoading} {...props}/>
                </div>
              )} 
            />
            <Route exact path="/exampleConversations" 
              render={(props) => (
                <div style={{margin: '15px'}}>
                  <ExampleConversationsScreen showPopup={this.props.showPopup} showPopup_2_Buttons={this.props.showPopup_2_Buttons} setIsLoading={this.setIsLoading} {...props}/>
                </div>
              )} 
            />
            <Route exact path="/questionsAndAnswers" 
              render={(props) => (
                <div style={{margin: '15px'}}>
                  <QuestionsAndAnswersScreen showPopup={this.props.showPopup} showPopup_2_Buttons={this.props.showPopup_2_Buttons} setIsLoading={this.setIsLoading} {...props}/>
                </div>
              )} 
            />
            <Route exact path="/createQuestionAndAnswer" 
              render={(props) => (
                <div style={{margin: '15px'}}>
                  <CreateQuestionAndAnswerScreen setupConditions={this.state.setupConditions} showPopup={this.props.showPopup} setIsLoading={this.setIsLoading} {...props}/>
                </div>
              )} 
            />
            <Route exact path="/aiConfiguration" 
              render={(props) => (
                <div style={{margin: '15px'}}>
                  <BotConfigurationScreen showPopup={this.props.showPopup} setIsLoading={this.setIsLoading} {...props}/>
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
      <ParticleExplosion toastCallback={this.handleToast} trigger={this.state.trigger}/>
    </Router>
    );
  }
}

export default App;
