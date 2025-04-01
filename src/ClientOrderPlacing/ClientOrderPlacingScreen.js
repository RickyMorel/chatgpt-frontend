import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import React, { Component } from 'react'
import CustomButton from '../Searchbar/CustomButton'
import SearchBar from '../Searchbar/Searchbar'
import Utils from '../Utils'
import OrderPlacingItem from './OrderPlacingItem'
import axios from 'axios';
import HttpRequest from '../HttpRequest'

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
    this.setState({
      inventoryItems: [...Utils.clientOrderPlacingInventory],
      filteredInventory: [...Utils.clientOrderPlacingInventory]
    });

    this.checkIfNeedsRuc();

    if(Utils.clientOrderPlacingInventory.length < 1) {this.fetchTommorrowsInventory()}

    console.log("clientOrderPlacingScreen ivnetory", Utils.clientOrderPlacingInventory)
    
    if(Utils.clientCartData.length == 0) {return;}
    
    this.setState({
      itemsInCart: [...Utils.clientCartData]
    })
  }

  checkIfNeedsRuc() {
    if(Utils.needsRuc == true) { return; }
    
    const searchParams = new URLSearchParams(window.location.search);
    const hasRuc = searchParams.has('ruc');

    Utils.needsRuc = hasRuc
  }

  getClientCartNumber() {
    if(Utils.clientCartBotNumber.length > 0) { return; }

    const queryString = window?.location?.search;
    const paramValue = queryString ? queryString.slice(1) : null;

    Utils.clientCartBotNumber = paramValue

    console.log("paramValue", paramValue)
  }

  fetchTommorrowsInventory = async () => {
    console.log("fetchTommorrowsInventory")
    if(Utils.clientOrderPlacingInventory.length > 0) { return; }

    this.getClientCartNumber()

    try {
      const response = await HttpRequest.get(`/inventory/getTommorowsInventoryWithPictures?botNumber=${Utils.clientCartBotNumber}`, false);
      this.inventoryItems = response.data
      Utils.clientOrderPlacingInventory = [...response.data]
      this.setState({
        inventoryItems: [...response.data],
        filteredInventory: [...response.data],
      })
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
            <div style={{bottom: 10, left: 0, right: 0, zIndex: 999, display: 'flex', position: 'absolute', justifyContent: 'center'}}><CustomButton text={`Ir a Carrito (${this.state.itemsInCart.length})`} iconSize="25px" width='250px' classStyle="btnGreen-clicked row" height="60px" icon={faCartShopping} link="clientCart" linkData={{cartItems: this.state.itemsInCart}}/></div>
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