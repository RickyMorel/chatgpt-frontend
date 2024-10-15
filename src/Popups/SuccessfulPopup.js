import React from 'react';
import CssProperties from '../CssProperties';
import { ColorHex } from '../Colors';
import { faRectangleXmark, faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import CustomButton from '../Searchbar/CustomButton';
import Utils from '../Utils';

const SuccessfulPopup = ({ title, closeFunc }) => {
  const successMessage = "Guardo los datos correctamente."

  return (
    <div class="row">
      <div className="col-1">
        <img width="60" height="60" src={"images/tick.png"} alt="" class="circle responsive-img"/>
      </div>
      <div className="col-9">
        <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, textAlign: 'center', paddingTop: '15px'}}>Guardo Exitosamente</p>
      </div>
      <div className="col-1">
        <CustomButton onClickCallback={closeFunc} text="Cerrar"/>
      </div>
    </div>
  );
};

export default SuccessfulPopup;
