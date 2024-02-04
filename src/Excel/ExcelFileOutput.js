import React, { Component } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { Color } from '../Colors';

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

    return allOrders
  }

  handleDownload = async () => {
    // Create a sample workbook
    const data = await this.convertOrderToExcel()

    if(!data) {return}

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Save the workbook to a file
    XLSX.writeFile(wb, 'pedidos.xlsx');
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
