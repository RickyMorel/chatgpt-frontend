import React, { Component } from 'react';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import '../SideNav.css';

class CustomButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { text, icon, onClickCallback } = this.props;

        const styling = {
            width: 'auto', // Adjust width based on content
            height: '45px',
            borderRadius: '10px',
            boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
            border: `1px solid ${ColorHex.BorderColor}`,
            display: 'flex',   
            alignItems: 'center', 
            paddingLeft: '15px',
            paddingRight: '15px',
            paddingTop: '10px',
            paddingBottom: '10px',
            whiteSpace: 'nowrap',
            color: ColorHex.TextBody,
            textAlign: 'center',
            ...CssProperties.BodyTextStyle,
        };

        return (
            <button onClick={onClickCallback} style={styling} className='nav-item'>
                <i className='material-icons' style={{fontSize: '25px', marginRight: '10px'}}>{icon}</i>
                <div>{text}</div>
            </button>
        );
    }
}

export default CustomButton;