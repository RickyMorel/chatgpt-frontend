import React, { Component } from 'react';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import '../SideNav.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ExplinationPopup from './ExplinationPopup';

class CustomButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showPopup: false
        };
    }

    handleMouse = (hasEntered) => {
        if(!this.props.explinationText) {return;}

        this.setState({ showPopup: hasEntered})
    }

    render() {
        const { text, icon, onClickCallback, link, width, height, classStyle, iconSize, linkData, explinationText = undefined, disabled = false } = this.props;

        const styling = {
            width: width ?? 'auto',
            height: height ?? '45px',
            borderRadius: '10px',
            boxShadow: !disabled ? '0px 5px 5px rgba(0, 0, 0, 0.3)' : '',
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
            justifyContent: 'center',
        };

        const iconHtml = text ? 
        (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <FontAwesomeIcon icon={icon} style={{ fontSize: iconSize ?? '25px', marginRight: '10px', color: !disabled ? 'inherit' : ColorHex.GreyFabri}} />
                <div style={{color: !disabled ? 'inherit' : ColorHex.GreyFabri}}>{text}</div>
            </div>
        )
        :
        (
            <FontAwesomeIcon icon={icon} style={{ fontSize: iconSize ?? '40px' }}/>
        )

        return (
            link ? (
                <Link to={{pathname: `/${link}`, state: {linkData} }} style={styling} className={classStyle ?? 'nav-item'}>
                    {iconHtml}
                </Link>
            ) : (
                <div>
                    <button onMouseEnter={() => this.handleMouse(true)} onMouseLeave={() => this.handleMouse(false)}onClick={onClickCallback} disabled={disabled} style={styling} className={!disabled ? classStyle ?? 'nav-item' : ''}>
                        {iconHtml}
                    </button>
                    {
                        this.state.showPopup == true ? 
                        <ExplinationPopup 
                            width={width} 
                            height={"auto"} 
                            text={this.props?.explinationText} 
                        />
                        :
                        <></>
                    }
                </div>
            )
        );
    }
}

export default CustomButton;