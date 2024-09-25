import React, { Component } from 'react';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import Select from 'react-select';
import Utils from '../Utils';

class CustomSelect extends Component {
    constructor(props) {
        super(props);    
        this.state = {};
    }

    render() {
        const { options, onChange, value, isSearchable, placeHolderText, width, height, hasError, isMulti = false } = this.props;

        const customStyles = {
            control: (provided) => ({
              ...provided,
              backgroundColor: ColorHex.White,
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
              paddingLeft: '15px',
              paddingRight: '15px',
              textAlign: 'center',
              outline: 'none',
              ...CssProperties.BodyTextStyle,
            }),
            menu: (provided) => ({
              ...provided,
              width: width ?? '800px',
              borderRadius: '10px',
              boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
              border: `1px solid ${ColorHex.BorderColor}`,
            }),
            option: (provided, state) => ({
              ...provided,
              color: state.isSelected ? ColorHex.White : ColorHex.TextBody,
              backgroundColor: state.isSelected ? ColorHex.TextBody : ColorHex.White,
              textAlign: 'center',
              '&:hover': {
                backgroundColor: ColorHex.TextBody,
                color: ColorHex.White,
              },
            }),
            singleValue: (provided) => ({
              ...provided,
              color: ColorHex.TextBody,
            }),
            dropdownIndicator: (provided) => ({
                ...provided,
                padding: '0', // Remove padding around the icon
                width: height ?? '75px',
                height: height ?? '75px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                svg: {
                  width: height ?? '75px',
                  height: height ?? '75px',
                },
              }),
              indicatorSeparator: () => ({
                display: 'none',
              }),
          };

        return (
            <Select
                placeholder={placeHolderText}
                options={options}
                onChange={onChange}
                value={value}
                isSearchable={isSearchable}
                styles={customStyles}
                isMulti={isMulti}
            />
        );
    }
}

export default CustomSelect;