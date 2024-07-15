import axios from 'axios';
import React, { Component } from 'react';
import { Color } from '../Colors';
import OrderComponent from './OrderComponent';
import ExcelFileOutput from '../Excel/ExcelFileOutput';

class OrderScreen extends Component {
  constructor(props) {
      super(props);
  
      this.state = {
        orders: null,
        movilObjs: null,
        filteredOrders: null,
        searchInput: '',
        inventoryItemNamesWithCodes: [],
        updateTotalSalesFlag: false,
        isEditing: false,
        currentOpenOrderClientNumber: '',
        currentSaveCallback: undefined
      };
  }

  componentDidMount() {
    this.fetchOrderData();
    this.fetchMovilData();
    this.fetchInventoryItemNames();
  }

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

  fetchOrderData = async () => {
    this.props.setIsLoading(true)

    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/order`);
      this.setState({
        orders: response.data,
        filteredOrders: response.data,
      });
    } catch (error) {

    }

    this.props.setIsLoading(false)
  };

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

    console.log("handleEditMode")

    if(isEditing == false) {
      console.log("handleEditMode", isEditing)
      if(this.state.currentSaveCallback != undefined) {
        console.log("SAVE")
        this.state.currentSaveCallback()
      }
    }
  }

  setCurrentOpenOrder = (clientNumber, saveCallback) => {
    if(this.state.currentOpenOrderClientNumber == clientNumber) {
      this.setState({
        currentOpenOrderClientNumber: '',
        currentSaveCallback: undefined
      })
    }
    else {
      this.setState({
        currentOpenOrderClientNumber: clientNumber,
        currentSaveCallback: saveCallback
      })
    }
  }

  fetchInventoryItemNames = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/inventory/getTommorowsInventoryNamesWithCodes`);
      this.setState({
        inventoryItemNamesWithCodes: response.data,
      });
    } catch (error) {

    }
  };

  updateTotalSales = () => {
    this.setState({
      updateTotalSalesFlag: !this.state.updateTotalSalesFlag
    })
  }

  handleSearchInputChange = (event) => {
    const searchInput = event.target.value;
    this.setState({ searchInput }, () => {
      this.filterOrders();
    });
  };

  filterOrders = () => {
    const { orders, searchInput } = this.state;

    const filteredOrders = orders.filter(order =>
        order.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        order.phoneNumber.toLowerCase().includes(searchInput.toLowerCase()) ||
        order.order.find(x => x.name.toLowerCase().includes(searchInput.toLowerCase()) == true)
    );

    this.setState({ filteredOrders });
  };

  render() {
    const { filteredOrders } = this.state;

    let i = 0
    const orderBlocks = filteredOrders?.map(x => {
      i += 1
      return <OrderComponent
                key={x.phoneNumber}
                {...x} 
                setCurrentOpenOrder={this.setCurrentOpenOrder}
                movilObjs={this.state.movilObjs} 
                orderNumber ={i} 
                currentOpenOrder={this.state.currentOpenOrderClientNumber} 
                isEditing={this.state.isEditing} 
                inventoryItemNamesWithCodes={this.state.inventoryItemNamesWithCodes} 
                updateTotalSalesCallback={this.updateTotalSales}
                showPopup={this.props.showPopup}
              />
    });

    let totalSales = 0

    this?.state?.orders?.forEach(order => {
      for(const item of order.order) {
        if(item.botState != "CONFIRMED") {continue;}

        totalSales += (item.price * item.amount)
      }
    });

    return (
      <div className={`card bordered ${Color.Background}`}>
        <div className="card-content">
          <div style={{"display": "flex", "justify-content": "space-between", "width": "100%"}}>
            <span className="card-title" style={{ width: '85%'  }}>Pedidos Recibidos</span>
            <h6 className='green-text'>Total Vendido: ₲{totalSales.toLocaleString()}</h6>
            <button onClick={this.handleEditMode} style={{"background-color": "transparent", "border": "none"}}>
              <i className={`${this.state.isEditing ? "orange-text" : "grey-text"} material-icons`}>{this.state.isEditing ? "save" : "edit"}</i>
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
    );
  }
}

export default OrderScreen;
