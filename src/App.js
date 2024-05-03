import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainMenu from './MainMenu';
import InventoryScreen from './Inventory/InventoryScreen';
import Navbar from './Navbar';
import SideNav from './SideNav';
import BlockChatScreen from './BotBlocker/BlockChatScreen';
import OrderScreen from './Orders/OrderScreen';
import { Color, ColorHex } from './Colors';
import DayLocationForm from './DayLocation/DayLocationForm';
import ProblematicChatsScreen from './ProblematicChats/ProblematicChatsScreen';
import LoadSpinner from './LoadSpinner';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: 0,
      isLoading: false,
      botNumber: ""
    };
  }
  
  componentDidMount() {
    this.GetBotNumber()
  }

  GetBotNumber = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/global-config/botNumber`);
      console.log("response", response.data)
      this.setState({
        botNumber: response.data,
      })
    } catch (error) {
      this.props.showPopup(new Error(error.response.data.message))
    }
  };

  setIsLoading = (loading) => {
    this.setState({
      isLoading: loading
    })
  }

  render() {
    return (
      <Router>
        <LoadSpinner isLoading={this.state.isLoading}/>
        <Navbar/>
        <div class="row">
          <div class={`col s12 m4 l3 ${Color.SideNav}`} style={{  height: '93vh'}}>
            <SideNav/>
          </div>
          <div class="col s12 m8 l9"> 
              <Helmet>
                <style>{`body { background-color: ${ColorHex.Background}; }`}</style>
              </Helmet>
              <Switch>
                <Route exact path="/"><MainMenu showPopup={this.props.showPopup} setIsLoading={this.setIsLoading}/></Route>
                <Route exact path="/inventory"><InventoryScreen showPopup={this.props.showPopup} setIsLoading={this.setIsLoading}/></Route>
                <Route exact path="/dayLocation"><DayLocationForm showPopup={this.props.showPopup} setIsLoading={this.setIsLoading}/></Route>
                <Route exact path="/blockChats"><BlockChatScreen showPopup={this.props.showPopup} setIsLoading={this.setIsLoading}/></Route>
                <Route exact path="/orders"><OrderScreen showPopup={this.props.showPopup} setIsLoading={this.setIsLoading}/></Route>
                <Route exact path="/problematicChats">
                  <ProblematicChatsScreen showPopup={this.props.showPopup} setIsLoading={this.setIsLoading} botNumber={this.state.botNumber}/>
                </Route>
              </Switch>        
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
