import React from 'react'
import axios from 'axios';
import { Color } from '../Colors';

class ClientBlockComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isBlocked: false,
    };
  }

  componentDidMount() {
    const wasBlocked = this.props.chatIsBlocked

    this.setState({
      isBlocked: wasBlocked
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.chatIsBlocked !== prevProps.chatIsBlocked) {
      this.setState({
        isBlocked: this.props.chatIsBlocked
      })
    }
  }

  handleBlock = async (phoneNumber, newBlockedState, clientRegisterBlockedStateFunc) => {
    console.log("handleBlock")
    try {
      const response = await axios.put(`${process.env.REACT_APP_HOST_URL}/client-crud/blockClientChat`, {phoneNumber: phoneNumber, isBlocked: newBlockedState});
      clientRegisterBlockedStateFunc(phoneNumber, newBlockedState)
      this.setState({
        isBlocked: newBlockedState
      })
      return response
    } catch (error) {
      return error
    }
  }

  render() {
    const { name, phoneNumber, address, chatIsBlocked, isGloballyBlocked, clientRegisterBlockedStateFunc } = this.props;

    console.log(name, chatIsBlocked)

    return (
      <div className="row list-item z-depth-2 border">
        <div className="col s12 m4">
          <span className="client-name">{name}</span>
        </div>
        <div className="col s12 m4">
          <span>{address}</span>
        </div>
        <div className="col s12 m3">
          <span>+{phoneNumber}</span>
        </div>
        <div className="col s12 m1">
          {
            // || isGloballyBlocked == true
            chatIsBlocked == true || isGloballyBlocked == true ?
            <a className={`waves-effect waves-light btn btn-small right ${Color.First
            }`} onClick={() => this.handleBlock(phoneNumber, false, clientRegisterBlockedStateFunc)}>
                <i className="material-icons">remove_circle</i>
            </a>
            :
            <a className={`waves-effect waves-light btn btn-small right ${Color.Fifths}`} onClick={() => this.handleBlock(phoneNumber, true, clientRegisterBlockedStateFunc)}>
              <i className="material-icons">check</i>
            </a>
          }
        </div>
      </div>
    );
  }
}

export default ClientBlockComponent;