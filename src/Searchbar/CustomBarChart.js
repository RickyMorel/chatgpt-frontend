import React, { Component } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Utils from '../Utils';
import CssProperties from '../CssProperties';
import { ColorHex } from '../Colors';

class CustomBarChart extends Component {
  CustomTooltip = ({ active, payload, label }) => {
    if(!label) {return;}

    console.log("payload", payload)

    const [day, month, year] = label?.split("-").map(Number);
    const date = new Date(year, month - 1, day - 1);
    const dayOfWeekIndex = date.getDay(); 

    if (active && payload && payload.length) {
      return (
        <div style={orderAmountCardStyling}>
          <p style={{...CssProperties.MediumHeadetTextStyle, color: ColorHex.TextBody, textAlign: 'center', marginBottom: '-8px'}}>{`${Utils.getWeekName(dayOfWeekIndex)}, ${label}`}</p>
          <p style={{...CssProperties.MediumHeadetTextStyle, color: ColorHex.TextBody, textAlign: 'center', marginBottom: '-8px'}}>{`Pedidos: ${payload[0].payload.orderAmount}`}</p>
          <p style={{...CssProperties.MediumHeadetTextStyle, color: ColorHex.GreenFabri, textAlign: 'center', marginBottom: '-8px'}}>{`${Utils.formatPrice(payload[0].value)}`}</p>
        </div>
      );
    }
  
    return null;
  };

  getBarColor = (dateStr) => {
    const [day, month, year] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day); // Month is zero-indexed
    const dayOfWeekIndex = date.getDay(); // 0 (Sunday) to 6 (Saturday)

    if (dayOfWeekIndex == 0) return '#EB9771'; 
    else if (dayOfWeekIndex == 1) return '#7176EB'; 
    else if (dayOfWeekIndex == 2) return '#EBBA70'; 
    else if (dayOfWeekIndex == 3) return '#71B6EB'; 
    else if (dayOfWeekIndex == 4) return '#968A7A'; 
    else if (dayOfWeekIndex == 5) return '#6B5E58'; 
    else if (dayOfWeekIndex == 6) return '#82ca9d'; 
  };

  render() {
    const { orderHistory, selectedMonthIndex } = this.props;

    let totalSoldPerDay = [];

    // Process the order history data
    for (const order of orderHistory) {
      const date = order?.deliveryDate ?? order?.creationDate;
      const orderDate = `${new Date(date).getDate()}-${new Date(date).getMonth() + 1}-${new Date(date).getFullYear()}`;

      if(new Date(date).getMonth() != selectedMonthIndex) { continue; }

      const dateFound = totalSoldPerDay.find(x => x.date === orderDate);

      if (!dateFound) {
        totalSoldPerDay.push({ date: orderDate, totalSold: order.totalSold, orderAmount: 1 });
        continue;
      }

      // Update the total sold for the found date
      let newTotal = { ...dateFound };
      newTotal.totalSold += order.totalSold;
      newTotal.orderAmount += 1

      // Remove the old entry and add the updated one
      totalSoldPerDay = totalSoldPerDay.filter(x => x.date !== dateFound.date);
      totalSoldPerDay.push(newTotal);
    }

    // Sort the data by date
    totalSoldPerDay.sort((a, b) => {
      const dateA = new Date(a.date.split('-').reverse().join('-'));
      const dateB = new Date(b.date.split('-').reverse().join('-'));
      return dateA - dateB;
    });

    return (
      <ResponsiveContainer width="100%" height={300} style={barChartStyling}>
        <BarChart data={totalSoldPerDay} margin={{ top: 20, right: 30, left: 50, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => Utils.formatPrice(value)} />
          <Tooltip content={<this.CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="totalSold" 
            name="Total Vendido"
            fill={(data) => this.getBarColor(data.date)} // Dynamically set color
            shape={(props) => <rect {...props} fill={this.getBarColor(props.payload.date)} />} // Set the color of the individual bars
        />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

const orderAmountCardStyling = {
  width: 'auto',
  height: 'auto',
  alignItems: 'center',
  padding: '10px',
  boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
  border: `1px solid ${ColorHex.BorderColor}`,
  borderRadius: '12px',
  backgroundColor: ColorHex.White
}

const barChartStyling = {
  width: 'auto',
  height: 'auto',
  alignItems: 'center',
  boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
  border: `1px solid ${ColorHex.BorderColor}`,
  borderRadius: '12px',
  backgroundColor: ColorHex.White,
}

export default CustomBarChart;
