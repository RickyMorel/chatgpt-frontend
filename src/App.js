import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainMenu from './MainMenu';
import InventoryScreen from './Inventory/InventoryScreen';
import Navbar from './Navbar';
import SideNav from './SideNav';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: 0,
    };
  }

  render() {
    return (
      <Router>
        <Navbar/>
        <div className="row">
          <div className="col s3">
            <SideNav/>
          </div>
          <div className="col s9">
              <Helmet>
                <style>{`body { background-color: #E9EBE3; }`}</style>
              </Helmet>
              <Switch>
                <Route exact path="/"><MainMenu showPopup={this.props.showPopup}/></Route>
                <Route exact path="/inventory"><InventoryScreen showPopup={this.props.showPopup}/></Route>
              </Switch>        
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
