import React, { Component } from 'react'
import CustomButton from '../Searchbar/CustomButton'
import CssProperties from '../CssProperties'
import { ColorHex } from '../Colors'

export class LandingPageNavbar extends Component {
  render() {
    return (
        <nav className="navbar">
            <div className="container">
                <div className="nav-content">
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '-50px'}}>
                    <img src='./images/icon.png' alt="Logo" className="img-fluid" style={{ width: '50px', height: "50px"  }} />
                    <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.GreenDark_1, fontWeight: 'bold', marginTop: '15px', marginLeft: '10px'}}>WhatsBot</p>
                </div>
                <div style={{ marginLeft: '1000px' }}><CustomButton text="Comienza la prueba gratuita" width="250px" height="45px" classStyle="btnGreen-clicked" link="login"/></div>
                </div>
            </div>
        </nav>
    )
  }
}

export default LandingPageNavbar