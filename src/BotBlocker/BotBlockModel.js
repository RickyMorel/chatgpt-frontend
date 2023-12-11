import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import ClientBlockComponent from './ClientBlockComponent';
import { PopupStyle } from '../Popups/PopupManager';

class BotBlockModel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: null,
      loading: true,
      error: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.modalIsOpen !== prevProps.modalIsOpen) {
      this.fetchClientData();
    }
  }

  fetchClientData = async () => {
    console.log("fetchClientData");
    try {
      const response = await axios.get('http://localhost:3000/client-crud');
      this.setState({ clients: response.data })
      console.log("got response", this.state.clients)
    } catch (error) {
      this.setState({ error: error });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    console.log("Render", this.state.clients)
    const { modalIsOpen, closeModalFunc } = this.props;
    const { loading, error, clients } = this.state;

    const clientBlocks = this.state.clients?.map(x => {
      return <ClientBlockComponent {...x}/>
    })

    if (loading) {
      return <div>Loading...</div>;
    } else if (error) {
      return <div>Error: {error.message}</div>;
    }

    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModalFunc}
        contentLabel="Example Modal"
        style={PopupStyle.Small}
      >
        {clientBlocks}
        <button onClick={closeModalFunc}>Close Modal</button>
      </Modal>
    );
  }
}

export default BotBlockModel;