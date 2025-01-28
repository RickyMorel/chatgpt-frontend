import React from 'react';
import { Color, ColorHex } from '../Colors';
import './styles.css';
import CssProperties from '../CssProperties';

class ProblematicChatComponent extends React.Component {

    getTime = (date) => {
        const reactDate = new Date(date * 1000);
        const hours = reactDate.getHours();
        const minutes = reactDate.getMinutes();

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    }

    render() {
        const {data, index} = this.props

        const alertIconColor = data.attended == true ? "#f2f0f0" : "#bd3020"
        return (
        <div className="row" style={trStyle}>
            <div className="col-1">
                <span style={trTextStyle}>{index}</span>
            </div>
            <div className="col-2">
                <span style={trTextStyle}>{data.clientName}</span>
            </div>
            <div className="col-5">
                <span style={trTextStyle}>{data.chatDescription}</span>
            </div>
            <div className="col-1">
                <span style={trTextStyle}>{this.getTime(data.createdDate)}</span>
            </div>
            <div className="col-2">
                <a style={trTextStyle} href={"https://wa.me/" + data.phoneNumber} target="_blank" rel="noopener noreferrer" className="underlined-link">{data.phoneNumber}</a>
            </div>
            <div className="col-1">
                <i style={{ color: alertIconColor }} className={`material-icons flicker`}>
                    brightness_1
                </i>
            </div>
        </div>
        );
    }
}

const trStyle = {
  borderRadius: '10px',
  backgroundColor: ColorHex.White,
  boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
  border: `1px solid ${ColorHex.BorderColor}`,
  height: '70px',
  width: '100%',
  alignItems: 'center',
  marginBottom: '12px',
  display: 'flex',
  marginLeft: '5px',
  textAlign: 'center',
}

const trTextStyle = {
    textAlign: 'center',
  ...CssProperties.BodyTextStyle,
  color: ColorHex.TextBody,
  textAlign: 'center',
  marginTop: '12px'
}

export default ProblematicChatComponent;