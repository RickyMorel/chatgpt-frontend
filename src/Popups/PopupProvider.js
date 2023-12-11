import React, { createContext, useState, useContext } from 'react';
import SuccessfulPopup from './SuccessfulPopup';
import { PopupStyle, spawnPopup } from './PopupManager';

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [currentPopup, setCurrentPopup] = useState(null);

  const showPopup = (error) => {
    const closePopupFunc = () => setCurrentPopup(null);
    const popupHtml = <SuccessfulPopup closeFunc={closePopupFunc} errorMsg={error} />;
    const newPopup = spawnPopup(true, popupHtml, PopupStyle.Small);
    setCurrentPopup(newPopup);
  };

  return (
    <PopupContext.Provider value={{ showPopup }}>
      {children}
      {currentPopup}
    </PopupContext.Provider>
  );
};

export const usePopup = () => {
  return useContext(PopupContext);
};
