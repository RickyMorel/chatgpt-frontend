import axios from 'axios';
import { es } from 'date-fns/locale';
import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { Color, ColorHex } from '../Colors';
import Utils from '../Utils';
import CssProperties from '../CssProperties';
const badFormatString = "_BAD_FORMAT"

class OrderComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: false,
      order: [],
      confirmedOrder: [],
      selectedMovil: "",
      deliveryDate: undefined,
      isDropdownOpen: false
    }
    this.orderStateColor = ColorHex.GreenFabri
    this.dropdownBtn = React.createRef();
}

  componentDidMount() {
    const selectedMovil = this?.props?.movilObjs?.find(x => x.van == this.props.movil) ?? ""

    this.setState({
      checked: this.props.checkedBySalesPerson,
      order: [...this.props.order],
      confirmedOrder: [...this.props.order],
      selectedMovil: selectedMovil,
      pointsUsed: this.props.pointsUsed,
      deliveryDate: this.props.deliveryDate ? new Date(this.props.deliveryDate) : new Date(this.props.creationDate)
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

  handleEditOrderItem = (propertyName, value, orderItemCode, orderItemAskedProductName) => {
    let editedOrder = [...this.state.order]
    let wantedItem = {...editedOrder.find(x => x.code == orderItemCode && x.askedProductName == orderItemAskedProductName)}
    editedOrder = editedOrder.filter(x => x.code != wantedItem.code)

    wantedItem[propertyName] = value

    if(propertyName == "name") 
    {
      wantedItem.code = value
      wantedItem.name = this.props.inventoryItemNamesWithCodes.find(x => x.code == value).name
    }

    editedOrder.push(wantedItem)

    this.setState({
      order: editedOrder
    })
  }

  handleEditDate = (date) => {
    this.setState({
      deliveryDate: date
    })
  }

  handleAddProduct = () => {
    let editedOrder = [...this.state.order]
    const itemNameWithCode = this.props.inventoryItemNamesWithCodes.find(x => editedOrder.find(y => y.code == x.code) == undefined)
    let newItem = {name: itemNameWithCode.name, code: itemNameWithCode.code, amount: 1, botState: "CONFIRMED", askedProductName: "Agregado", price: 0}

    editedOrder.push(newItem)

    this.setState({
      order: editedOrder
    })
  }

  handleDropdown = (e) => {
    const isOpen = this.state.isDropdownOpen;
    this.setState({ isDropdownOpen: !isOpen });
  }

  handleSave = async () => {
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
            pointsUsed: this.state.pointsUsed,
            deliveryDate: this.state.deliveryDate
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
    const { orderNumber , name, phoneNumber, inventoryItemNamesWithCodes, isEditing, currentOpenOrder } = this.props;

    const onlyVendorConfirmed = "CONFIRMADO SOLO POR VENDEDOR"
    const noLongerWantedItem = "CLIENTE NO QUIERE"
    const confirmedState = "CONFIRMED"
    const canceldState = "CANCELED"
    const NOT_IN_INVENTORY = "NOT_IN_INVENTORY"
    const SURE = "SURE"
    const SIN_MOVIL = "Sin movil"

    let orderItemCount = 0

    let unsureItemHtml = <div className='green-text'>Pedido confirmado</div>
    this.orderStateColor = ColorHex.GreenFabri

    let orderItems = [...this?.state?.order]
    let hasConfirmedItems = this?.state?.confirmedOrder?.find(x => x.botState == confirmedState)
    orderItems = orderItems.filter(x => x.botState != "UNSURE")
    //If agent confirmed order, don't show not sure items
    if(hasConfirmedItems) { orderItems = orderItems.filter(x => x.botState != SURE)}

    for(const item of orderItems) {
      if(item.name.includes(badFormatString) == true) { unsureItemHtml = <div className='red-text'>Confirmado con formato incorrecto</div>; this.orderStateColor = ColorHex.RedFabri}
      else if(item.botState == SURE && !hasConfirmedItems) {unsureItemHtml = <div className='orange-text'>Items no estan confirmados por el vendedor</div>; this.orderStateColor = ColorHex.OrangeFabri}
      else if(item.botState == "UNSURE") {unsureItemHtml = <div className='orange-text'>Inseguro de pedido</div>; this.orderStateColor = ColorHex.OrangeFabri}
      else if(item.botState == NOT_IN_INVENTORY) {unsureItemHtml = <div className='red-text'>No encontro producto pedido</div>; this.orderStateColor = ColorHex.RedFabri; break;}
    }

    if(orderItems.every(x => x.botState == canceldState)) {unsureItemHtml = <div className='red-text'>Pedido cancelado</div>; this.orderStateColor = ColorHex.GreyFabri}

    let orderItemsOrdered = orderItems.sort((a, b) => a.name.localeCompare(b.name));

    const orderList = orderItemsOrdered?.map(x => {
      orderItemCount = orderItemCount + 1
      const i = orderItemCount
      let botStateHtml = <div style={{color: ColorHex.GreenFabri}}>Confirmado</div>
      if(x.name.includes(badFormatString) == true) { botStateHtml = <div style={{color: ColorHex.RedFabri}}>Confirmado con formato incorrecto</div>; }
      else if(x.botState == canceldState) { botStateHtml = <div style={{color: ColorHex.RedFabri}}>Cancelado</div> }
      else if(x.botState == SURE) {botStateHtml = <div style={{color: ColorHex.OrangeFabri}}>No confirmado por vendedor</div>}
      else if(x.botState == "UNSURE") {botStateHtml = <div style={{color: ColorHex.OrangeFabri}}>Inseguro</div>}
      else if(x.botState == NOT_IN_INVENTORY) {botStateHtml = <div style={{color: ColorHex.RedFabri}}>No encontro en inventario</div>;}

      const askedProductNameColor = x.askedProductName.includes(onlyVendorConfirmed) || x.askedProductName.includes(noLongerWantedItem) ? "red" : "black"
      const displayedName = x.name.replace(badFormatString, "")

      const orderItemCodesSelect = inventoryItemNamesWithCodes?.map(x => ({value: x.code, label: x.name}))
      const orderItem = this.state.order.find(y => y.code == x.code && y.askedProductName == x.askedProductName)
      const orderItemSelect = {value: orderItem.code, label: orderItem.name}

      return(
        <div className="row">
          <div className="col-3" style={{...styles.textStyle, color: ColorHex.TextBody}}>
            {x.askedProductName}
          </div>
          <div className="col-3" style={{...styles.textStyle, color: ColorHex.TextBody}}>
            {displayedName}
          </div>
          <div className="col-2" style={{...styles.textStyle, color: ColorHex.TextBody}}>
            {x.amount}
          </div>
          <div className="col-2" style={{...styles.textStyle, color: ColorHex.TextBody}}></div>
          <div className="col-2" style={{...styles.textStyle, color: ColorHex.TextBody}}>
            {botStateHtml}
          </div>
        </div>
        // <div className='row'>
        //   <div className='col s2'>
        //     <span style={{ width: '100%'  }}>{i}</span>
        //   </div>
        //   <div className='col s3'>
        //     <span style={{ width: '100%', color: askedProductNameColor}}>{x.askedProductName}</span>
        //   </div>
        //   <div className='col s3'>
        //   {
        //       isEditing == true ?
        //       <Select
        //           options={orderItemCodesSelect}
        //           onChange={(value) => this.handleEditOrderItem("name", value.value, x.code, x.askedProductName)}
        //           value={orderItemSelect}
        //           isSearchable={true}
        //       />
        //       :
        //       <span style={{ width: '100%'  }}>{displayedName}</span>
        //     }
        //   </div>       
        //   <div className='col s1'>
        //     {
        //       isEditing == true ?
        //       <input style={{display: 'block' }} name='amount' value={orderItem.amount} onChange={(e) => this.handleEditOrderItem("amount", e.target.value, x.code, x.askedProductName)}/>
        //       :
        //       <span style={{ width: '100%'  }}>{x.amount}</span>
        //     }
        //   </div>
        //   <div className='col s3'>
        //     {
        //       isEditing == true ?
        //       <div style={{ display: 'flex', alignItems: 'center' }}>
        //         <select style={{display: 'block' }} name='botState' value={orderItem.botState} onChange={(e) => this.handleEditOrderItem("botState", e.target.value, x.code, x.askedProductName)}>
        //           <option value={SURE}>Falta confirmar</option>
        //           <option value={confirmedState}>Confirmado</option>
        //           <option value={canceldState}>Cancelado</option>
        //         </select>
        //         {
        //           orderItemsOrdered.indexOf(x) == orderItemsOrdered.length - 1 ?
        //           <button onClick={() => this.handleAddProduct()} className={`waves-effect waves-light btn ${Color.Fifth}`}>
        //             <i className={`material-icons`}>add_circle_outline</i>
        //           </button>
        //           :
        //           <div></div>
        //         }
        //       </div>
        //       :
        //       <span style={{ width: '100%'  }}>{botStateHtml}</span>
        //     }
        //   </div>
        // </div>
      )
    });

    const movilOptions = this?.props?.movilObjs?.map(x => 
      <option value={x.van}>{x.van}</option>
    )

    return (
      <div>
        <div style={styles.trStyle}>
          <div style={{...styles.textStyle, color: ColorHex.TextBody}} className='col-2'>{name}</div>
          <div style={{...styles.textStyle, color: ColorHex.TextBody}} className='col-2'><a href={`https://wa.me/${phoneNumber}`} target="_blank" rel="noopener noreferrer" style={styles.underlinedLink}>+{phoneNumber}</a></div>
          <div style={{...styles.textStyle, color: ColorHex.TextBody}} className='col-2'>{orderItemsOrdered.length}</div>
          <div style={{...styles.textStyle, color: ColorHex.TextBody}} className='col-1'>{Utils.formatDate(this.state.deliveryDate)}</div>
          <div style={{...styles.textStyle, color: this.orderStateColor}} className='col-3'>{unsureItemHtml}</div>
          <div style={{...styles.textStyle, color: ColorHex.TextBody}} className='col-1'>{this?.state?.selectedMovil?.van ?? SIN_MOVIL}</div>
          <button ref={this.dropdownBtn} onClick={this.handleDropdown} style={{border: '0px', backgroundColor: 'transparent'}} className='col-1' data-toggle="collapse" data-target={`#collapse_${orderNumber}`} aria-expanded={this.state.isDropdownOpen} aria-controls={`collapse_${orderNumber}`}><i className="material-icons" style={styles.arrowDown}>{this?.state?.isDropdownOpen == true ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i></button>
        </div>

        <div class="collapse mt-3" id={`collapse_${orderNumber}`}>
          <div class="card card-body" style={{border: '0px', backgroundColor: 'transparent', marginTop: '-20px'}}>
              <div className="row">
              <div className="col-3" style={{...styles.textStyle, color: ColorHex.TextBody}} >
                  Item Confirmado por Mensaje
                </div>
                <div className="col-3" style={{...styles.textStyle, color: ColorHex.TextBody}} >
                  Nombre de Item
                </div>
                <div className="col-2" style={{...styles.textStyle, color: ColorHex.TextBody}}>
                  Cantidad
                </div>
                <div className="col-2" style={{...styles.textStyle, color: ColorHex.TextBody}}></div>
                <div className="col-2" style={{...styles.textStyle, color: ColorHex.TextBody}}>
                  Estado de Item
                </div>
              </div>

              <hr style={{color: ColorHex.TextBody, marginTop: '-1px'}}/>

              <div style={{marginTop: '-10px'}}>
                {orderList}
              </div>
          </div>
        </div>

      </div>
    //   <li className="collection-item">
    //   <div className={`collapsible-header N${phoneNumber}`} style={styles.collapsibleHeader}>
    //     <span className="client-name" style={styles.smallerText}>{orderNumber}</span>
    //     <span className="client-name" style={styles.clientName}>{name}</span>
    //     <span className="client-name" style={styles.clientName}>
    //       <a href={`https://wa.me/${phoneNumber}`} target="_blank" rel="noopener noreferrer" style={styles.underlinedLink}>{phoneNumber}</a>
    //     </span>
    //     <span className="client-name" style={styles.smallerText}>{orderItemsOrdered.length}</span>
    //     <span className="client-name" style={styles.clientName}>{unsureItemHtml}</span>
    //     <span className="client-name" style={styles.clientName}>
    //       {
    //         isEditing && currentOpenOrder === phoneNumber ?
    //         <div class="input-field">
    //           <input id="pointsUsed" name='pointsUsed' type="number" class="validate" style={{display: 'block' }} onChange={this.handleEditPoints}/>
    //           <label for="first_name">Puntos usados</label>
    //         </div> 
    //         :
    //         this?.state?.pointsUsed == 0 ? <div></div> : <span>{this?.state?.pointsUsed}</span>
    //       }
    //     </span>
    //     <span className="client-name" style={styles.clientName}>
    //       {
    //         isEditing ? 
    //         <select style={styles.select} name='movil' value={this?.state?.selectedMovil?.van ?? SIN_MOVIL} onChange={this.handleEditMovil}>
    //           <option value={SIN_MOVIL}>{SIN_MOVIL}</option>
    //           {movilOptions}
    //         </select> :
    //         <span>{this?.state?.selectedMovil?.van ?? SIN_MOVIL}</span>
    //       }
    //     </span>
    //     <span className="client-name" style={styles.clientName}>
    //       {
    //         isEditing && currentOpenOrder === phoneNumber ?
    //         <DatePicker
    //           style={{display: 'block' }}
    //           dateFormat="dd/MM/yy"
    //           id="datepicker"
    //           selected={this.state.deliveryDate}
    //           onChange={(date) => this.handleEditDate(date)}
    //           locale={es}
    //         />
    //         :
    //         <div>{Utils.formatDate(this.state.deliveryDate)}</div>
    //       }
    //     </span>
    //     {
    //       isEditing && currentOpenOrder === phoneNumber ?
    //       <button onClick={this.handleEditMode} style={styles.button}>
    //         <i className={`${isEditing && currentOpenOrder === phoneNumber ? "orange-text" : "grey-text"} material-icons`}>{isEditing && currentOpenOrder === phoneNumber ? "save" : "edit"}</i>
    //       </button> :
    //       <div></div>
    //     }
    //     <a><i className="material-icons" style={styles.arrowDown}>keyboard_arrow_down</i></a>
    //   </div>
    //   <div className="collapsible-body">
    //     {orderList}
    //   </div>
    // </li>
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
  smallerText: {
    flex: '1 1 10%',
    minWidth: '50px'
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
    width: '100%',
    fontSize: '40px',
    color: ColorHex.TextBody
  },
  textStyle: {
    textAlign: 'center',
    ...CssProperties.BodyTextStyle
  },
  trStyle: {
    borderRadius: '10px',
    backgroundColor: ColorHex.White,
    boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
    border: `1px solid ${ColorHex.BorderColor}`,
    height: '50px',
    width: '100%',
    alignItems: 'center',
    marginBottom: '12px',
    display: 'flex'
  }
};

export default OrderComponent;