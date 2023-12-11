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
    const wasBlocked = this.props.isBlocked

    this.setState({
      isBlocked: wasBlocked
    })
  }

  handleBlock = async (phoneNumber) => {
    try {
      const wasBlocked = this.state.wasBlocked
      console.log("handleBlock", !wasBlocked)
      const response = await axios.put('http://localhost:3000/client-crud/blockClientChat', {phoneNumber: phoneNumber, isBlocked: !wasBlocked});
      this.setState({
        isBlocked: !wasBlocked
      })
      return response
    } catch (error) {
      return error
    }
  }

  render() {
    const { name, phoneNumber, address, chatIsBlocked } = this.props;

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
            <a className="waves-effect waves-light btn red red-button" onClick={() => this.handleBlock(phoneNumber)}>Bloquear</a>
            :
            <a className="waves-effect waves-light btn grey grey-button" onClick={() => this.handleBlock(phoneNumber)}>Desbloquear</a>
          }
        </div>
      </div>
    );
  }
}

export default ClientBlockComponent;