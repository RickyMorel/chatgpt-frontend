import React, { Component } from 'react';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import Utils from '../Utils';

class CustomTextArea extends Component {
    constructor(props) {
        super(props);    
        this.state = {
            input: ''
        };
    }

    componentDidMount() {
        this.setState({
            input: this.props.value
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props?.value !== prevProps?.value) {
            this.setState({
                input: this.props.value
            });
        }
    }

    handleChange = (event) => {
        const input = event.target.value;
        this.setState({ input }, () => {
            this.props.onChange(input);
        });
    };

    render() {
        const { 
            placeHolderText, 
            width, 
            height, 
            hasError, 
            noPadding = false, 
            canEdit = true 
        } = this.props;

        const styling = {
            backgroundColor: canEdit ? ColorHex.White : ColorHex.Background,
            color: ColorHex.TextBody,
            width: width ?? '800px',
            height: height ?? '150px',  // Increased default height for textarea
            borderRadius: '10px',
            boxShadow: hasError 
                ? `0px 5px 5px ${Utils.hexToRgba(ColorHex.RedFabri, 0.5)}` 
                : '0px 5px 5px rgba(0, 0, 0, 0.3)',
            border: hasError 
                ? `1px solid ${Utils.hexToRgba(ColorHex.RedFabri, 0.5)}` 
                : `1px solid ${ColorHex.BorderColor}`,
            padding: noPadding ? '0' : '12px',
            textAlign: 'left',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            ...CssProperties.SmallHeaderTextStyle,
        };

        return (
            <textarea 
                name='pointsUsed'
                value={this.state.input}
                placeholder={placeHolderText}
                className="validate"
                style={styling}
                onChange={this.handleChange}
                disabled={!canEdit}
                rows={5}  // Default number of visible rows
            />
        );
    }
}

export default CustomTextArea;