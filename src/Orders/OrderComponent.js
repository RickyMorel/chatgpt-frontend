import React from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min.js';
import { Color, ColorHex } from '../Colors';
import axios from 'axios';

class OrderComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: false,
      isEditing: false,
      order: []
    };
}

  componentDidMount() {
    M.AutoInit(); 

    this.setState({
      checked: this.props.checkedBySalesPerson,
      order: this.props.order
    })
  }

  formatPrice = (numberString) => {
      const number = parseFloat(numberString);
    
      if (isNaN(number)) {
        return 'Invalid number';
      }
    
      const formattedNumber = new Intl.NumberFormat('es-PY', {
        style: 'currency',
        currency: 'PYG',
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }).format(number);
    
      return `${formattedNumber}`;
  };

  handleHeaderClick = async () => {
    console.log("handleHeaderClick")
    try {
      const response = await axios.put(`${process.env.REACT_APP_HOST_URL}/order/updateCheckedBySalesPerson`, {number: this.props.phoneNumber});
      this.setState({
        checked: true
      });
    } catch (error) {
      return error
    }
  }

  handleEditOrderItem = (e, orderItemCode, orderItemAskedProductName) => {
    console.log("this.state.order", this.state.order)
    let editedOrder = [...this.state.order]
    let wantedItem = editedOrder.find(x => x.code == orderItemCode && x.askedProductName == orderItemAskedProductName)
    editedOrder = editedOrder.filter(x => x != wantedItem)

    wantedItem[e.target.name] = e.target.value

    //editedOrder = editedOrder.filter(x => x.code != orderItemCode && x.askedProductName != orderItemAskedProductName)
    editedOrder.push(wantedItem)

    console.log("handleEditOrderItem",orderItemCode, orderItemAskedProductName, editedOrder)

    this.setState({
      order: editedOrder
    })
  }

  handleEditMode = () => {
    const isEditing = !this.state.isEditing
    this.setState({
      isEditing: isEditing
    })

    if(isEditing == false) {this.handleSave()}
  }

  handleSave = async () => {
    try {
        let orderItems = []
        for(const orderItem of this.state.order) {
          if(orderItem.botState == "UNSURE") { continue; }

          let newOrderItem = orderItem
          
          if(orderItem.botState == "CANCELED") { newOrderItem.botState = "CANCELED" }
          else {newOrderItem.botState = "CONFIRMED"}
          
          orderItems.push(newOrderItem)
        }

        const response = await axios.put(`${process.env.REACT_APP_HOST_URL}/order/editOrder`, {phoneNumber: this.props.phoneNumber, order: orderItems});
        this.props.updateTotalSalesCallback()
        return null
      } catch (error) {
        console.log("handleSave showPopup", error)
        this.props.showPopup(error);
      }
  }

  render() {
    const { orderNumber ,name, phoneNumber, order, inventoryItemNames } = this.props;

    const onlyVendorConfirmed = "CONFIRMADO SOLO POR VENDEDOR"
    const noLongerWantedItem = "CLIENTE NO QUIERE"
    const confirmedState = "CONFIRMED"
    const canceldState = "CANCELED"
    const NOT_IN_INVENTORY = "NOT_IN_INVENTORY"
    const SURE = "SURE"

    let orderItemCount = 0

    let unsureItemHtml = <p className='green-text'>Pedido confirmado</p>

    let orderItems = [...order]
    orderItems = orderItems.filter(x => x.botState != "UNSURE")

    for(const item of orderItems) {
      if(item.name.includes("_BAD_FORMAT") == true) { unsureItemHtml = <p className='red-text'>Confirmado con formato incorrecto</p> }
      else if(item.botState == SURE) {unsureItemHtml = <p className='orange-text'>Algunos items no estan confirmados por el vendedor</p>}
      else if(item.botState == "UNSURE") {unsureItemHtml = <p className='orange-text'>Inseguro de pedido</p>}
      else if(item.botState == NOT_IN_INVENTORY) {unsureItemHtml = <p className='red-text'>No encontro producto pedido</p>; break;}
    }

    if(orderItems.every(x => x.botState == canceldState)) {unsureItemHtml = <p className='red-text'>Pedido cancelado</p>}

    const orderList = orderItems?.map(x => {
      orderItemCount = orderItemCount + 1
      const i = orderItemCount
      let botStateHtml = <p className='green-text'>Confirmado</p>
      if(x.name.includes("_BAD_FORMAT") == true) { botStateHtml = <p className='red-text'>Confirmado con formato incorrecto</p> }
      else if(x.botState == canceldState) { botStateHtml = <p className='red-text'>Cancelado</p> }
      else if(x.botState == SURE) {botStateHtml = <p className='orange-text'>No confirmado por vendedor</p>}
      else if(x.botState == "UNSURE") {botStateHtml = <p className='orange-text'>Inseguro</p>}
      else if(x.botState == NOT_IN_INVENTORY) {botStateHtml = <p className='red-text'>No encontro en inventario</p>;}

      const askedProductNameColor = x.askedProductName.includes(onlyVendorConfirmed) || x.askedProductName.includes(noLongerWantedItem) ? "red" : "black"
      const displayedName = x.name.replace("_BAD_FORMAT", "")

      const orderItem = this.state.order.find(y => y.code == x.code && y.askedProductName == x.askedProductName)
      console.log("orderItem", this.state?.order, x.code, x.askedProductName, orderItem)

      return(
        <div className='row'>
          <div className='col s3'>
            <span style={{ width: '100%'  }}>{i}</span>
          </div>
          <div className='col s3'>
            <span style={{ width: '100%', color: askedProductNameColor}}>{x.askedProductName}</span>
          </div>
          <div className='col s3'>
          {
              this.state.isEditing == true && (orderItem.botState == NOT_IN_INVENTORY || orderItem.botState == SURE) ?
              <select style={{display: 'block' }} name='name' value={orderItem.name} onChange={(e) => this.handleEditOrderItem(e, x.code, x.askedProductName)}>
                {
                  inventoryItemNames.map(x => <option value={x}>{x}</option>)
                }
              </select>
              :
              <span style={{ width: '100%'  }}>{displayedName}</span>
            }
          </div>       
          <div className='col s1'>
            {
              this.state.isEditing == true ?
              <input style={{display: 'block' }} name='amount' value={orderItem.amount} onChange={(e) => this.handleEditOrderItem(e, x.code, x.askedProductName)}/>
              :
              <span style={{ width: '100%'  }}>{x.amount}</span>
            }
          </div>
          <div className='col s2'>
            {
              this.state.isEditing == true ?
              <select style={{display: 'block' }} name='botState' value={orderItem.botState} onChange={(e) => this.handleEditOrderItem(e, x.code, x.askedProductName)}>
                <option value={confirmedState}>Confirmado</option>
                <option value={canceldState}>Cancelado</option>
              </select>
              :
              <span style={{ width: '100%'  }}>{botStateHtml}</span>
            }
          </div>
        </div>
      )
    });

    const alertIconColor = (this.state.checked == false && orderItems.find(x => x.askedProductName == onlyVendorConfirmed || x.askedProductName == noLongerWantedItem)) ? "#bd3020" : "#ffffff"

    return (
        <li className="collection-item">
          <div class="collapsible-header" onClick={this.handleHeaderClick}>
            <span class="client-name" style={{ width: '40%'  }}>{orderNumber}</span>
            <span class="client-name" style={{ width: '60%'  }}>{name}</span>
            <span class="client-name" style={{ width: '60%'  }}>
              <a href={"https://wa.me/" + phoneNumber} target="_blank" rel="noopener noreferrer" className="underlined-link">{phoneNumber}</a>
            </span>
            <span class="client-name" style={{ width: '60%'  }}>{orderItems.length}</span>
            <span class="client-name" style={{ width: '100%'  }}>{unsureItemHtml}</span>
            <a href=""><i style={{ color: alertIconColor }} className={`material-icons flicker`}>brightness_1</i></a>
            <button onClick={this.handleEditMode} style={{"background-color": "transparent", "border": "none"}}>
              <i className={`${this.state.isEditing ? "orange-text" : "grey-text"} material-icons`}>{this.state.isEditing ? "save" : "edit"}</i>
            </button>
            <a><i className='material-icons' style={{ width: '100%'  }}>keyboard_arrow_downs</i></a>
          </div>
          <div class="collapsible-body">
            {orderList} 
          </div>
        </li>
    );
  }
}

export default OrderComponent;