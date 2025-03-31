import React, { Component } from 'react'
import CssProperties from '../CssProperties';
import { ColorHex } from '../Colors';
import CustomInput from './CustomInput';
import CountryDropdown from './CountryDropdown';
import HttpRequest from '../HttpRequest';

class PhoneNumberComponent extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          countryCode: '595',
          nationalNumber: '',
          error: ''
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.value == prevProps.value) { return; }

        const phoneNumber = this.props.value

        if(phoneNumber.length < 1) { return; }

        console.log("componentDidUpdate", phoneNumber)

        const splitValues = [phoneNumber.slice(0, 3), phoneNumber.slice(3)];
        
        this.setState({
            countryCode: splitValues[0],
            nationalNumber: splitValues[1]
        }); 
    }

    handleChange = (property ,value, OnChangeCallback) => {
        if(property == "countryCode" && value) 
        { 
            console.log("Change countryCode", value)
            this.setState({countryCode: value.code}); 
            OnChangeCallback(value?.code?.replaceAll("+", "")  + this.state.nationalNumber) 
        }
        else if(property == "nationalNumber") 
        { 
            console.log("Change National Number", value)
            this.setState({nationalNumber: value}); 
            OnChangeCallback(this.state?.countryCode?.replaceAll("+", "")  + value) 
        }
    }

    static confirmIfNumberAlreadyExists = async (number) => {
        try {
          console.log("number", number)
          const response = await HttpRequest.get(`/global-config/exists?phoneNumber=${number}`, true);
          console.log("user logged in", number, response.data)
          return response.data
        } catch(err) { console.log("configWithNumberAlreadyExists ERROR", err)}
    }

    render() {
        const { error, countryCode, nationalNumber } = this.state;
        const { OnChangeCallback, hasError } = this.props

        return (
          <>
            <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginTop: '15px'}}>Número que usará WhatsBot para responder</p>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <CountryDropdown value={countryCode} OnChange={(value) => this.handleChange("countryCode", value, OnChangeCallback)}/>
              </div>
              
              <CustomInput 
                hasError={hasError.includes("phoneNumber_exists") || hasError.includes("phoneNumber_empty")}
                width='264px'
                height='65px'
                dataType="tel" 
                placeHolderText="971602289" 
                value={nationalNumber}
                onChange={(value) => this.handleChange('nationalNumber', value, OnChangeCallback)}
              />
            </div>
          </>
        );
    }
}

export default PhoneNumberComponent