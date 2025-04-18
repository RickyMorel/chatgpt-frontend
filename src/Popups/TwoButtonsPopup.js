import React from 'react';
import CssProperties from '../CssProperties';
import { ColorHex } from '../Colors';
import { faRectangleXmark, faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import CustomButton from '../Searchbar/CustomButton';
import Utils from '../Utils';

const TwoButtonsPopup = ({ title, description_1, description_2, bulletPoints, btn1Callback, btn2Callback, closeFunc, btnName_1, btnName_2 }) => {
  return (
    <div>
      <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody, textAlign: 'center'}}>{title}</p>
      <hr className='border border-dark' style={{marginTop: '-10px'}}/>
      <p style={{...CssProperties.MediumHeadetTextStyle, color: ColorHex.TextBody, textAlign: 'center'}}>{description_1}</p>
      {
        bulletPoints ? 
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <ul style={ulStyle}>
            {bulletPoints.map(x => <li style={liStyle}>{Utils.getCutName(x, 18)}</li>)}
          </ul>
        </div>
        :
        <></>
      }
      <p style={{...CssProperties.MediumHeadetTextStyle, color: ColorHex.TextBody, textAlign: 'center'}}>{description_2}</p>
      <div style={{display: 'flex', flexGrow: 1, alignItems: 'center', gap: '15px'}}>
        <CustomButton text={btnName_1} classStyle="btnRed" width="270px" height="45px" icon={faRectangleXmark} onClickCallback={() => {btn2Callback(); closeFunc()}}/>
        <CustomButton text={btnName_2} classStyle="btnGreen" width="270px" height="45px" icon={faSquareCheck} onClickCallback={() => {btn1Callback(); closeFunc()}}/>
      </div>
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

export default TwoButtonsPopup;
