import React from 'react';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import CustomButton from '../Searchbar/CustomButton';
import { Link } from '@mui/material';
import { useHistory } from 'react-router-dom';

const SetupBlockedPopup = ({setupConditions, closePopupFunc}) => {
  const history = useHistory();

  const Condition = (isMet, title) => {
    return (
      <li style={liStyle}>
         <Link onClick={(e) => history.push('/inventory')} style={navBarButtonStyle} className='nav-item rounded'>
          <img src={isMet == true ? "images/checkmark.jpeg" : "images/x-button.png"}  width="35px"/>
          {title}
         </Link>
      </li>
    )
  }
  return (
    <div>
      <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody, textAlign: 'center'}}>Completar pasos primero</p>
      <hr className='border border-dark' style={{marginTop: '-10px'}}/>
      <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, textAlign: 'center'}}>Debes completar estos pasos antes de usar WhatsBot</p>
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <ul style={ulStyle}>
                {Condition(setupConditions.hasLinkedWhatsapp, "Vincular WhatsApp")}
                {Condition(setupConditions.hasBusinessDescription, "Dar descripcion de negocio")}
                {Condition(setupConditions.hasProducts, "Cargar productos")}
                {Condition(setupConditions.hasExamples, "Cargar 15 ejemplos de conversacion")}
                {Condition(setupConditions.hasAnswers, "Cargar preguntas y respuestas")}
            </ul>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px' }}>
          <CustomButton
            text="Cerrar"
            onClickCallback={closePopupFunc}
          />
        </div>
    </div>
  );
};

const ulStyle = {
  listStyleType: 'none', 
  paddingLeft: '0',
  color: '#333',
  width: 'fit-content',     
};

const liStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  lineHeight: '1.5',
  padding: '8px 0',  
  ...CssProperties.MediumHeadetTextStyle, 
  color: ColorHex.TextBody,
};

let navBarButtonStyle = {
  display: 'flex',
  width: '100%',
  height: '45px',
  marginTop: '10px',
  alignItems: 'center',
  paddingLeft: '10px',
  paddingRight: '10px',
  textAlign: 'center',
  textDecoration: 'none', 
  color: 'inherit',
  gap: '15px'
}

export default SetupBlockedPopup;