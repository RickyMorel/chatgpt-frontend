import React, { Component } from 'react';
import { Color } from './Colors';
import firebase from "./firebaseConfig";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageCount: 0,
      totalClientsToMessage: 0
    };
  }

  componentDidMount() {
    this.fetchChatData()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.botNumber !== this.props.botNumber) {
      this.fetchChatData();
    }
  }

  fetchChatData = async () => {
    if (!this.props.botNumber) {
        return;
    }

    const ref = firebase.collection('globalConfig').doc(String(this.props.botNumber));

    ref.get()
      .then((doc) => {
        const response = doc.data()
        this.setState({
          messageCount: response.messageCount,
          totalClientsToMessage: response.totalClientsToMessage
        });
      })
      .catch((error) => {
        console.error('Error getting document:', error);
      });
  }

  render() {
    return (
      <nav>
        <div className={`nav-wrapper ${Color.Second}`} style={{ paddingLeft: '40px' }}>
          <a href="#!" className="brand-logo">Chatbot</a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li style={{ paddingRight: '20px' }}>{`Mensajes Enviados: ${this.state.messageCount}/${this.state.totalClientsToMessage}`}</li>
            <li style={{ paddingRight: '20px' }}>Emporio Alemán</li>
            <li style={{ paddingRight: '20px' }}>
              <img width="62" height="62" src="images/companyLogo.jpg" alt="" className="circle responsive-img" />
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
