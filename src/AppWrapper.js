import React from 'react';
import { usePopup } from './Popups/PopupProvider';
import App from './App';

const AppWrapper = () => {
  const { showPopup } = usePopup();

  return (
    <App showPopup={showPopup} />
  );
};

export default AppWrapper;
