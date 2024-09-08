import React, { Component, useRef } from 'react';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import { es } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

class RemovableItem extends Component {
    render() {
        const { itemName, deleteCallback, width, height} = this.props;

        const styling = {
            backgroundColor: ColorHex.White,
            color: ColorHex.TextBody,
            width: width ?? '700px',
            height: height ?? '75px',
            borderRadius: '10px',
            boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
            border: `1px solid ${ColorHex.BorderColor}`,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '15px',
            paddingRight: '15px',
            textAlign: 'left',
            outline: 'none',
            ...CssProperties.SmallHeaderTextStyle,
          };

          const deleteButtonStyle = {
            backgroundColor: ColorHex.White,
            fontColor: ColorHex.TextBody,
            width: height ?? '75px',
            height: height ?? '75px',
            borderRadius: '10px',
            boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
            border: `1px solid ${ColorHex.BorderColor}`,
            position: 'relative',
            display: 'flex',   
            alignItems: 'center', 
            justifyContent: 'space-between', 
            paddingLeft: '15px',
            paddingRight: '15px',
            color: ColorHex.TextBody,
            textAlign: 'center',
            outline: 'none',
        }

        return (
            <div style={{display: 'flex', paddingBottom: '16px'}}>
                <div className="flex-grow-2" style={{paddingRight: '25px'}}>
                    <div style={styling}>{itemName}</div>
                </div>
                <div className="flex-grow-1">
                    <button onClick={() => deleteCallback(itemName)} style={deleteButtonStyle}>
                        <i className='material-icons' style={{ fontSize: '40px'}}>delete</i>
                    </button>
                </div>
            </div>
        );
    }
}

export default RemovableItem;