import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainMenu from './MainMenu';
import InventoryScreen from './Inventory/InventoryScreen';

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
        <div className="App container">
            <Helmet>
              <style>{`body { background-color: #E9EBE3; }`}</style>
            </Helmet>
            <Switch>
              <Route exact path="/"><MainMenu/></Route>
              <Route exact path="/inventory"><InventoryScreen/></Route>
            </Switch>            
        </div>
      </Router>
    );
  }
}

export default App;
