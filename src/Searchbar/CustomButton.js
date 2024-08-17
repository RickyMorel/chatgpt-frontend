import React, { Component } from 'react';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import '../SideNav.css';
import { Link } from 'react-router-dom';

class CustomButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { text, icon, onClickCallback, link, width, height } = this.props;

        const styling = {
            width: width ?? 'auto', // Adjust width based on content
            height: height ?? '45px',
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
            color: 'inherit',
            textAlign: 'center',
            textDecoration: 'none', 
            ...CssProperties.BodyTextStyle,
            justifyContent: 'center'
        };

        const iconHtml = text ? 
        (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <i className='material-icons' style={{ fontSize: '25px', marginRight: '10px' }}>{icon}</i>
                <div>{text}</div>
            </div>
        )
        :
        (
            <i className='material-icons' style={{ fontSize: '40px' }}>{icon}</i>
        )

        return (
            link ? (
                <Link to={link} style={styling} className='nav-item'>
                    {iconHtml}
                </Link>
            ) : (
                <button onClick={onClickCallback} style={styling} className='nav-item'>
                    <i className='material-icons' style={{ fontSize: '40px', alignSelf: 'center' }}>{icon}</i>
                </button>
            )
        );
    }
}

export default CustomButton;