import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AppWrapper from './AppWrapper';
import { PopupProvider } from './Popups/PopupProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PopupProvider>
      <AppWrapper/>
    </PopupProvider>
  </React.StrictMode>
);
