import React, { Component } from 'react'
import CustomBarChart from '../Searchbar/CustomBarChart'
import axios from 'axios';
import Utils from '../Utils';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import CustomButton from '../Searchbar/CustomButton';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

class ClientStatsScreen extends Component {
  constructor() {
    super()
    
    this.state = {
      clientsOfDay: [],
      orderHistories: []
    }
  }

  componentDidMount() {
    this.props.setIsLoading(true)
    
    const promise1 = this.fetchOrderHistoryData()
    const promise2 = this.fetchClientsOfDay()

    Promise.all([promise1, promise2])
    .then((results) => {
        this.props.setIsLoading(false)
    })
  }

  fetchOrderHistoryData = async () => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_HOST_URL}/order-history/getAllWithinMonth`, {monthDate: new Date(), monthsBack: 1});
        this.setState({
          orderHistories: response.data,
        });
    } catch (error) {}
  };

  fetchClientsOfDay = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/client-crud/getDayOfTheWeekClients?dayIndex=${Utils.getDayIndex(new Date())}`);
        this.setState({
          clientsOfDay: response.data,
        });
    } catch (error) {}
  };

  getMissedClients = () => {
    const {clientsOfDay, orderHistories} = this.state

    let clientsWhoDidntOrder = []

    for(const clientNumber of clientsOfDay) {
      const previousClientOrders = orderHistories.filter(x => x.phoneNumber == clientNumber.phoneNumber)

      //Only consider regular clients who have ordered within 2 months
      if(previousClientOrders.length < 1) { continue; }

            console.log(clientNumber, previousClientOrders)

      //Check if regular client ordered today
      if(previousClientOrders.find(x => Utils.areSameDay(new Date(x.creationDate), new Date()))) {continue;}

      clientsWhoDidntOrder.push(clientNumber)
    }

    return clientsWhoDidntOrder
  }

  render() {
    const missedClients = this.getMissedClients()
    return (
      <div>
        <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>Clientes que no pidieron</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', height: '100vh', overflowY: 'auto' }}>
            {
              missedClients.map(x => 
                <div style={clientCardStyling}>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginBottom: '-2px'}}>{x.name}</p>
                    <CustomButton classStyle='btnGreen-clicked' width="35px" height="35px" iconSize={25} icon={faWhatsapp} link="stats/clients"/>
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
                      {x?.favoriteFoods?.length > 0 ?
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
    )
  }
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