import React, { Component } from 'react'
import CustomBarChart from '../Searchbar/CustomBarChart'
import axios from 'axios';
import CssProperties from '../CssProperties';
import { ColorHex } from '../Colors';

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

class KPIStatsScreen  extends Component {

  constructor() {
    super()
    
    this.state = {
      orderHistories: []
    }
  }

  componentDidMount() {
    this.fetchOrderHistoryData()
  }

  fetchOrderHistoryData = async () => {
      try {
          const response = await axios.put(`${process.env.REACT_APP_HOST_URL}/order-history/getAllWithinMonth`, {monthDate: new Date()});
          this.setState({
          orderHistories: response.data,
          });
      } catch (error) {}
  };

  render() {
    return (
      <div>
        <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>Ventas diarias de {monthNames[new Date().getMonth()]}</p>
        <CustomBarChart orderHistory={this.state.orderHistories}/>
      </div>
    )
  }
}

export default KPIStatsScreen