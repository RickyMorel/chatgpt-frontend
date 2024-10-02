import React, { Component } from 'react'
import CustomBarChart from '../Searchbar/CustomBarChart'
import axios from 'axios';
import Utils from '../Utils';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import CustomButton from '../Searchbar/CustomButton';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import CustomDatePicker from '../Searchbar/CustomDatePicker';

class ClientStatsScreen extends Component {
  constructor() {
    super()
    
    this.state = {
      clientsOfDay: [],
      orderHistories: [],
      viewDate: new Date()
    }
  }

  componentDidMount() {
    this.props.setIsLoading(true)
    
    const promise1 = this.fetchOrderHistoryData(this.state.viewDate)
    const promise2 = this.fetchClientsOfDay(this.state.viewDate)

    Promise.all([promise1, promise2])
    .then((results) => {
        this.props.setIsLoading(false)
    })
  }

  fetchOrderHistoryData = async (newDate) => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_HOST_URL}/order-history/getAllWithinMonth`, {monthDate: newDate, monthsBack: 1});
        this.setState({
          orderHistories: response.data,
        });
    } catch (error) {}
  };

  fetchClientsOfDay = async (newDate) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/client-crud/getDayOfTheWeekClients?dayIndex=${Utils.getDayIndex(newDate)}`);
        console.log("fetchClientsOfDay", Utils.getDayIndex(newDate), newDate, response.data)
        this.setState({
          clientsOfDay: response.data,
        });
    } catch (error) {}
  };

  handleEditDate = (date) => {
    this.setState({viewDate: date})

    this.props.setIsLoading(true)
    
    const promise1 = this.fetchOrderHistoryData(date)
    const promise2 = this.fetchClientsOfDay(date)

    Promise.all([promise1, promise2])
    .then((results) => {
        this.props.setIsLoading(false)
    })
  }

  getMissedClients = () => {
    const {clientsOfDay, orderHistories} = this.state

    let clientsWhoDidntOrder = []

    for(const clientNumber of clientsOfDay) {
      const previousClientOrders = orderHistories.filter(x => x.phoneNumber == clientNumber.phoneNumber)

      //Only consider regular clients who have ordered within 2 months
      if(previousClientOrders.length < 1) { continue; }

      //Check if regular client ordered today
      if(previousClientOrders.find(x => Utils.areSameDay(new Date(x.deliveryDate), this.state.viewDate))) {continue;}

      clientsWhoDidntOrder.push(clientNumber)
    }

    return clientsWhoDidntOrder
  }

  render() {
    const missedClients = this.getMissedClients()
    // console.log("missedClients", missedClients)
    return (
      <div>
        <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>Clientes frecuentes que no pidieron</p>
        <div style={orderPanelStyling}>
          <div style={{display: 'flex', marginBottom: '25px'}}>
            <CustomDatePicker
              selected={this.state.viewDate}
              onChange={(date) => this.handleEditDate(date)}
              width="300px"
              height='45px'
              iconSize="25px"
              minDate={new Date(new Date().setDate(new Date().getDate() - 7))}
              maxDate={new Date()}
            />   
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', height: '100vh', overflowY: 'auto', ...scrollStyle}}>
              {
                missedClients.map(x => 
                  <div style={clientCardStyling}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginBottom: '-2px'}}>{x.name}</p>
                      <CustomButton classStyle='btnGreen-clicked' width="35px" height="35px" iconSize={25} icon={faWhatsapp} onClickCallback={() => {   
                      console.log("CLICK WHATSAPP BUTTON")
                      const whatsappUrl = `https://wa.me/${x.phoneNumber}`;
                      window.open(whatsappUrl, '_blank');
                      }}/>
                    </div>
                    <p style={{...CssProperties.BodyTextStyle, color: ColorHex.TextBody, marginBottom: '-2px'}}>
                        {
                          x?.favoriteFoods?.length > 0 ?
                          "Productos Favoritos:"
                          :
                          "Probablemente le guste:"
                        }
                      </p>
                    <div style={{display: 'flex'}}>
                      <ul style={ulStyle}>
                        {
                          x?.favoriteFoods?.length > 0 ?
                          x?.favoriteFoods?.slice(0, 3)?.map(x => <li style={liStyle}>{Utils.getCutName(x, 18)}</li>) 
                          :
                          x?.currentProductCorrelation?.itemCodes?.map(x => <li style={liStyle}>{Utils.getCutName(x, 18)}</li>)
                        }
                      </ul>
                    </div>
                  </div>
                )
              }
          </div>
        </div>
      </div>
    )
  }
}


const orderPanelStyling = {
  width: '100%',
  height: '90vh',
  marginTop: '10px',
  marginTop: '25px',
  padding: '25px',
  boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
  border: `1px solid ${ColorHex.BorderColor}`,
  borderRadius: '10px',
  backgroundColor: ColorHex.White
}

const scrollStyle = {
  borderRadius: '10px',
  backgroundColor: ColorHex.Background,
  padding: '10px',
  boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.3)',
  overflowY: 'scroll', 
  height: '70vh',
  width: '100%',
}

const clientCardStyling = {
  width: 'auto',
  height: 'auto',
  marginTop: '10px',
  alignItems: 'center',
  padding: '10px',
  boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
  border: `1px solid ${ColorHex.BorderColor}`,
  borderRadius: '12px',
  backgroundColor: ColorHex.White
}

const ulStyle = {
  listStyleType: 'circle', 
  color: '#333',     
};

const liStyle = {
  lineHeight: '1',
  padding: '4px 0',  
  ...CssProperties.BodyTextStyle, 
  color: ColorHex.TextBody,
};

export default ClientStatsScreen