import React, { Component } from 'react';
import { Circles, ColorRing, RotatingSquare } from 'react-loader-spinner';
import { ColorHex } from './Colors';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import CssProperties from './CssProperties';
import HttpRequest from './HttpRequest';
import Utils from './Utils';

class QrCodeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      qr: null
    };

    this.intervalId = null
  }

  componentDidMount() {
    this.GetInstanceQR()

    this.intervalId = setInterval(this.GetInstanceQR, 25000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  GetInstanceQR = async () => {
    try {
      this.setState({
        qr: null
      })

      const newInstanceResponse = await this.ReInitInstance();

      // const response = await HttpRequest.get(`/whatsapp/getInstanceQR`);
      // console.log("Get new QR", response)

      // if(response.data.qrcode.length < 3) {
      //   // setTimeout(() => {
      //   //   this.GetInstanceQR(); 
      //   // }, 4000); 
      //   return; 
      // }

      this.setState({
        qr: newInstanceResponse.qrcode
      })
    } catch (error) {
      console.log("error", error)
    }
  };

  ReInitInstance = async () => {
    try {
      this.setState({
        qr: null
      })

      const response = await HttpRequest.post(`/whatsapp/initInstance`);
      console.log("Restaring instance...", response)
      return response.data
    } catch (error) {
      console.log("error", error)
    }
  };

  render() {
    const {status} = this.props

    const overlayStyles = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      zIndex: 9999,
    };

    const scanQrHtml = 
    <>
      <div style={{marginBottom: '50px'}}>
        {
          this.state.qr != null ?
          <img src={this.state.qr} alt="QR Code" className="w-60 h-60" />
          :
          <ColorRing
            visible={true}
            height="200"
            width="200"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={[ColorHex.First, ColorHex.Fifth, ColorHex.Second, ColorHex.Third, '#849b87']}
          />
        }
      </div>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
        <img 
          src='./images/whatsapplogo.png' 
          alt="Logo" 
          className="img-fluid" 
          style={{ width: '65px', height: '65px'}} 
        />
        <h4 style={{ margin: 0, ...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody }}>Conecta tu Whatsapp usando el QR</h4>
      </div>
      <h3 style={{ margin: 0, ...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody }}>Despues de vincular, recargue la página</h3>
    </>

    const loadingHtml = 
    <>
      <ColorRing
        visible={true}
        height="200"
        width="200"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={[ColorHex.First, ColorHex.Fifth, ColorHex.Second, ColorHex.Third, '#849b87']}
      />
      <h4 style={{ margin: 0, ...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody }}>Vinculando...</h4>
    </>

    console.log("QR CODE", this.state.qr)
    
    
    return (
        <div style={overlayStyles}>
          {
            status == "loading" ?
            loadingHtml
            :
            scanQrHtml
          }
        </div>
    );
  }
}

export default QrCodeScreen;
