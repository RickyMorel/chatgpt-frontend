import React, { Component, useRef } from 'react';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import { es } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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
        const { selected, onChange } = this.props;

        const styling = {
            backgroundColor: ColorHex.White,
            fontColor: ColorHex.TextBody,
            width: '292px',
            height: '45px',
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
            ...CssProperties.BodyTextStyle
          };

          const dateButtonStyle = {
            backgroundColor: ColorHex.White,
            fontColor: ColorHex.TextBody,
            width: '75px',
            height: '75px',
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
            <div className="row">
                <div className="col-10">
                    <DatePicker
                        id="datepicker"
                        dateFormat="dd/MM/yy"
                        selected={selected}
                        onChange={onChange}
                        locale={es}
                        customInput={<input style={styling} />}
                        popperPlacement="bottom-start"
                        ref={this.datePickerRef}
                    />  
                </div>
                <div className="col-2">
                    <button onClick={this.handleOpenDatePicker} style={{ marginBottom: '10px' }}>
                        Open DatePicker
                    </button>
                </div>
            </div>
        );
    }
}

export default CustomDatePicker;