import React, { Component } from 'react'
import SearchBar from '../Searchbar/Searchbar'
import OrderPlacingItem from './OrderPlacingItem'
import { ColorHex } from '../Colors'
import CustomButton from '../Searchbar/CustomButton'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import Utils from '../Utils'

class ClientOrderPlacingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inventoryItems: null,
      filteredInventory: null,
      itemsInCart: []
    };
  }

  componentDidMount() {
    this.fetchTommorrowsInventory()

    console.log(" this.props.location.state?.data",  this.props)
  }

  fetchTommorrowsInventory = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/inventory/getTommorowsInventoryWithPictures`);
      this.setState({
        inventoryItems: response.data,
        filteredInventory: response.data
      });
    } catch (error) {

    }
  };

  handleSearch = (searchText) => {
    const filteredItems = this.state.inventoryItems.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    this.setState({
      filteredInventory: filteredItems
    })
  }

  handleAddItem = (item, isAdd) => {
    let cart = [...this.state.itemsInCart]
    if(isAdd) {
      cart.push(item)
    }
    else {
      cart = cart.filter(x => x.code != item.code)
    }

    this.setState({
      itemsInCart: cart
    })
  }

  render() {
    const orderedFilteredProducts = this.state?.filteredInventory?.sort((a, b) => Utils.sortByName(a, b, "name"))
    const allItems = orderedFilteredProducts?.map(x => (
      <OrderPlacingItem item={x} itemsInCart={this.state.itemsInCart} OnAddCallback={this.handleAddItem}/>
    ))

    return (
      <div>
        <div style={{...inventoryPanelStyling, justifyItems: 'center'}}>
          <SearchBar width='100%' height='45px' itemList={this.state.inventoryItems} searchText="Buscar Productos..." OnSearchCallback={(value) => this.handleSearch(value, false)}/>
          <div style={scrollStyle}>
            {allItems}
            {
              this.state.itemsInCart.length > 0 ?
              <><br /><br /><br /><br /><br /><br /><br /><br /></>
              :
              <></>
            }
          </div>
          {
            this.state.itemsInCart.length > 0 ?
            <div style={{bottom: 10, left: 0, right: 0, zIndex: 999, display: 'flex', position: 'absolute', justifyContent: 'center'}}><CustomButton text={`Ir a Carrito (${this.state.itemsInCart.length})`} iconSize="25px" width='250px' classStyle="btnGreen-clicked row" height="60px" icon={faCartShopping} link="clientCart" linkData={this.state.itemsInCart}/></div>
            :
            <></>
          }
        </div>
      </div>
    )
  }
}

const scrollStyle = {
  overflowY: 'scroll', 
  height: '100%',
  width: '100%',
  alignItems: 'center',
  overflowX: 'hidden',
  marginTop: '10px'
}

const inventoryPanelStyling = {
  width: '100%',
  height: '95vh',
  marginTop: '25px',
}

export default ClientOrderPlacingScreen