import React, { useEffect, useState } from 'react';
import twemoji from 'twemoji';
import CssProperties from '../CssProperties';
import { ColorHex } from '../Colors';
import Utils from '../Utils';

const CountryDropdown = ({OnChange, value}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    if(!value.includes("+")) { value = "+" + value}
    
    let country = Utils.countries.find(x => x.code == value)
    setCountry(country, false)
  }, [value])

  const setCountry = (country, userChanged=true) => {
    if(userChanged) { OnChange(country) }
    setSelectedCountry(country);
    setIsOpen(false);
  }

  const optionHtml = (country, showAllData = false) => {
    return (
        country &&
        <>
            <span style={{
                display: 'inline-block',
                width: '35px',
                height: '35px',
                marginRight: '10px',
            }} 
            dangerouslySetInnerHTML={{
                __html: twemoji.parse(country?.flag, {
                folder: 'svg',
                ext: '.svg',
                base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/'
                })
            }} />
            {showAllData ? <span style={{ flex: 1 }}>{country.name}</span> : <></>}
            <span>{country?.code}</span>
        </>
    )
  }

  return (
    <div style={styling}>
      <div
        style={dropdownStyle}
        onClick={() => setIsOpen(!isOpen)}
      >
        {optionHtml(selectedCountry ? selectedCountry : Utils.countries[0])}
      </div>
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          width: '250px',
          border: '1px solid #ccc',
          background: 'white',
          zIndex: 1000,
          marginTop: '5px'
        }}>
          {Utils.countries.map((country) => (
            <div
              key={country.code}
              style={{
                padding: '10px',
                cursor: 'pointer',
                display: 'flex',
                gap: '10px',
                alignItems: 'center'
              }}
              onClick={() => {
                setCountry(country)
              }}
            >
                {optionHtml(country, true)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const dropdownStyle = {
    width: '105px',
    height: '60px',
    padding: '10px',
    border: '1px solid #ccc',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  }

const styling = {
    backgroundColor: ColorHex.White,
    color: ColorHex.TextBody,
    borderRadius: '10px',
    boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
    border: `1px solid ${ColorHex.BorderColor}`,
    position: 'relative',
    display: 'inline-block',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '0px',
    paddingRight: '0px',
    outline: 'none',
    ...CssProperties.SmallHeaderTextStyle,
}

export default CountryDropdown;