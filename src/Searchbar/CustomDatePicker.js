import React, { Component } from 'react';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import { es } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import Utils from '../Utils';

class CustomDatePicker extends Component {
    constructor(props) {
        super(props);    
        this.state = {};
        this.datePickerRef = React.createRef();
    }

    handleOpenDatePicker = () => {
        if (this.datePickerRef.current) {
            this.datePickerRef.current.setFocus(); // Programmatically open DatePicker
        }
    };

    render() {
        const { selected, onChange, width, height, hasError, iconSize, maxDate, minDate, includeButton = true} = this.props;

        const styling = {
            backgroundColor: ColorHex.White,
            color: ColorHex.TextBody,
            width: width ?? '700px',
            height: height ?? '75px',
            borderRadius: '10px',
            boxShadow: hasError ? `0px 5px 5px ${Utils.hexToRgba(ColorHex.RedFabri, 0.5)}` : '0px 5px 5px rgba(0, 0, 0, 0.3)',
            border: hasError ? `1px solid ${Utils.hexToRgba(ColorHex.RedFabri, 0.5)}` : `1px solid ${ColorHex.BorderColor}`,
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

        const dateButtonStyle = {
            backgroundColor: ColorHex.White,
            fontColor: ColorHex.TextBody,
            width: height ?? '75px',
            height: height ?? '75px',
            borderRadius: '10px',
            boxShadow: hasError ? `0px 5px 5px ${Utils.hexToRgba(ColorHex.RedFabri, 0.5)}` : '0px 5px 5px rgba(0, 0, 0, 0.3)',
            border: hasError ? `1px solid ${Utils.hexToRgba(ColorHex.RedFabri, 0.5)}` : `1px solid ${ColorHex.BorderColor}`,
            position: 'relative',
            display: 'flex',   
            alignItems: 'center', 
            justifyContent: 'center', 
            paddingLeft: '15px',
            paddingRight: '15px',
            color: ColorHex.TextBody,
            textAlign: 'center',
            outline: 'none',
        };

        const datePicker = 
        <DatePicker
            id="datepicker"
            dateFormat="dd/MM/yy"
            selected={selected}
            onChange={onChange}
            locale={es}
            maxDate={maxDate} // Set the max selectable date
            minDate={minDate}
            customInput={<input style={styling} />}
            popperPlacement="bottom-start"
            ref={this.datePickerRef}
        />;

        const html = 
        includeButton ? 
            <div style={{display: 'flex'}}>
                <div className="flex-grow-2" style={{paddingRight: '25px'}}>
                    {datePicker}
                </div>
                <div className="flex-grow-1">
                    <button onClick={this.handleOpenDatePicker} style={dateButtonStyle}>
                        <FontAwesomeIcon icon={faCalendarDays} style={{ fontSize: iconSize ?? '40px' }}/>
                    </button>
                </div>
            </div>
        : 
        datePicker;

        return html;
    }
}

export default CustomDatePicker;
