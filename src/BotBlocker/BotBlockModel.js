import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import ClientBlockComponent from './ClientBlockComponent';

function BotBlockModel({modalIsOpen, closeModalFunc}) {  
  const [clients, setClients] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClientData = async () => {
    try {
      const response = await axios.get('https://your-api-endpoint.com/data');
      setClients(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  else if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModalFunc}
      contentLabel="Example Modal"
    >
      <div className="container">
        <div className="row">
          <div className="col s8">
            <div className="card">
              <div className="card-content">
                <span className="card-title">Scroll View Example</span>
                <div className="scroll-view-container">
                  <ClientBlockComponent/>
                  <ClientBlockComponent/>
                  <ClientBlockComponent/>
                  <ClientBlockComponent/>
                  <ClientBlockComponent/>
                  <ClientBlockComponent/>
                  <ClientBlockComponent/>
                  <ClientBlockComponent/>
                  <ClientBlockComponent/>
                  <ClientBlockComponent/>
                  <ClientBlockComponent/>
                  <ClientBlockComponent/>
                  <ClientBlockComponent/>
                  <ClientBlockComponent/>
                  <ClientBlockComponent/>
                  <ClientBlockComponent/>
                  <ClientBlockComponent/>
                  <ClientBlockComponent/>
                  <ClientBlockComponent/>
                  <ClientBlockComponent/>
                  <ClientBlockComponent/>
                  <ClientBlockComponent/>
                  <ClientBlockComponent/>
                  <ClientBlockComponent/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button onClick={closeModalFunc}>Close Modal</button>
    </Modal>
    );
}

export default BotBlockModel