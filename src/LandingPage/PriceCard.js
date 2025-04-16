import React, { Component } from 'react';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import Utils from '../Utils';

class PriceCard extends Component {
    constructor() {
        super();
        this.state = {
            isHovered: false
        };
    }

    render() {
        const { data } = this.props

        const bulletPoints = [
            `${Utils.formatNumber(data.messageAmount)} mensajes/mes`,
            `Respuestas automáticas 24/7`,
            `Integración rápida con WhatsApp`,
            `Análisis en tiempo real`,
            `Configuración fácil y autogestionada`,
            `Soporte dedicado`,
        ]

        const bulletPointsHTML = bulletPoints.map((bulletPoint, index) => 
            <li key={index} style={listItemStyle}>
                <img 
                    width="20" 
                    height="20" 
                    src="images/tick.png" 
                    style={{ 
                        marginRight: '5px',
                        width: 'clamp(16px, 4vw, 20px)',
                        height: 'auto' 
                    }}
                />
                <div style={{...CssProperties.BodyBoldTextStyle, color: ColorHex.TextBody}}>
                    {bulletPoint}
                </div>
            </li> 
        );

        return (
            <div 
                style={{
                    ...cardContainerStyle(data.cardColor),
                    boxShadow: this.state.isHovered ? '0 8px 16px rgba(0, 0, 0, 0.2)' : cardContainerStyle.boxShadow,
                    transform: this.state.isHovered ? 'translateY(-10px)' : 'none'
                }}
                onMouseEnter={() => this.setState({ isHovered: true })}
                onMouseLeave={() => this.setState({ isHovered: false })}
            >
                <div style={badgeStyle(data.cardColor)}>
                    ${(data.discountedPrice / 31).toFixed(2).toString()} Por Dia
                </div>

                <h1 style={titleStyle}>{data.packName}</h1>

                <div style={pricingContainerStyle}>
                    <span style={originalPriceStyle}>${data.price}</span>
                    <span style={currentPriceStyle}>${data.discountedPrice}</span>
                    <span style={{...CssProperties.SmallHeaderTextStyle}}>/mes</span>
                    <div style={billedAnnuallyStyle(data.cardColor)}>Facturado anualmente</div>
                </div>

                <hr style={{
                    color: ColorHex.TextBody,
                    marginTop: '5px',
                    marginBottom: '-5px',
                    width: '80%',
                    maxWidth: '300px',
                    borderTop: '3px solid ' + ColorHex.TextBody
                }}/>

                <p style={descriptionStyle}>
                    {data.description}
                </p>

                <ul style={listStyle}>
                    {bulletPointsHTML}
                </ul>
            </div>
        );
    }
}

const cardContainerStyle = (cardColor) => ({
    width: '100%',
    maxWidth: '400px',
    minHeight: '480px',
    border: `10px solid ${cardColor}`,
    borderRadius: '20px', 
    fontFamily: 'sans-serif',
    position: 'relative',
    padding: '0px 15px 0px 15px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0px 15px 15px rgba(0, 0, 0, 0.5)',
});

const badgeStyle  = (cardColor) => ({
    position: 'absolute',
    top: '-25px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: cardColor,
    color: '#fff',
    borderRadius: '16px',
    padding: '4px 12px',
    fontWeight: '600',
    fontSize: 'clamp(0.75rem, 3vw, 0.85rem)',
    ...CssProperties.SmallHeaderTextStyle,
    whiteSpace: 'nowrap'
});

const titleStyle = {
    margin: '15px 0 10px',
    textAlign: 'center',
    fontSize: 'clamp(1.25rem, 5vw, 1.5rem)',
    ...CssProperties.LargeHeaderBoldTextStyle,
};

const billedAnnuallyStyle = (cardColor) => ({
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
    color: '#888',
    backgroundColor: cardColor,
    borderRadius: '20px',
    color: ColorHex.White,
    height: '30px',
    textAlign: 'center',
    paddingTop: '3px',
    margin: '5px auto',
    width: '80%',
    maxWidth: '200px',
    ...CssProperties.BodyTextStyle,
});

const descriptionStyle = {
    fontSize: 'clamp(0.85rem, 3vw, 0.9rem)',
    lineHeight: '1.4',
    margin: '15px 0',
    color: ColorHex.TextBody,
    textAlign: 'center',
    ...CssProperties.BodyTextStyle
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