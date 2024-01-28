import React, { useState } from 'react';
import Modal from 'react-modal';

const spawnPopup = (isOpen, popup, style) => {
  return (
    <Modal
        isOpen={isOpen}
        style={style}
    >
        {popup}
    </Modal>
  );
};

const smallStyle = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    border: 'none',
    borderRadius: '0',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '30%',  
    height: '50%', 
    background: 'transparent',
  },
  overlay: {zIndex: 1000}
};


const mediumStyle = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    border: 'none',
    borderRadius: '0',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',  
    height: '60%', 
    background: 'transparent',
  },
  overlay: {zIndex: 1000}
};

const bigStyle = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    border: 'none',
    borderRadius: '0',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',  
    height: '80%', 
    background: 'transparent',
  },
  overlay: {zIndex: 1000}
};

const PopupStyle = {
    Small: smallStyle,
    Medium: mediumStyle,
    Big: bigStyle
}

export {spawnPopup, PopupStyle}