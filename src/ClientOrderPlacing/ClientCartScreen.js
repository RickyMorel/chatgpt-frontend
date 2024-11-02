import React, { Component } from 'react'
import { ColorHex } from '../Colors'
import CustomButton from '../Searchbar/CustomButton'
import Utils from '../Utils'
import ClientCartItem from './ClientCartItem'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'

class ClientCartScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemsInCart: []
    };
  }

  componentDidMount() {
    const itemData = this.props.location && this.props.location.state ? this.props.location.state.linkData : undefined;
    let itemsWithAmounts = []

    itemData?.forEach(item => {
      let itemWithAmount = {...item}
      itemWithAmount.amount = 1
      itemsWithAmounts.push(itemWithAmount)
    });

    this.setState({
      itemsInCart: itemsWithAmounts,
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
    cart.push(newItem)

    this.setState({
      itemsInCart: cart
    })
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
    const message = `Voy a querer:${itemsString}\nMuchas gracias!`

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${this.props.botNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
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
          <div style={scrollPanelStyle}>
              <div style={scrollStyle}>
                {allItems}
                {
                  this.state.itemsInCart.length > 0 ?
                  <><br /><br /><br /></>
                  :
                  <></>
                }
              </div>
          </div>
          {
            this.state.itemsInCart.length > 0 ?
            <div className='absoulte' style={{marginTop: '-70px'}}><CustomButton text={`Confirmar Pedido (${Utils.formatPrice(this.calculateTotal())})`} width='250px' classStyle="btnGreen-clicked" height="60px" onClickCallback={this.openWhatsappWithOrderMessage}/></div>
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
  overflowX: 'hidden'
}

const scrollPanelStyle = {
  borderRadius: '10px',
  backgroundColor: ColorHex.Background,
  padding: '10px',
  marginTop: '20px',
  boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.3)',
  height: '90%',
  width: '100%',
  alignItems: 'center',
  paddingTop: '10px'
}

const inventoryPanelStyling = {
  width: '100%',
  height: '95vh',
  marginTop: '10px',
  marginTop: '25px',
  padding: '25px',
  boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
  border: `1px solid ${ColorHex.BorderColor}`,
  borderRadius: '10px',
  backgroundColor: ColorHex.White,
}

export default ClientCartScreen