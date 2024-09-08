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
import 'bootstrap/dist/css/bootstrap.min.css';
import AddOrderScreen from './Orders/AddOrderScreen';
import InventoryEditItemScreen from './Inventory/InventoryEditItemScreen';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: 0,
      isLoading: false,
      loaderMessge: "",
      botNumber: ""
    };
  }
  
  componentDidMount() {
    this.GetBotNumber()
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

  setIsLoading = (loading, specialMessage = "") => {
    this.setState({
      isLoading: loading,
      loaderMessge: specialMessage
    })
  }

  render() {
    return (
    <Router>
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
              <div style={{margin: '15px'}}><InventoryScreen showPopup={this.props.showPopup} setIsLoading={this.setIsLoading} /></div>
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
            <Route exact path="/problematicChats">
              <div style={{margin: '15px'}}><ProblematicChatsScreen showPopup={this.props.showPopup} setIsLoading={this.setIsLoading} botNumber={this.state.botNumber}/></div>
            </Route>
            <Route exact path="/createOrder">
              <div style={{margin: '15px'}}><AddOrderScreen showPopup={this.props.showPopup} setIsLoading={this.setIsLoading} /></div>
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
            {/* <Route exact path="/createItem">
              <div style={{margin: '15px'}}><InventoryEditItemScreen showPopup={this.props.showPopup} setIsLoading={this.setIsLoading} /></div>
            </Route> */}
          </Switch>
        </div>
      </div>
    </Router>
    );
  }
}

export default App;
