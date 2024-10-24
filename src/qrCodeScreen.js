import React, { Component } from 'react';
import { Circles, ColorRing, RotatingSquare } from 'react-loader-spinner';
import { ColorHex } from './Colors';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import CssProperties from './CssProperties';

class QrCodeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      qr: null
    };
  }

  componentDidMount() {
    this.GetInstanceQR()

    this.intervalId = setInterval(this.GetInstanceQR, 15000);
  }

  GetInstanceQR = async () => {
    console.log("Get new QR")
    try {
      this.setState({
        qr: null
      })

      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/whatsapp/getInstanceQR`);

      this.setState({
        qr: response.data.qrCode
      })
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
            <QRCodeCanvas
            value={this.state.qr}
            size={256} 
            bgColor="#ffffff"
            fgColor="#000000"
            level="L" // Error correction level: L, M, Q, H
          />
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
