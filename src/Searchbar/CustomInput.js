import React, { Component, useRef } from 'react';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import { es } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

class CustomInput extends Component {
    constructor(props) {
        super(props);    
        this.state = {
            input: ''
        };
        this.datePickerRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if(this.props?.value == prevProps?.value) {return;}

        this.setState({
            input: this.props.value
        });
    }

    handleChange = (event, onChange) => {
        const input = event.target.value;
        this.setState({ input }, () => {
            onChange(input)
        });
    };

    render() {
        const { placeHolderText, dataType, onChange, width, height } = this.props;

        console.log("this.props.value", this.props.value)

        const styling = {
            backgroundColor: ColorHex.White,
            color: ColorHex.TextBody,
            width: width ?? '800px',
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
            textAlign: 'center',
            outline: 'none',
            ...CssProperties.SmallHeaderTextStyle,
          };

        return (
            <input name='pointsUsed' type={dataType} value={this.state.input} placeholder={placeHolderText} class="validate" style={styling} onChange={(e) => this.handleChange(e, onChange)}/>
        );
    }
}

export default CustomInput;