import React, { Component, useRef } from 'react';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import "react-datepicker/dist/react-datepicker.css";

class CustomScroll extends Component {
    constructor(props) {
        super(props);    
        this.state = {
            input: ''
        };
        this.datePickerRef = React.createRef();
    }

    handleChange = (event, onChange) => {
        const input = event.target.value;
        this.setState({ input }, () => {
            onChange(input)
        });
    };

    render() {
        const { blocks, panelIncluded } = this.props;

        const orderPanelStyling = {
            width: '100%',
            height: '50vh',
            marginTop: '10px',
            marginTop: '25px',
            padding: '25px',
            boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
            border: `1px solid ${ColorHex.BorderColor}`,
            borderRadius: '10px',
            backgroundColor: ColorHex.White
          }

        const scrollStyle = {
            borderRadius: '10px',
            backgroundColor: ColorHex.Background,
            padding: '10px',
            boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.3)',
            overflowY: 'scroll', 
            height: '95%',
            width: '100%',
            // overflowX: 'hidden',
            alignItems: 'center'
        }

        return (
            panelIncluded ? (
                <div style={orderPanelStyling}>
                    <div style={scrollStyle}>
                        {blocks}
                    </div>
                </div>
            ) :
            (
                <div style={scrollStyle}>
                    {blocks}
                </div>
            )
        );
    }
}

export default CustomScroll;