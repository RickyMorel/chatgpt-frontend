import React, { createContext, useState, useContext } from 'react';
import SuccessfulPopup from './SuccessfulPopup';
import { PopupStyle, spawnPopup } from './PopupManager';
import TwoButtonsPopup from './TwoButtonsPopup';
import SetupBlockedPopup from './SetupBlockedPopup';

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [currentPopup, setCurrentPopup] = useState(null);

  const showPopup = (error) => {
    const closePopupFunc = () => setCurrentPopup(null);
    const popupHtml = <SuccessfulPopup closeFunc={closePopupFunc} errorMsg={error} />;
    const newPopup = spawnPopup(true, popupHtml, PopupStyle.Medium);
    setCurrentPopup(newPopup);
  };

  const showPopup_2_Buttons = (title, description_1, description_2, bulletPoints, btn1Callback, btn2Callback = undefined, btnName_1 = "Quiero marcar manualmente", btnName_2 = "Si, seleccione los mejores") => {
    const closePopupFunc = () => {setCurrentPopup(null);}
    const popupHtml = 
    <TwoButtonsPopup 
      closeFunc={closePopupFunc} 
      title={title} 
      description_1={description_1}
      description_2={description_2}
      bulletPoints={bulletPoints} 
      btnName_1={btnName_1}
      btnName_2={btnName_2}
      btn1Callback={btn1Callback ?  () => { btn1Callback(); closePopupFunc() } : closePopupFunc()} 
      btn2Callback={btn2Callback ?? closePopupFunc} 
    />;
    const newPopup = spawnPopup(true, popupHtml, PopupStyle.Medium);
    setCurrentPopup(newPopup);
  };

  const showSetupPopup = (setupConditions) => {
    const closePopupFunc = () => { setCurrentPopup(null);}
    const popupHtml = <SetupBlockedPopup setupConditions={setupConditions} closePopupFunc={closePopupFunc}/>;
    const newPopup = spawnPopup(true, popupHtml, PopupStyle.Medium);
    setCurrentPopup(newPopup);
  };

  return (
    <PopupContext.Provider value={{ showPopup, showPopup_2_Buttons, showSetupPopup }}>
      {children}
      {currentPopup}
    </PopupContext.Provider>
  );
};

export const usePopup = () => {
  return useContext(PopupContext);
};
