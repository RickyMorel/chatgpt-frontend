import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainMenu from './MainMenu';
import InventoryScreen from './Inventory/InventoryScreen';
import Navbar from './Navbar';
import SideNav from './SideNav';
import BlockChatScreen from './BotBlocker/BlockChatScreen';
import OrderScreen from './Orders/OrderScreen';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: 0,
    };
  }

  render() {
    const style = {
      "padding-top": "200px"
    }
    return (
      <Router>
        <Navbar/>
        <div className="row">
          <div className="col s3">
            <div style={style}>
              {/* <ul>
                <li>aaaaaaaa</li>
                <li>aaaaaaaa</li>
                <li>aaaaaaaa</li>
                <li>aaaaaaaa</li>
                <li>aaaaaaaa</li>
                <li>aaaaaaaa</li>
                <li>aaaaaaaa</li>
              </ul> */}
              <SideNav/>
            </div>
          </div>
          <div className="col s9">
              <Helmet>
                <style>{`body { background-color: #E9EBE3; }`}</style>
              </Helmet>
              <Switch>
                <Route exact path="/"><MainMenu showPopup={this.props.showPopup}/></Route>
                <Route exact path="/inventory"><InventoryScreen showPopup={this.props.showPopup}/></Route>
                <Route exact path="/dayLocation"><InventoryScreen showPopup={this.props.showPopup}/></Route>
                <Route exact path="/blockChats"><BlockChatScreen showPopup={this.props.showPopup}/></Route>
                <Route exact path="/orders"><OrderScreen showPopup={this.props.showPopup}/></Route>
              </Switch>        
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
