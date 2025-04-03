import React, { Component } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import Utils from '../Utils';
import ExplinationPopup from './ExplinationPopup';

class CustomInput extends Component {
    constructor(props) {
        super(props);    
        this.state = {
            input: '',
            showPopup: false
        };
        this.datePickerRef = React.createRef();
    }

    componentDidMount() {
        this.setState({
            input: this.props.value
        });
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

    handleMouse = (hasEntered) => {
        if(!this.props.explinationText) {return;}

        this.setState({ showPopup: hasEntered})
    }

    render() {
        const { placeHolderText, explinationText, dataType, onChange, width, height, hasError, noPadding = false, canEdit = true } = this.props;

        const styling = {
            backgroundColor: canEdit ? ColorHex.White : ColorHex.Background,
            color: ColorHex.TextBody,
            width: width ?? '800px',
            height: height ?? '75px',
            borderRadius: '10px',
            boxShadow: hasError ? `0px 5px 5px ${Utils.hexToRgba(ColorHex.RedFabri, 0.5)}` : '0px 5px 5px rgba(0, 0, 0, 0.3)',
            border: hasError ? `1px solid ${Utils.hexToRgba(ColorHex.RedFabri, 0.5)}` : `1px solid ${ColorHex.BorderColor}`,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: noPadding ? '15px' : '0px',
            paddingRight: noPadding ? '15px' : '0px',
            textAlign: 'center',
            outline: 'none',
            marginBottom: '10px',
            ...CssProperties.SmallHeaderTextStyle,
          };

        return (
            canEdit ?
            <div onMouseEnter={() => this.handleMouse(true)} onMouseLeave={() => this.handleMouse(false)}>
                <input name='pointsUsed' type={dataType} value={this.state.input} placeholder={placeHolderText} class="validate" style={styling} onChange={(e) => this.handleChange(e, onChange)}/>
                {
                    this.state.showPopup == true ? 
                    <ExplinationPopup 
                        width={width} 
                        height={"auto"} 
                        text={explinationText} 
                    />
                    :
                    <></>
                }
            </div>
            :
            <input disabled name='pointsUsed' type={dataType} value={this.state.input} placeholder={placeHolderText} class="validate" style={styling} onChange={(e) => this.handleChange(e, onChange)}/>
        );
    }
}

export default CustomInput;