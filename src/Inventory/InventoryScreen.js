
import React, { Component } from 'react';
import ProductComponent from '../Products/ProductComponent';

class InventoryScreen extends Component {
handleSearchInputChange = (event) => {
    const searchInput = event.target.value;
    this.setState({ searchInput }, () => {
        this.filterProducts();
    });
    };
    
  render() {
    return (
      <div>
        <h1>OLLLLLL</h1>
         <div style={{ overflowY: 'scroll', height: '300px' }}>
            <ProductComponent name="LOL" price={199}/>
         </div>
      </div>
    );
  }
}

export default InventoryScreen;
