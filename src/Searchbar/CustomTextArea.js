import React, { Component } from 'react';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import Utils from '../Utils';
import ExplinationPopup from './ExplinationPopup';

class CustomTextArea extends Component {
    constructor(props) {
        super(props);    
        this.state = {
            input: '',
            showPopup: false
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

    handleMouse = (hasEntered) => {
        if(!this.props.explinationText) {return;}

        this.setState({ showPopup: hasEntered})
    }

    render() {
        const { placeHolderText, width, height, hasError, noPadding = false, canEdit = true ,explinationText} = this.props;

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
            <div onMouseEnter={() => this.handleMouse(true)} onMouseLeave={() => this.handleMouse(false)}>
                <textarea 
                    name='pointsUsed'
                    value={this.state.input}
                    placeholder={placeHolderText}
                    className="validate"
                    style={styling}
                    onChange={this.handleChange}
                    disabled={!canEdit}
                    rows={5} 
                />
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
        );
    }
}

export default CustomTextArea;