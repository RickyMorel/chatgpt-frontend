import React from 'react';
import CssProperties from '../CssProperties';
import { ColorHex } from '../Colors';
import { faRectangleXmark, faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import CustomButton from '../Searchbar/CustomButton';
import Utils from '../Utils';

const SuccessfulPopup = ({ title }) => {
  return (
    <div>
      <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody, textAlign: 'center'}}>Guardo Exitosamente</p>
    </div>
  );
};

const ulStyle = {
  listStyleType: 'circle', 
  // marginLeft: '20px', 
  color: '#333',     
};

const liStyle = {
  lineHeight: '1',
  padding: '4px 0',  
  ...CssProperties.MediumHeadetTextStyle, 
  color: ColorHex.TextBody,
};

export default SuccessfulPopup;
