import { faArrowLeft, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import React, { Component } from 'react'
import CustomButton from '../Searchbar/CustomButton'
import Utils from '../Utils'
import ClientCartItem from './ClientCartItem'
import axios from 'axios';
import { withRouter } from "react-router-dom";
import CustomInput from '../Searchbar/CustomInput'
import CssProperties from '../CssProperties'
import { ColorHex } from '../Colors'

class ClientCartScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemsInCart: [],
      isInitialWindow: false,
      hasRuc: false,
      ruc: ''
    };

    this.recommededItemCodes=[]
    this.inventoryItems=[]
  }

  componentDidMount() {
    const queryString = this.props.location.search;
    const paramValue = queryString ? queryString.slice(1) : null;

    if(paramValue) {
      Promise.all([
        this.fetchRecommendedItems(paramValue),
        this.fetchTommorrowsInventory()
      ])
      .then(() => {
        this.setState({isInitialWindow: true})

        if(this.recommededItemCodes.length < 1) { this.props.history.push('/clientOrderPlacing'); return;}

        const itemData = this.inventoryItems.filter(x => this.recommededItemCodes.includes(x.code))
        console.log("itemData", itemData)
        this.loadCart(itemData, Utils.needsRuc)
      })
    } else {
      this.setState({isInitialWindow: false})
      const itemData = this.props.location && this.props.location.state ? this.props.location.state.linkData.cartItems : undefined
      const hasRuc = Utils.needsRuc
      console.log("hasRuc client cart", hasRuc)
      this.loadCart(itemData, hasRuc)
    }
  }

  fetchRecommendedItems = async (phoneNumber) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/client-crud/getClientReccomendedProducts?phoneNumber=${phoneNumber}`);
      console.log("fetchRecommendedItems", response.data, phoneNumber)
      this.recommededItemCodes = response.data
    } catch (error) {

    }
  };

  fetchTommorrowsInventory = async () => {
    if(Utils.clientOrderPlacingInventory.length > 0) { return; }

    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/inventory/getTommorowsInventoryWithPictures`);
      this.inventoryItems = response.data
      Utils.clientOrderPlacingInventory = [...response.data]
    } catch (error) {

    }
  };

  loadCart(itemData, hasRuc) {
    let itemsWithAmounts = []

    for (const item of itemData) {
      if (item.amount) { itemsWithAmounts.push(item); continue} 

      let itemWithAmount = { ...item }
      itemWithAmount.amount = 1
      itemsWithAmounts.push(itemWithAmount)
    }

    this.setState({
      itemsInCart: itemsWithAmounts,
      hasRuc: hasRuc,
      ruc: Utils.ruc
    })

    Utils.clientCartData = itemsWithAmounts
  }

  handleChangeRuc(value) {
    Utils.ruc = value

    this.setState({
      ruc: value
    })
  }

  handleEditItemAmount = (item, isAdd) => {
    let cart = [...this.state.itemsInCart]
    let newAmount = item.amount

    if(isAdd) { newAmount++ }
    else {newAmount--}

    if(newAmount < 0) {newAmount = 0}

    let newItem = {...item}
    newItem.amount = newAmount
    
    cart = cart.filter(x => x.code != item.code)
    if(newAmount > 0) {cart.push(newItem)}

    this.setState({
      itemsInCart: cart
    })

    Utils.clientCartData = cart
  }

  calculateTotal = () => {
    let total = 0

    this.state.itemsInCart.forEach(item => {
      total += (item.amount * item.price)
    });

    return total
  }

  openWhatsappWithOrderMessage = () => {
    let itemsString = ""
    this.state.itemsInCart.forEach(item => {
      itemsString += `\n-${item.amount} ${item.name}`
    });
    const message = `RUC: 5710644-4\nVoy a querer:${itemsString}\nMuchas gracias!`

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${this.props.botNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
  }

  askForOtherItems = () => {
    Utils.clientCartData = []
    console.log("this.props.history", this.props.history)
    this.props.history.push('/clientOrderPlacing')
  }

  render() {
    const orderedFilteredProducts = this.state?.itemsInCart?.sort((a, b) => Utils.sortByName(a, b, "name"))
    const allItems = orderedFilteredProducts?.map(x => (
      <ClientCartItem item={x} itemsInCart={this.state.itemsInCart} editAmountCallback={this.handleEditItemAmount}/>
    ))

    return (
      <div>
        <div style={{...inventoryPanelStyling, justifyItems: 'center'}}>
        <div style={{display: 'flex', justifySelf: 'left'}}><CustomButton width='25px' icon={faArrowLeft} iconSize="20px" height="30px" link="clientOrderPlacing"/></div>
          {
            this.state.hasRuc == true ? 
            <>
              <p style={headersStyle}>Ingrese su RUC:</p>
              <CustomInput
                  maxLength={9}
                  placeHolderText="ej: '5720624-7' o 'No tengo'"
                  value={this.state.ruc}
                  onChange={(itemValue) => this.handleChangeRuc(itemValue) }
                  width="99%"
                  height='65px'
                />
              <p style={headersStyle}>Pedido:</p>
            </>
            : 
            <></>
          }
          <div style={scrollStyle}>
            {allItems}
            {
              this.state.itemsInCart.length > 0 ?
              <><br /><br /><br /></>
              :
              <></>
            }
          </div>
          {
            this.state.itemsInCart.length > 0 ?
            <div style={{bottom: 10, left: 0, right: 0, zIndex: 999, display: 'flex', position: 'absolute', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
              {
                this.state.isInitialWindow ? 
                <>
                  <div style={{marginBottom: '15px'}}><CustomButton icon={faTrash} text={`Pedir otros items`} width='200px' height="60px" onClickCallback={this.askForOtherItems}/></div>
                </>
                :
                <></>
              }
              <div style={{marginBottom: '15px'}}><CustomButton text={`Agregar items`} icon={faPlus} width='200px' height="60px" onClickCallback={() => this.props.history.push("/clientOrderPlacing")}/></div>
              <CustomButton text={`Confirmar Pedido (${Utils.formatPrice(this.calculateTotal())})`} width='250px' classStyle="btnGreen-clicked" height="60px" onClickCallback={this.openWhatsappWithOrderMessage}/>
            </div>
            :
            <></>
          }
        </div>
      </div>
    )
  }
}

const headersStyle = {
  ...CssProperties.SmallHeaderTextStyle,
  color: ColorHex.TextBody, 
  marginTop: '10px',
  marginBottom: '0px'
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

export default ClientCartScreen