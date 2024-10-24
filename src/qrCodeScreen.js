import React, { Component } from 'react';
import { Circles, ColorRing, RotatingSquare } from 'react-loader-spinner';
import { ColorHex } from './Colors';
import axios from 'axios';

class QrCodeScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.GetInstanceQR()
  }

  GetInstanceQR = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/whatsapp/getInstanceQR`);
      console.log("response", response)
      this.setState({
        instanceStatus: response.data.accountStatus.status,
      })
    } catch (error) {
      this.props.showPopup(new Error(error.response.data.message))
    }
  };

  render() {
    const overlayStyles = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      zIndex: 9999, 
    };
    
    
    return (
        <div style={overlayStyles}>
            <h4>Conecta tu Whatsapp usando el QR</h4>
        </div>
    );
  }
}

export default QrCodeScreen;
