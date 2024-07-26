import React from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min.js';
import { Color, ColorHex } from '../Colors';
import axios from 'axios';
const badFormatString = "_BAD_FORMAT"

class OrderComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: false,
      order: [],
      confirmedOrder: [],
      selectedMovil: ""
    };
}

  componentDidMount() {
    const selectedMovil = this?.props?.movilObjs?.find(x => x.van == this.props.movil) ?? ""

    this.setState({
      checked: this.props.checkedBySalesPerson,
      order: [...this.props.order],
      confirmedOrder: [...this.props.order],
      selectedMovil: selectedMovil,
      pointsUsed: this.props.pointsUsed
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

  handleEditMovil = (e) => {
    const wantedMovil = this.props.movilObjs.find(x => x.van == e.target.value)

    this.setState({
      selectedMovil: wantedMovil
    })
  }

  handleEditPoints = (e) => {
    this.setState({
      pointsUsed: e.target.value
    })
  }

  handleEditOrderItem = (e, orderItemCode, orderItemAskedProductName) => {
    let editedOrder = [...this.state.order]
    let wantedItem = {...editedOrder.find(x => x.code == orderItemCode && x.askedProductName == orderItemAskedProductName)}
    editedOrder = editedOrder.filter(x => x.code != wantedItem.code)

    wantedItem[e.target.name] = e.target.value

    if(e.target.name == "name") 
    {
      wantedItem.code = e.target.value
      wantedItem.name = this.props.inventoryItemNamesWithCodes.find(x => x.code == e.target.value).name
    }

    editedOrder.push(wantedItem)

    this.setState({
      order: editedOrder
    })
  }

  handleAddProduct = () => {
    let editedOrder = [...this.state.order]
    console.log("editedOrder", editedOrder)
    const itemNameWithCode = this.props.inventoryItemNamesWithCodes.find(x => editedOrder.find(y => y.code == x.code) == undefined)
    let newItem = {name: itemNameWithCode.name, code: itemNameWithCode.code, amount: 1, botState: "CONFIRMED", askedProductName: "Agregado", price: 0}

    editedOrder.push(newItem)

    this.setState({
      order: editedOrder
    })
  }

  handleSave = async () => {
    console.log("handleSave", this?.state?.order)
    if(this?.state?.selectedMovil?.van == undefined) {this.props.showPopup(new Error(`Seleccione un movil de entrega para el pedido`)); return;}
    if(this?.state?.order.find(x => x.botState == "CONFIRMED") == undefined && this?.state?.order.find(x => x.botState == "SURE")) {this.props.showPopup(new Error(`Hay algunos items que no se confirmaron`)); return;}

    try {
        let orderItems = []
        for(const orderItem of this.state.order) {
          if(orderItem.botState == "UNSURE") { continue; }
          if(orderItem.botState == "SURE") { continue; }

          let newOrderItem = {...orderItem}
          let newName = newOrderItem.name.replaceAll('_BAD_FORMAT', '')
          newOrderItem.name = newName
          
          if(orderItem.botState == "CANCELED") { newOrderItem.botState = "CANCELED" }
          else {newOrderItem.botState = "CONFIRMED"}
          
          orderItems.push(newOrderItem)
        }

        this.setState({
          order: orderItems,
          confirmedOrder: orderItems
        })

        const response = await axios.put(`${process.env.REACT_APP_HOST_URL}/order/editOrder`, 
          {
            phoneNumber: this.props.phoneNumber,
            order: orderItems, 
            movil: this?.state?.selectedMovil?.van, 
            pointsUsed: this.state.pointsUsed
          }
        );
        this.props.updateTotalSalesCallback()
        return null
      } catch (error) {
        console.log("error", error)
        this.props.showPopup(error);
      }
  }

  render() {
    const { orderNumber , name, pointsUsed, phoneNumber, order, movil,inventoryItemNamesWithCodes, isEditing, currentOpenOrder } = this.props;

    const onlyVendorConfirmed = "CONFIRMADO SOLO POR VENDEDOR"
    const noLongerWantedItem = "CLIENTE NO QUIERE"
    const confirmedState = "CONFIRMED"
    const canceldState = "CANCELED"
    const NOT_IN_INVENTORY = "NOT_IN_INVENTORY"
    const SURE = "SURE"
    const SIN_MOVIL = "Sin movil"

    let orderItemCount = 0

    let unsureItemHtml = <p className='green-text'>Pedido confirmado</p>

    let orderItems = [...this?.state?.order]
    let hasConfirmedItems = this?.state?.confirmedOrder?.find(x => x.botState == confirmedState)
    orderItems = orderItems.filter(x => x.botState != "UNSURE")
    //If agent confirmed order, don't show not sure items
    if(hasConfirmedItems) { orderItems = orderItems.filter(x => x.botState != SURE)}

    for(const item of orderItems) {
      if(item.name.includes(badFormatString) == true) { unsureItemHtml = <p className='red-text'>Confirmado con formato incorrecto</p> }
      else if(item.botState == SURE && !hasConfirmedItems) {unsureItemHtml = <p className='orange-text'>Items no estan confirmados por el vendedor</p>}
      else if(item.botState == "UNSURE") {unsureItemHtml = <p className='orange-text'>Inseguro de pedido</p>}
      else if(item.botState == NOT_IN_INVENTORY) {unsureItemHtml = <p className='red-text'>No encontro producto pedido</p>; break;}
    }

    if(orderItems.every(x => x.botState == canceldState)) {unsureItemHtml = <p className='red-text'>Pedido cancelado</p>}

    let orderItemsOrdered = orderItems.sort((a, b) => a.name.localeCompare(b.name));

    const orderList = orderItemsOrdered?.map(x => {
      orderItemCount = orderItemCount + 1
      const i = orderItemCount
      let botStateHtml = <p className='green-text'>Confirmado</p>
      if(x.name.includes(badFormatString) == true) { botStateHtml = <p className='red-text'>Confirmado con formato incorrecto</p> }
      else if(x.botState == canceldState) { botStateHtml = <p className='red-text'>Cancelado</p> }
      else if(x.botState == SURE) {botStateHtml = <p className='orange-text'>No confirmado por vendedor</p>}
      else if(x.botState == "UNSURE") {botStateHtml = <p className='orange-text'>Inseguro</p>}
      else if(x.botState == NOT_IN_INVENTORY) {botStateHtml = <p className='red-text'>No encontro en inventario</p>;}

      const askedProductNameColor = x.askedProductName.includes(onlyVendorConfirmed) || x.askedProductName.includes(noLongerWantedItem) ? "red" : "black"
      const displayedName = x.name.replace(badFormatString, "")

      const orderItem = this.state.order.find(y => y.code == x.code && y.askedProductName == x.askedProductName)

      return(
        <div className='row'>
          <div className='col s2'>
            <span style={{ width: '100%'  }}>{i}</span>
          </div>
          <div className='col s3'>
            <span style={{ width: '100%', color: askedProductNameColor}}>{x.askedProductName}</span>
          </div>
          <div className='col s3'>
          {
              isEditing == true ?
              <select style={{display: 'block' }} name='name' value={orderItem.code} onChange={(e) => this.handleEditOrderItem(e, x.code, x.askedProductName)}>
                {
                  inventoryItemNamesWithCodes.map(x => <option value={x.code}>{x.name}</option>)
                }
              </select>
              :
              <span style={{ width: '100%'  }}>{displayedName}</span>
            }
          </div>       
          <div className='col s1'>
            {
              isEditing == true ?
              <input style={{display: 'block' }} name='amount' value={orderItem.amount} onChange={(e) => this.handleEditOrderItem(e, x.code, x.askedProductName)}/>
              :
              <span style={{ width: '100%'  }}>{x.amount}</span>
            }
          </div>
          <div className='col s3'>
            {
              isEditing == true ?
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <select style={{display: 'block' }} name='botState' value={orderItem.botState} onChange={(e) => this.handleEditOrderItem(e, x.code, x.askedProductName)}>
                  <option value={SURE}>Falta confirmar</option>
                  <option value={confirmedState}>Confirmado</option>
                  <option value={canceldState}>Cancelado</option>
                </select>
                {
                  orderItemsOrdered.indexOf(x) == orderItemsOrdered.length - 1 ?
                  <button onClick={() => this.handleAddProduct()} className={`waves-effect waves-light btn ${Color.Fifth}`}>
                    <i className={`material-icons`}>add_circle_outline</i>
                  </button>
                  :
                  <div></div>
                }
              </div>
              :
              <span style={{ width: '100%'  }}>{botStateHtml}</span>
            }
          </div>
        </div>
      )
    });

    const alertIconColor = (this.state.checked == false && orderItemsOrdered.find(x => x.askedProductName == onlyVendorConfirmed || x.askedProductName == noLongerWantedItem)) ? "#bd3020" : "#ffffff"
    const movilOptions = this?.props?.movilObjs?.map(x => 
      <option value={x.van}>{x.van}</option>
    )
    
    return (
      <li className="collection-item">
      <div className={`collapsible-header N${phoneNumber}`} style={styles.collapsibleHeader}>
        <span className="client-name" style={styles.clientName}>{orderNumber}</span>
        <span className="client-name" style={styles.clientName}>{name}</span>
        <span className="client-name" style={styles.clientName}>
          <a href={`https://wa.me/${phoneNumber}`} target="_blank" rel="noopener noreferrer" style={styles.underlinedLink}>{phoneNumber}</a>
        </span>
        <span className="client-name" style={styles.clientName}>{orderItemsOrdered.length}</span>
        <span className="client-name" style={styles.clientName}>{unsureItemHtml}</span>
        {/* <a href="#"><i style={{ color: alertIconColor }} className="material-icons flicker">brightness_1</i></a> */}
        <span className="client-name" style={styles.clientName}>
          {
            isEditing && currentOpenOrder === phoneNumber ?
            <div class="input-field">
              <input id="pointsUsed" name='pointsUsed' type="number" class="validate" style={{display: 'block' }} onChange={this.handleEditPoints}/>
              <label for="first_name">Puntos usados</label>
            </div> 
            :
            this?.state?.pointsUsed == 0 ? <div></div> : <span>{this?.state?.pointsUsed}</span>
          }
        </span>
        <span className="client-name" style={styles.clientName}>
          {
            isEditing ? 
            <select style={styles.select} name='movil' value={this?.state?.selectedMovil?.van ?? SIN_MOVIL} onChange={this.handleEditMovil}>
              <option value={SIN_MOVIL}>{SIN_MOVIL}</option>
              {movilOptions}
            </select> :
            <span>{this?.state?.selectedMovil?.van ?? SIN_MOVIL}</span>
          }
        </span>
        {
          isEditing && currentOpenOrder === phoneNumber ?
          <button onClick={this.handleEditMode} style={styles.button}>
            <i className={`${isEditing && currentOpenOrder === phoneNumber ? "orange-text" : "grey-text"} material-icons`}>{isEditing && currentOpenOrder === phoneNumber ? "save" : "edit"}</i>
          </button> :
          <div></div>
        }
        <a><i className="material-icons" style={styles.arrowDown}>keyboard_arrow_down</i></a>
      </div>
      <div className="collapsible-body">
        {orderList}
      </div>
    </li>
    );
  }
}

const styles = {
  collapsibleHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    width: '100%',
    boxSizing: 'border-box'
  },
  clientName: {
    flex: '1 1 20%',
    minWidth: '100px'
  },
  underlinedLink: {
    textDecoration: 'underline'
  },
  select: {
    display: 'block',
    width: 'auto',
    maxWidth: '150px'
  },
  button: {
    backgroundColor: 'transparent',
    border: 'none'
  },
  arrowDown: {
    width: '100%'
  }
};

export default OrderComponent;