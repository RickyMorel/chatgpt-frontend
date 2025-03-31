import React from 'react';
import { usePopup } from './Popups/PopupProvider';
import App from './App';

const AppWrapper = () => {
  const { showPopup, showPopup_2_Buttons, showSetupPopup } = usePopup();

  return (
    <App showPopup={showPopup} showPopup_2_Buttons={showPopup_2_Buttons} showSetupPopup={showSetupPopup}/>
  );
};

export default AppWrapper;
