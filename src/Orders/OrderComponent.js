import axios from 'axios';
import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import CustomButton from '../Searchbar/CustomButton';
import CustomDatePicker from '../Searchbar/CustomDatePicker';
import CustomInput from '../Searchbar/CustomInput';
import CustomSelect from '../Searchbar/CustomSelect';
import Utils from '../Utils';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
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

  handleEditMovil = (oldValue, newValue) => {
    const wantedMovil = this.props.movilObjs.find(x => x.van == newValue)

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

    this.setState({ isDropdownOpen: !isOpen }, () => this.props.closeAllDropdownsCallback(this.props.orderNumber));

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
    //const { isEditing } = this.state;

    const onlyVendorConfirmed = "CONFIRMADO SOLO POR VENDEDOR"
    const noLongerWantedItem = "CLIENTE NO QUIERE"
    const confirmedState = "CONFIRMED"
    const canceldState = "CANCELED"
    const NOT_IN_INVENTORY = "NOT_IN_INVENTORY"
    const SURE = "SURE"
    const SIN_MOVIL = "Sin movil"

    const movilOptions = this?.props?.movilObjs?.map(x => ({value: x.van, label: x.van}))
    const botStateOptions = [
      {value: SURE, label: 'FALTA CONFIRMAR'},
      {value: confirmedState, label: 'Confirmado'},
      {value: canceldState, label: 'Cancelado'}
    ]

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

      const displayedName = x.name.replace(badFormatString, "")

      const orderItemCodesSelect = inventoryItemNamesWithCodes?.map(x => ({value: x.code, label: x.name}))
      const orderItem = this.state.order.find(y => y.code == x.code && y.askedProductName == x.askedProductName)
      const orderItemSelect = {value: orderItem.code, label: orderItem.name}

      console.log("x.amount", x.amount)

      return(
        <div className="row" style={{paddingBottom: '15px'}}>
          <div className="col-3" style={{...styles.textStyle, color: ColorHex.TextBody}}>
            {x.askedProductName}
          </div>
          <div className="col-3" style={{...styles.textStyle, color: ColorHex.TextBody}}>
            {
              !isEditing ?
              displayedName
              :
              <CustomSelect
                width='100%'
                height='30px'
                options={orderItemCodesSelect}
                onChange={(value) => this.handleEditOrderItem("name", value.value, x.code, x.askedProductName)}
                value={orderItemSelect}
                isSearchable={true}
              />
            }
          </div>
          <div className="col-2" style={{...styles.textStyle, color: ColorHex.TextBody, display: 'flex',  justifyContent: 'center', alignItems: 'center'}}>
            {
              !isEditing ?
              x.amount
              :
              <CustomInput
                width='75px'
                height='40px'
                dataType="number"
                value={x.amount}
                onChange={(value) => this.handleEditOrderItem("amount", value, x.code, x.askedProductName)}
              />
            }
          </div>
          <div className="col-4" style={{...styles.textStyle, color: ColorHex.TextBody}}>
            {
              !isEditing ? 
              botStateHtml
              :
              <CustomSelect
                width='100%'
                height='30px'
                options={botStateOptions}
                onChange={(value) => this.handleEditOrderItem("botState", value, x.code, x.askedProductName)}
                value={botStateOptions.find(x => x.value == orderItem.botState) ?? botStateOptions[0]}
                isSearchable={false}
              />
            }
          </div>
        </div>
      )
    });

    if(isEditing) {
      orderList.push(
        <CustomButton width='100%' height="75px" icon={faPlus} onClickCallback={() => this.handleAddProduct()}/>
      )
    }

    return (
      <div>
        <div style={styles.trStyle}>
          <div style={{...styles.textStyle, color: ColorHex.TextBody}} className='col-2'>{name}</div>
          <div style={{...styles.textStyle, color: ColorHex.TextBody}} className='col-2'><a href={`https://wa.me/${phoneNumber}`} target="_blank" rel="noopener noreferrer" style={styles.underlinedLink}>+{phoneNumber}</a></div>
          <div style={{...styles.textStyle, color: ColorHex.TextBody}} className='col-2'>{orderItemsOrdered.length}</div>
          {
            !isEditing ? 
              <div style={{...styles.textStyle, color: ColorHex.TextBody}} className='col-1'>{Utils.formatDate(this.state.deliveryDate)}</div>
            :
            <CustomDatePicker
              width='119px'
              height='30px'
              includeButton={false}
              selected={this.state.deliveryDate}
              onChange={(date) => this.handleEditDate(date)}
            /> 
          }
          <div style={{...styles.textStyle, color: this.orderStateColor}} className='col-3'>{unsureItemHtml}</div>
          {
            !isEditing ? 
              <div style={{...styles.textStyle, color: ColorHex.TextBody}} className='col-1'>{this?.state?.selectedMovil?.van ?? SIN_MOVIL}</div>
            :
            <CustomSelect
              width='154px'
              height='30px'
              placeHolderText={"Sin Movil"}
              options={movilOptions}
              onChange={(value) => this.handleEditMovil(this?.state?.selectedMovil?.van, value)}
              value={movilOptions?.find(y => y.value == this?.state?.selectedMovil?.van)}
              isSearchable={false}
            />
          }
          <button
            ref={this.dropdownBtn}
            onClick={this.handleDropdown}
            style={{ border: '0px', backgroundColor: 'transparent' }}
            className='col-1'
            data-toggle="collapse"
            data-target={`#collapse_${orderNumber}`}
            aria-expanded={this?.state?.isDropdownOpen}
            aria-controls={`#collapse_${orderNumber}`}
          >
            <i className="material-icons" style={styles.arrowDown}>
              {this.state?.isDropdownOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
            </i>
          </button>
        </div>

        <div class="collapse mt-3" id={`collapse_${orderNumber}`}>
          <div class="card card-body" style={{border: '0px', backgroundColor: 'transparent', marginTop: '-20px'}}>
              <div className="row">
              <div className="col-3" style={{...styles.textStyle, color: ColorHex.TextBody}} >
                  Item Confirmado por Mensaje
                </div>
                <div className="col-3" style={{...styles.textStyle, color: ColorHex.TextBody}} >
                  Nombre del Item Encontrado
                </div>
                <div className="col-2" style={{...styles.textStyle, color: ColorHex.TextBody}}>
                  Cantidad
                </div>
                <div className="col-4" style={{...styles.textStyle, color: ColorHex.TextBody}}>
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