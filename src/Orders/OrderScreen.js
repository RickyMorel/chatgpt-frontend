import axios from 'axios';
import React, { Component } from 'react';
import { Color, ColorHex } from '../Colors';
import OrderComponent from './OrderComponent';
import ExcelFileOutput from '../Excel/ExcelFileOutput';
import AddOrderModal from './AddOrderModal';
import CssProperties from '../CssProperties';
import SearchBar from '../Searchbar/Searchbar';
import Dropdown from '../Searchbar/Dropdown';
import CustomButton from '../Searchbar/CustomButton';
import './ScrollView.css'
import StatCard from '../Searchbar/StatCard';

class OrderScreen extends Component {
  constructor(props) {
      super(props);
  
      this.state = {
        orders: null,
        clientNumbers: [],
        movilObjs: null,
        filteredOrders: null,
        searchInput: '',
        inventoryItemNamesWithCodes: [],
        updateTotalSalesFlag: false,
        isEditing: false,
        currentOpenOrderClientNumber: '',
        currentSaveCallback: undefined,
        addOrderModelOpen: false,
      };
      this.orderRefs = [];
      this.CONFIRMED = "CONFIRMED"
      this.CANCELED = "CANCELED"
      this.NOT_IN_INVENTORY = "NOT_IN_INVENTORY"
  }

  componentDidMount() {
    this.fetchOrderData();
    this.fetchMovilData();
    this.fetchInventoryItemNames();
  }

