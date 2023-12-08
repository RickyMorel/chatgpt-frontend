import React, { useState } from 'react';
import Modal from 'react-modal';

const spawnPopup = (isOpen, onClose, popup, style) => {
  console.log("spawnPopup", isOpen, popup)

  return (
    <Modal
        isOpen={isOpen}
        style={style}
    >
        {popup}
        {/* <div className="row valign-wrapper">
          <button onClick={onClose} className='waves-effect waves-light btn blue-dark centered'>Close</button>
        </div> */}
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
      background: 'transparent'
    },
};

const PopupStyle = {
    Small: smallStyle,
    Medium: smallStyle,
    Big: smallStyle
}

export {spawnPopup, PopupStyle}