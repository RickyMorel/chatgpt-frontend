import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import ClientBlockComponent from './ClientBlockComponent';

class BotBlockModel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchClientData();
  }

  fetchClientData = async () => {
    console.log("fetchClientData");
    try {
      const response = await axios.get('http://localhost:3000/client-crud');
      console.log("response:", response)
      this.setState({ clients: response.data });
      console.log("clients: ", this.state.clients);
    } catch (error) {
      this.setState({ error: error });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { modalIsOpen, closeModalFunc } = this.props;
    const { loading, error, clients } = this.state;
    const clientBlocks = this.state.clients?.map(x => {
      return <ClientBlockComponent {...x}/>
    })

    if (loading) {
      console.log("Loading...");
      return <div>Loading...</div>;
    } else if (error) {
      return <div>Error: {error.message}</div>;
    }

    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModalFunc}
        contentLabel="Example Modal"
        style={customStyles}
      >
        {clientBlocks}
        <button onClick={closeModalFunc}>Close Modal</button>
      </Modal>
    );
  }
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default BotBlockModel;