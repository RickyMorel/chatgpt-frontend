import React, { Component } from 'react';
import Modal from 'react-modal';
import { PopupStyle } from '../Popups/PopupManager';
import DayLocationForm from './DayLocationForm';

class DayLocationModal extends Component {
  render() {
    const { modalIsOpen, closeModalFunc } = this.props;

    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModalFunc}
        style={PopupStyle.Big}
      >
        <DayLocationForm showPopup={this.props.showPopup}/>
      </Modal>
    );
  }
}

export default DayLocationModal;
