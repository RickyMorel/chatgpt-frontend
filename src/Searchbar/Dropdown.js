import React, { Component } from 'react';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';

class Dropdown extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          selected: undefined
        };
    }

    handleChange = (name) => {
      const selectedObj = this.props.dropdownItems.find(x => x.name == name)

      this.setState({
        selected: selectedObj
      })

      this.props.handleChangeCallback(selectedObj)
    }

    render() {
        const { dropdownItems } = this.props;

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
            display: 'block',
            textAlign: 'center',
            outline: 'none',
            ...CssProperties.BodyTextStyle
        }

        return (
            <select style={styling} value={this.state?.selected?.name} onChange={(e) => this.handleChange(e.target.value)}>
              {
                dropdownItems && dropdownItems?.map(x => (
                  <option value={x.name} style={{...CssProperties.BodyTextStyle, color: ColorHex.TextBody}}>{x.name}</option>
                ))
              }
            </select>
        );
    }
}

export default Dropdown;