  fetchOrderData = async () => {
    this.props.setIsLoading(true)

    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/order`);
      this.setState({
        orders: response.data,
        filteredOrders: response.data,
      })
    } catch (error) {

    }

    this.props.setIsLoading(false)
  };

  fetchInventoryItemNames = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/inventory/getTommorowsInventoryNamesWithCodes`);
      this.setState({
        inventoryItemNamesWithCodes: response.data,
      });
    } catch (error) {

    }
  };

  fetchMovilData = async () => {
    this.props.setIsLoading(true)

    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/extentions/getEmporioMoviles`);
      this.setState({
        movilObjs: response.data,
      });
    } catch (error) {}

    this.props.setIsLoading(false)
  };

  addNewOrder = (order) => {
    let orders = [...this.state.orders]
    let filteredOrders = [...this.state.filteredOrders]

    orders = orders.filter(x => x.phoneNumber != order.phoneNumber)
    filteredOrders = filteredOrders.filter(x => x.phoneNumber != order.phoneNumber)
    orders.push(order)
    filteredOrders.push(order)

    this.setState({
      orders: orders,
      filteredOrders: filteredOrders,
    })
  }

  handleCheckOrders = async () => {
    this.props.setIsLoading(true, "Creando pedidos, puede tardar hasta unos minutos...")

    try {
      const response = await axios.post(`${process.env.REACT_APP_HOST_URL}/order/processForgottenOrders`);
      let updatedOrders = [...this.state.orders, ...response.data]
      this.setState({
        orders: updatedOrders,
        filteredOrders: updatedOrders,
        searchInput: ''
      })
    } catch (error) {
      this.props.showPopup(new Error(error.response.data.message))
    }

    this.props.setIsLoading(false)
  }

  handleEditMode = () => {
    const isEditing = !this.state.isEditing
    this.setState({
      isEditing: isEditing
    })

    if(isEditing == false) {
      if(this.state.currentSaveCallback != undefined) {
        this.state.currentSaveCallback()
      }
    }
  }

  handleHeaderClick = async (clientNumber, index) => {
    if(this.state.currentOpenOrderClientNumber == clientNumber) {}
    else {
      this.setState({
        currentOpenOrderClientNumber: clientNumber,
        currentSaveCallback: () => {this.orderRefs[index].handleSave()}
      })
    }
  }

  handleSearchInputChange = (event) => {
    const searchInput = event.target.value;
    this.setState({ searchInput }, () => {
      this.filterOrders();
    });
  };

  handleOpenModal = (item) => {
    this.setState({
      addOrderModelOpen: item != undefined
    })
  }

  updateTotalSales = () => {
    this.setState({
      updateTotalSalesFlag: !this.state.updateTotalSalesFlag
    })
  }

  filterOrders = (searchInput) => {
    const { orders } = this.state;

    const filteredOrders = orders.filter(order =>
        order.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        order.phoneNumber.toLowerCase().includes(searchInput.toLowerCase()) ||
        order.order.find(x => x.name.toLowerCase().includes(searchInput.toLowerCase()) == true)
    );

    this.setState({ filteredOrders: filteredOrders });
  }; 

  closeAllDropdowns = (openDropdownId) => {
    this.orderRefs.forEach(orderElement => {
        orderElement.closeDropdown(openDropdownId)
    });
  }

  render() {
    const { filteredOrders } = this.state;

    let i = 0

    this.orderRefs = [];

    const orderBlocks = filteredOrders?.map((x, index) => {
      i += 1
      return <OrderComponent
                key={x.phoneNumber}
                ref={(instance) => { this.orderRefs[index] = instance; }}
                {...x} 
                setCurrentOpenOrder={this.setCurrentOpenOrder}
                movilObjs={this.state.movilObjs} 
                orderNumber ={i} 
                currentOpenOrder={this.state.currentOpenOrderClientNumber} 
                isEditing={this.state.isEditing} 
                inventoryItemNamesWithCodes={this.state.inventoryItemNamesWithCodes} 
                updateTotalSalesCallback={this.updateTotalSales}
                showPopup={this.props.showPopup}
                closeAllDropdownsCallback={this.closeAllDropdowns}
              />
    });

    let totalSales = 0

    this?.state?.orders?.forEach(order => {
      for(const item of order.order) {
        if(item.botState != this.CONFIRMED) {continue;}

        totalSales += (item.price * item.amount)
      }
    });

    const addOrderModal = 
    <AddOrderModal 
        isOpen={this.state.addOrderModelOpen} 
        closeCallback={() => this.handleOpenModal(undefined)}
        showPopup={this.props.showPopup}
        movilObjs={this.state.movilObjs}
        inventoryItemCodes={this.state.inventoryItemNamesWithCodes}
        clientNumbers={this.state.clientNumbers}
        addNewOrderCallback={this.addNewOrder}
    />  

    const ordersPanel =         
    <div className={`card bordered ${Color.Background}`}>
      {addOrderModal}
      <div className="card-content">
        <div style={{"display": "flex", "justify-content": "space-between", "width": "100%"}}>
          <span className="card-title" style={{ width: '75%'  }}>Pedidos Recibidos</span>
          <h6 className='green-text'>Total Vendido: ₲{totalSales.toLocaleString()}</h6>
          <button onClick={this.handleEditMode}  className={`waves-effect waves-light btn ${Color.Fifth}`}>
            <i className={`${this.state.isEditing ? "orange-text" : "white-text"} material-icons`}>{this.state.isEditing ? "save" : "edit"}</i>
          </button>
          <button onClick={this.handleOpenModal} className={`waves-effect waves-light btn ${Color.Fifth}`}>
            <i className={`material-icons`}>add_circle_outline</i>
          </button>
        </div>
        <input
          type="text"
          placeholder="Buscar pedidos..."
          value={this.state.searchInput}
          onChange={this.handleSearchInputChange}
        />
        <ul class="collapsible expandable" style={{ overflowY: 'scroll', height: '60vh', "overflow-x": "hidden" }}>
          {orderBlocks}
        </ul>
      </div>
      <div className="card-action">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ExcelFileOutput />
          <button className={`waves-effect waves-light btn ${Color.Fifth}`} onClick={this.handleCheckOrders}>
            <i className="material-icons left">autorenew</i>
            Revisar Pedidos
          </button>
        </div>
      </div>
    </div>

    const orderPanelStyling = {
      width: '100%',
      height: '70vh',
      marginTop: '10px',
      marginTop: '25px',
      padding: '25px',
      boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
      border: `1px solid ${ColorHex.BorderColor}`,
      borderRadius: '10px',
      backgroundColor: ColorHex.White
    }

    const dropdownItems = [
      {name: "Todos Pedidos", value: this.state?.orders},
      {name: "Pedidos Confirmados", value: this.state?.orders?.filter(x => x.orderState == this.CONFIRMED)},
      {name: "Pedidos Pendientes", value: this.state?.orders?.filter(x => x.orderState != this.CONFIRMED && x.orderState != this.CANCELED && x.order.find(x => x.botState == this.NOT_IN_INVENTORY) == undefined)},
      {name: "Pedidos Con Errores", value: this.state?.orders?.filter(x => x.order.find(x => x.botState == this.NOT_IN_INVENTORY) != undefined)},
      {name: "Pedidos Cancelados", value: this.state?.orders?.filter(x => x.orderState == this.CANCELED)},
    ]

    const headerStyle = {
      textAlign: 'center',
      color: ColorHex.TextBody,
      ...CssProperties.BodyTextStyle
    }

    const scrollStyle = {
      borderRadius: '10px',
      backgroundColor: ColorHex.Background,
      padding: '10px',
      boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.3)',
      overflowY: 'scroll', 
      height: '55vh',
      width: '100%',
      // overflowX: 'hidden',
      alignItems: 'center'
    }

    const ordersList = 
      <div style={{ alignItems: 'center', width: '100%', marginTop: '25px'}}>
           <div style={{ alignItems: 'center', height: '45px', width: '98%', display: 'flex'}}>
            <div style={headerStyle} className='col-2'>Nombre del Cliente</div>
            <div style={headerStyle} className='col-2'>Numero del Cliente</div>
            <div style={headerStyle} className='col-2'>Cantidad de Items</div>
            <div style={headerStyle} className='col-1'>Fecha</div>
            <div style={headerStyle} className='col-3'>Estado del Pedido</div>
            <div style={headerStyle} className='col-1'>Movil</div>
            <div style={headerStyle} className='col-1'></div>
           </div>

           <div style={scrollStyle}>
            {orderBlocks}
           </div>
      </div>

    return (
      <div>
        {addOrderModal}
        <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>Pedidos</p>
        
        <div style={{display: 'flex'}}>
            <div class="flex-grow-1"><StatCard title="Pedidos Total" amountColor={ColorHex.TextBody} amountFunction={() => dropdownItems[0]?.value?.length ?? 0}/></div>
            <div class="flex-grow-1" style={{paddingLeft: '25px'}}><StatCard title="Pedidos Confirmados" amountColor={ColorHex.GreenFabri} amountFunction={() => dropdownItems[1]?.value?.length ?? 0}/></div>
            <div class="flex-grow-1" style={{paddingLeft: '25px'}}><StatCard title="Pedidos Pendientes" amountColor={ColorHex.OrangeFabri} amountFunction={() => dropdownItems[2]?.value?.length ?? 0}/></div>
            <div class="flex-grow-1" style={{paddingLeft: '25px'}}><StatCard title="Pedidos Con Errores" amountColor={ColorHex.RedFabri} amountFunction={() => dropdownItems[3]?.value?.length ?? 0}/></div>
            <div class="flex-grow-1" style={{paddingLeft: '25px'}}><StatCard title="Pedidos Cancelados" amountColor={ColorHex.TextBody} amountFunction={() => dropdownItems[4]?.value?.length ?? 0}/></div>
            <div class="flex-grow-1" style={{paddingLeft: '25px'}}><StatCard title="Ventas" amountColor={ColorHex.GreenFabri} amountFunction={() => `₲${totalSales.toLocaleString()}`}/></div>
            <div className="col-5"></div>
        </div>

        {
          this.state.isEditing ?
          <div style={{display: 'flex', width: '100%', paddingTop: '25px', marginTop: '-25px'}}>
            <div class="flex-grow-1" style={{paddingRight: '25px'}}><CustomButton text="Guardar" classStyle="btnGreen" width="182px" height="45px" icon="save" onClickCallback={this.handleSave}/></div>
            <div class="flex-grow-1"style={{paddingRight: '25px'}}><CustomButton text="Cancelare" classStyle="btnRed" icon="cancel" link="orders"/></div>
            <div className="col-10"></div>
          </div>
          :
          <div style={{display: 'flex', width: '100%', paddingTop: '25px'}}>
            <div class="flex-grow-1"><CustomButton text="Revisar Pedidos" icon="autorenew" onClickCallback={this.handleCheckOrders}/></div>
            <div class="flex-grow-1" style={{paddingLeft: '25px'}}><CustomButton text="Editar Pedidos" icon="edit" onClickCallback={this.handleEditMode}/></div>
            <div class="flex-grow-1"style={{paddingLeft: '25px'}}><CustomButton text="Crear Pedido" icon="add" link="createOrder"/></div>
            <div class="flex-grow-1"style={{paddingLeft: '25px'}}><ExcelFileOutput/></div>
            <div className="col-8"></div>
          </div>
        }

        <div style={orderPanelStyling}>
          <div style={{display: 'flex'}}>
            <div class="flex-grow-3">
              <SearchBar searchText="Buscar Nro/Cliente/Pedido..." OnSearchCallback={this.filterOrders}/>
            </div>
            <div class="flex-grow-3" style={{paddingLeft: '25px'}}>
              <Dropdown dropdownItems={dropdownItems} handleChangeCallback={(selectedObj) => this.setState({filteredOrders: selectedObj.value})}/>
            </div>
          </div>

          {ordersList}
        </div>
      </div>
    );
  }
}

export default OrderScreen;
