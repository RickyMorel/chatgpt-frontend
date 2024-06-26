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
        filteredOrders: null,
        searchInput: '',
        inventoryItemNamesWithCodes: [],
        updateTotalSalesFlag: false
      };
  }

  componentDidMount() {
    this.fetchOrderData();
    this.fetchInventoryItemNames();
  }

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
      return <OrderComponent key={x.phoneNumber} {...x} orderNumber ={i} inventoryItemNamesWithCodes={this.state.inventoryItemNamesWithCodes} updateTotalSalesCallback={this.updateTotalSales}/>
    });

    let totalSales = 0

    this?.state?.orders?.forEach(order => {
      for(const item of order.order) {
        if(item.botState != "CONFIRMED") {continue;}

        totalSales += (item.price * item.amount)
      }
    });

    console.log("this?.state?.orders?", this?.state?.orders)

    return (
      <div className={`card bordered ${Color.Background}`}>
        <div className="card-content">
          <div style={{"display": "flex", "justify-content": "space-between", "width": "100%"}}>
            <span className="card-title" style={{ width: '70%'  }}>Pedidos Recibidos</span>
            <h6 className='green-text'>Total Vendido: ₲{totalSales.toLocaleString()}</h6>
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
          <ExcelFileOutput />
        </div>
      </div>
    );
  }
}

export default OrderScreen;
