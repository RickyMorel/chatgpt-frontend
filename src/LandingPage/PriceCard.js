import React, { Component } from 'react';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';

class PriceCard extends Component {
    constructor() {
        super();
        this.state = {
            isHovered: false
        };
    }

    render() {
        const bulletPoints = [
            `1000 messages/month`,
            `24/7 Automated Responses`,
            `Quick WhatsApp integration`,
            `Real-Time Analytics`,
            `Easy, Self-Service Setup`,
            `Dedicated Support`,
        ]

        const bulletPointsHTML = bulletPoints.map((bulletPoint, index) => 
            <li key={index} style={listItemStyle}>
                <img width="20" height="20" src={"images/tick.png"} className="circle responsive-img" style={{marginRight: '5px'}}/>
                <div style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody}}>{bulletPoint}</div>
            </li> 
        );

        return (
            <div 
                style={{
                    ...cardContainerStyle,
                    boxShadow: this.state.isHovered ? '0 8px 16px rgba(0, 0, 0, 0.2)' : cardContainerStyle.boxShadow,
                    transform: this.state.isHovered ? 'translateY(-10px)' : 'none'
                }}
                onMouseEnter={() => this.setState({ isHovered: true })}
                onMouseLeave={() => this.setState({ isHovered: false })}
            >
                <div style={badgeStyle}>$3.19 Per Day</div>

                <h1 style={titleStyle}>Starter Pack</h1>

                <div style={pricingContainerStyle}>
                    <span style={originalPriceStyle}>$149</span>
                    <span style={currentPriceStyle}>$99</span>
                    <span style={{...CssProperties.SmallHeaderTextStyle}}>/month</span>
                    <div style={billedAnnuallyStyle}>Billed annually</div>
                </div>

                <hr style={{color: ColorHex.TextBody, marginTop: '5px', marginBottom: '-5px', width: '300px', borderTop: '3px solid ' + ColorHex.TextBody}}/>

                <p style={descriptionStyle}>
                    The smartest way to automate customer interactions and enhance engagement effortlessly.
                    Ideal for growing businesses.
                </p>

                <ul style={listStyle}>
                    {bulletPointsHTML}
                </ul>
            </div>
        );
    }
}

const cardContainerStyle = {
    maxWidth: '400px',
    height: '480px',
    border: `10px solid ${ColorHex.GreenDark_1}`,
    borderRadius: '20px', 
    fontFamily: 'sans-serif',
    position: 'relative',
    padding: '0px 15px 0px 15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0px 15px 15px rgba(0, 0, 0, 0.5)',
};

const badgeStyle = {
    position: 'absolute',
    top: '-30px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#66bb6a',
    color: '#fff',
    borderRadius: '16px',
    padding: '4px 12px',
    fontWeight: '600',
    fontSize: '0.85rem',
    ...CssProperties.SmallHeaderTextStyle,
  };

  const titleStyle = {
    margin: '15px 0 10px',
    textAlign: 'center',
    fontSize: '1.5rem',
    ...CssProperties.LargeHeaderBoldTextStyle,
  };

  const pricingContainerStyle = {
    textAlign: 'center',
  };

  const originalPriceStyle = {
    textDecoration: 'line-through',
    marginRight: '8px',
    color: '#999',
    fontSize: '1rem',
    fontWeight: '400',
    ...CssProperties.SmallHeaderTextStyle,
  };

  const currentPriceStyle = {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#333',
    marginRight: '4px',
    ...CssProperties.MediumHeaderBoldTextStyle,
  };

  const billedAnnuallyStyle = {
    fontSize: '0.9rem',
    color: '#888',
    backgroundColor: ColorHex.GreenDark_1,
    borderRadius: '20px',
    color: ColorHex.White,
    height: '30px',
    textAlign: 'center',
    paddingTop: '3px',
    marginTop: '5px',
    marginBottom: '5px',
    ...CssProperties.BodyTextStyle,
  };

  const descriptionStyle = {
    fontSize: '0.9rem',
    lineHeight: '1.4',
    margin: '15px 0',
    color: '#555',
    textAlign: 'center',
    ...CssProperties.BodyTextStyle,
    color: ColorHex.TextBody
  };

  const listStyle = {
    listStyleType: 'none',
    padding: 0,
    margin: '0 0 16px',
    display: 'flex',
    flexDirection: 'column',
  };

  const listItemStyle = {
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
  };

export default PriceCard;