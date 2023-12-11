import React from 'react'
import axios from 'axios';

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

  handleBlock = async (phoneNumber, newBlockedState) => {
    try {
      const response = await axios.put('http://localhost:3000/client-crud/blockClientChat', {phoneNumber: phoneNumber, isBlocked: newBlockedState});
      this.setState({
        isBlocked: newBlockedState
      })
      return response
    } catch (error) {
      return error
    }
  }

  render() {
    const { name, phoneNumber } = this.props;

    return (
      <div className="row list-item z-depth-2 border">
        <div className="col s4">
          <span className="client-name">{name}</span>
        </div>
        <div className="col s4">
          <span className="client-name">+{phoneNumber}</span>
        </div>
        <div className="col s4">
          {
            this.state.isBlocked == true ? 
            <a className="waves-effect waves-light btn grey grey-button" onClick={() => this.handleBlock(phoneNumber, false)}>Bloquear</a>
            :
            <a className="waves-effect waves-light btn red red-button" onClick={() => this.handleBlock(phoneNumber, true)}>Desbloquear</a>
          }
        </div>
      </div>
    );
  }
}

export default ClientBlockComponent;