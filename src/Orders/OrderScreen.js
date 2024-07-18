import axios from 'axios';
import React, { Component } from 'react';
import { Color } from '../Colors';
import OrderComponent from './OrderComponent';
import ExcelFileOutput from '../Excel/ExcelFileOutput';
import M from 'materialize-css/dist/js/materialize.min.js';
import AddOrderModal from './AddOrderModal';

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
  }

  componentDidMount() {
    this.fetchOrderData();
    this.fetchMovilData();
    this.fetchClientData();
    this.fetchInventoryItemNames();
  }

  componentDidUpdate() {
    this.addCollapsibleListeners(this.state.filteredOrders)
  }

  addCollapsibleListeners(filteredOrders) {
    const collapsibleElem = document.querySelectorAll('.collapsible');
    const instances = M.Collapsible.init(collapsibleElem, {
      // Override the default behavior
      onOpenEnd: function(el) {
          el.classList.add('active');
      },
      onCloseEnd: function(el) {
          el.classList.remove('active');
      }
  });

    const headers = document.querySelectorAll(`.collapsible-header`);
    headers.forEach((header, index) => {
      header.addEventListener('click', (e) => this.openCollapsible(e, index, filteredOrders[index].phoneNumber));
    });
  }

  openCollapsible = (event, index, phonNumber) => {
    event.stopImmediatePropagation();
    event.preventDefault();
    const collapsibleElem = document.querySelector('.collapsible');
    const collapsibleInstance = M.Collapsible.getInstance(collapsibleElem);
    collapsibleInstance.open(index); // Opens the specific collapsible item
    this.handleHeaderClick(phonNumber, index)
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

  fetchOrderData = async () => {
    this.props.setIsLoading(true)

    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/order`);
      this.addCollapsibleListeners(response.data)
      this.setState({
        orders: response.data,
        filteredOrders: response.data,
      })
    } catch (error) {

    }

    this.props.setIsLoading(false)
  };

  fetchClientData = async () => {
    this.props.setIsLoading(true)

    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/client-crud/getTommorrowsClientsNumbers`);
      this.setState({
        clientNumbers: response.data,
      })
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

    if(isEditing == false) {
      if(this.state.currentSaveCallback != undefined) {
        console.log("SAVE")
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

  handleOpenModal = (item) => {
    this.setState({
      addOrderModelOpen: item != undefined
    })
  }

  filterOrders = () => {
    const { orders, searchInput } = this.state;

    const filteredOrders = orders.filter(order =>
        order.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        order.phoneNumber.toLowerCase().includes(searchInput.toLowerCase()) ||
        order.order.find(x => x.name.toLowerCase().includes(searchInput.toLowerCase()) == true)
    );

    this.setState({ filteredOrders: filteredOrders });
  };

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
              />
    });

    let totalSales = 0

    this?.state?.orders?.forEach(order => {
      for(const item of order.order) {
        if(item.botState != "CONFIRMED") {continue;}

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
    />  

    return (
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
    );
  }
}

export default OrderScreen;
