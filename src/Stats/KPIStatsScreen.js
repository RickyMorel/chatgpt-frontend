import React, { Component } from 'react'
import CustomBarChart from '../Searchbar/CustomBarChart'
import axios from 'axios';
import CssProperties from '../CssProperties';
import { ColorHex } from '../Colors';
import Utils from '../Utils';
import CustomSelect from '../Searchbar/CustomSelect';
import CustomButton from '../Searchbar/CustomButton';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

class KPIStatsScreen  extends Component {

  constructor() {
    super()
    
    this.state = {
      orderHistories: [],
      products: [],
      mostSoldFoods: [],
      selectedMonth: monthNames[new Date().getMonth()],
    }
  }

  componentDidMount() {
    this.props.setIsLoading(true)
    
    const promise1 = this.fetchOrderHistoryData()
    const promise2 = this.fetchProductData()

    Promise.all([promise1, promise2])
    .then((results) => {
        this.props.setIsLoading(false)
    })
  }

  fetchOrderHistoryData = async () => {
      try {
          const response = await axios.put(`${process.env.REACT_APP_HOST_URL}/order-history/getAllWithinMonth`, {monthDate: new Date(), monthsBack: 2});
          this.setState({
          orderHistories: response.data,
          });

          this.getTopFoods(response.data, this.state.selectedMonth)
      } catch (error) {}
  };

  fetchProductData = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/inventory/allItems`);
        this.setState({
          products: response.data,
        });
    } catch (error) {}
  };

  getTopFoods = (orderHistories, selectedMonth) => {
    let countedItemsDict = {}
    let amountSoldItemsDict = {}

    for(const orderHistory of orderHistories) {
      if(new Date(orderHistory.creationDate).getMonth() != monthNames.indexOf(selectedMonth)) { continue; }

      for(const orderItem of orderHistory.order) {
        if (countedItemsDict.hasOwnProperty(orderItem.code)) {
          countedItemsDict[orderItem.code] += 1;  // Increment if it exists
          amountSoldItemsDict[orderItem.code] += +orderItem.amount;  // Increment if it exists
        } else {
          countedItemsDict[orderItem.code] = 1;   // Initialize to 1 if it doesn't exist
          amountSoldItemsDict[orderItem.code] = +orderItem.amount;   // Initialize to 1 if it doesn't exist
        }
      }
    }

    let itemsArray = Object.entries(countedItemsDict);
    
    let finalArray = itemsArray.map(x => ({
        code: x[0],
        count: x[1],
        amountSold: amountSoldItemsDict[x[0]]
      })
    )

    console.log("finalArray", finalArray)
    
    finalArray.sort((a, b) => b.count - a.count);
    
    let topNItems = finalArray.slice(0, 12);
    
    this.setState({mostSoldFoods: topNItems})
  }

  render() {
    const monthNameOptions = monthNames.map(x => ({label: x, value: x}))

    return (
      <div>
        <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>Estadisticas</p>
        <div style={{display: 'flex', gap: '25px', marginBottom: '25px'}}>
          <CustomButton text="Estadisticas Clientes"  width="225px" height="45px" icon={faAddressCard} link="stats/clients"/>
          <CustomSelect
            width='292px'
            height='45px'
            options={monthNameOptions}
            onChange={(value) => {this.setState({selectedMonth: value.value}); this.getTopFoods(this.state.orderHistories, value.value)}}
            value={monthNameOptions.find(x => x.value == this.state.selectedMonth)}
            isSearchable={false}
          />
        </div>
        <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody, marginBottom: '-5px'}}>Ventas diarias de {this.state.selectedMonth}</p>
        <CustomBarChart orderHistory={this.state.orderHistories} selectedMonthIndex={monthNames.indexOf(this.state.selectedMonth)}/>
        <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody, marginBottom: '-10px', marginTop: '15px'}}>Productos Mas Vendidos</p>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'scroll', scrollBehavior: 'smooth', padding: '10px 0',width: '85vw', justifySelf: 'center'}}>
  {
    this.state.mostSoldFoods.map(x => {
      let wantedProduct = this.state?.products.find(y => y.code === x.code);
      return (
        <div style={orderAmountCardStyling} className='text-center'>
          <img style={{ width: '100%', height: 'auto'}} src={wantedProduct?.imageLink} />

          <p style={{...CssProperties.BodyTextStyle, color: ColorHex.TextBody, marginTop: '1px'}}>
            {Utils.getCutName(wantedProduct?.name, 30)}
          </p>
          <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginTop: '-12px'}}>
            {x.count} veces vendidas
          </p>
          <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginTop: '-12px'}}>
            {x.amountSold} unidades vendidas
          </p>
        </div>
      );
    })
  }
</div>
      </div>
    )
  }
}

const orderAmountCardStyling = {
  flex: '0 0 auto',
  width: '280px',  // Slightly reduced for better fitting
  height: 'auto',
  marginTop: '10px',
  alignItems: 'center',
  padding: '10px',
  boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
  border: `1px solid ${ColorHex.BorderColor}`,
  borderRadius: '12px',
  backgroundColor: ColorHex.White
}

export default KPIStatsScreen