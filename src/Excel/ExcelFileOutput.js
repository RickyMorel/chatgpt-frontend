import axios from 'axios';
import React, { Component } from 'react';
import { Color } from '../Colors';
import ExcelOutputUtils from './ExcelOutputUtils';

class ExcelFileOutput extends Component {
  state = {
    orders: [],
    loading: false,
    error: null,
  };

  fetchOrderData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/order`);
      console.log("fetchOrderData", response)
      this.setState({ orders: response.data });
    } catch (error) {
      this.setState({ error: error });
    } finally {
      this.setState({ loading: false });
    }
  };

  convertOrderToExcel = async () => {
    await this.fetchOrderData();

    if(this.state.orders.length < 1) { return null}

    console.log("this.state.orders", this.state.orders)
    
    let allOrders = []
    this.state.orders.forEach(client => {
      let ordersString = ""

      client.order.forEach(order => {
        ordersString += `${order.name}:${order.amount},`
      });
      //Remove last ,
      ordersString = ordersString.substring(0, ordersString.length - 1)

      let orderEntry = [client.name, client.phoneNumber, ordersString]

      allOrders.push(orderEntry)
    });

    console.log("allOrders", allOrders)

    return allOrders
  }

  handleDownload = async () => {
    const data = await this.convertOrderToExcel()

    console.log("handleDownload", data)

    ExcelOutputUtils.handleDownload(data)
  };

  render() {
    return (
      <div>
        <button className={`waves-effect waves-light btn ${Color.Button_1}`} onClick={this.handleDownload}>
          <i className="material-icons left">cloud_download</i>
          Descargar pedidos
        </button>
      </div>
    );
  }
}

export default ExcelFileOutput;
