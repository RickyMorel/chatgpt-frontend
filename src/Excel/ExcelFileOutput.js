import React, { Component } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

class ExcelFileOutput extends Component {
  state = {
    orders: [],
    loading: false,
    error: null,
  };

  fetchOrderData = async () => {
    console.log("fetchOrderData");
    try {
      const response = await axios.get('http://localhost:3000/order');
      console.log("response:", response)
      this.setState({ orders: response.data });
      console.log("clients: ", this.state.clients);
    } catch (error) {
      this.setState({ error: error });
    } finally {
      this.setState({ loading: false });
    }
  };

  convertOrderToExcel = async () => {
    await this.fetchOrderData();
    
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

  handleDownload = () => {
    // Create a sample workbook
    const data = this.convertOrderToExcel()

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Save the workbook to a file
    XLSX.writeFile(wb, 'sample.xlsx');
  };

  render() {
    return (
      <div>
        <button onClick={this.handleDownload}>Descargar pedidos</button>
      </div>
    );
  }
}

export default ExcelFileOutput;
