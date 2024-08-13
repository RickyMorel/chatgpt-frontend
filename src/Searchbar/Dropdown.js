import React, { Component } from 'react';
import { ColorHex } from '../Colors';

class Dropdown extends Component {
    constructor(props) {
        super(props);
    
        this.state = {

        };
    }

    render() {
        const { searchText, handleChangeCallback, itemList } = this.props;

        const searchBarStyling = {
            backgroundColor: ColorHex.White,
            fontColor: ColorHex.TextBody,
            width: '292px',
            height: '45px',
            borderRadius: '10px',
            boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
            border: `1px solid ${ColorHex.BorderColor}`,
            position: 'relative',
            display: 'flex',      // Use flexbox for centering
            alignItems: 'center', // Vertically center the children
            justifyContent: 'space-between', // Space between input and icon
            paddingLeft: '15px',
            paddingRight: '15px'
        }

        return (
            <select style={{display: 'block', ...searchBarStyling}} value={"option1"} onChange={(e) => this.handleChangeCallback(e.target.value)}>
              {
                itemList && itemList?.map(x => (
                  <option value={x}>{x}</option>
                ))
              }
            </select>
        );
    }
}

export default Dropdown;