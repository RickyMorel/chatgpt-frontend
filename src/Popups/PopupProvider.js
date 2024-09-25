import React, { createContext, useState, useContext } from 'react';
import SuccessfulPopup from './SuccessfulPopup';
import { PopupStyle, spawnPopup } from './PopupManager';

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [currentPopup, setCurrentPopup] = useState(null);

  const showPopup = (error) => {
    const closePopupFunc = () => setCurrentPopup(null);
    const popupHtml = <SuccessfulPopup closeFunc={closePopupFunc} errorMsg={error} />;
    const newPopup = spawnPopup(true, popupHtml, PopupStyle.Medium);
    setCurrentPopup(newPopup);
  };

  const showPopup_2_Buttons = (title, description_1, description_2, bulletPoints, btn1Callback, btn2Callback = undefined) => {
    const closePopupFunc = () => setCurrentPopup(null);
    const popupHtml = 
    <SuccessfulPopup 
      closeFunc={closePopupFunc} 
      title={title} 
      description_1={description_1}
      description_2={description_2}
      bulletPoints={bulletPoints} 
      btn1Callback={() => {btn1Callback(); closePopupFunc();}} 
      btn2Callback={btn2Callback ?? closePopupFunc} 
    />;
    const newPopup = spawnPopup(true, popupHtml, PopupStyle.Medium);
    setCurrentPopup(newPopup);
  };

  return (
    <PopupContext.Provider value={{ showPopup, showPopup_2_Buttons }}>
      {children}
      {currentPopup}
    </PopupContext.Provider>
  );
};

export const usePopup = () => {
  return useContext(PopupContext);
};
