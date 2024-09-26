import React, { Component } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Utils from '../Utils';

class CustomBarChart extends Component {
  // Custom Tooltip Component to format totalSold for display
  CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Date: ${label}`}</p>
          <p className="intro">{`Total Sold: ${Utils.formatPrice(payload[0].value)}`}</p>
        </div>
      );
    }
  
    return null;
  };

  render() {
    const { orderHistory } = this.props;

    let totalSoldPerDay = [];

    // Process the order history data
    for (const order of orderHistory) {
      const date = order?.deliveryDate ?? order?.creationDate;
      const orderDate = `${new Date(date).getDate()}-${new Date(date).getMonth()}-${new Date(date).getFullYear()}`;

      const dateFound = totalSoldPerDay.find(x => x.date === orderDate);

      if (!dateFound) {
        totalSoldPerDay.push({ date: orderDate, totalSold: order.totalSold });
        continue;
      }

      // Update the total sold for the found date
      let newTotal = { ...dateFound };
      newTotal.totalSold += order.totalSold;

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

    // Keep totalSold as a number for the chart
    const formattedTotalSoldPerDay = totalSoldPerDay.map(x => ({
      date: x.date,
      totalSold: x.totalSold  // Keep it as a number for chart rendering
    }));

    console.log("totalSoldPerDay", totalSoldPerDay);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedTotalSoldPerDay} margin={{ top: 20, right: 30, left: 50, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => Utils.formatPrice(value)} />
          <Tooltip content={<this.CustomTooltip />} />
          <Legend />
          <Bar dataKey="totalSold" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

export default CustomBarChart;
