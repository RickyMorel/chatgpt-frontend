import React, { Component } from 'react'
import { ColorHex } from '../Colors'
import CssProperties from '../CssProperties'

class StatCard extends Component {  
  render() {
    const {title, amountColor, amountFunction} = this.props

    const orderAmountCardStyling = {
        width: '215px',
        height: '72px',
        marginTop: '10px',
        alignItems: 'center',
        padding: '10px',
        boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
        border: `1px solid ${ColorHex.BorderColor}`,
        borderRadius: '12px',
        backgroundColor: ColorHex.White
    }

    return (
        <div style={orderAmountCardStyling}>
            <div class="text-center">
            <p style={{...CssProperties.BodyTextStyle, color: ColorHex.TextBody, marginTop: '1px'}}>{title}</p>
            <p style={{...CssProperties.SmallHeaderTextStyle, color: amountColor, marginTop: '-16px'}}>{amountFunction()}</p>
            </div>
        </div>
    )
  }
}

export default StatCard