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
      background: 'transparent'
    },
};

const PopupStyle = {
    Small: smallStyle,
    Medium: smallStyle,
    Big: smallStyle
}

export {spawnPopup, PopupStyle}