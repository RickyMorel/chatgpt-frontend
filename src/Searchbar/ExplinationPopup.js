import React, { Component } from 'react';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';

class ExplinationPopup extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { text, width, height} = this.props;

        const styling = {
          width: width ?? '272px',
          height: height ?? '86px',
          borderRadius: '10px',
          boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
          // border: `1px solid ${ColorHex.BorderColor}`,
          borderLeft: `1px solid ${ColorHex.BorderColor}`,
          borderRight: `1px solid ${ColorHex.BorderColor}`,
          borderBottom: `1px solid ${ColorHex.BorderColor}`,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '15px',
          paddingRight: '15px',
          paddingTop: '10px',
          paddingBottom: '10px',
          color: 'inherit',
          textAlign: 'center',
          textDecoration: 'none',
          ...CssProperties.BodyTextStyle,
          justifyContent: 'center',
          position: 'absolute',
          backgroundColor: ColorHex.White
        };

        const tailStyle = {
          content: '""',
          position: 'absolute',
          top: '-20px',  // Adjust the position of the tail
          left: '50%',
          transform: 'translateX(-50%)',
          width: '20px',
          height: '20px',
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderBottom: `10px solid ${ColorHex.White}`,  // The color should match the background of the box
        };
        

        return (
          <div style={styling}>
            <p style={{...CssProperties.BodyTextStyle, color: ColorHex.TextBody, textAlign: 'center'}}>{text}</p>
            <div style={tailStyle}></div>
          </div>
        );
    }
}

export default ExplinationPopup;