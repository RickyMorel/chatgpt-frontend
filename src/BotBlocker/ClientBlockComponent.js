import React from 'react'
import axios from 'axios';
import { Color } from '../Colors';

class ClientBlockComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      isBlocked: false,
      address: props.address,
      // name: props.name
    };
  }

  componentDidMount() {
    const wasBlocked = this.props.chatIsBlocked

    this.setState({
      isBlocked: wasBlocked,
      name: this.props.name,
      address: this.props.address
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.chatIsBlocked !== prevProps.chatIsBlocked) {
      this.setState({
        isBlocked: this.props.chatIsBlocked,
      })
    }

    if (this.props.name !== prevProps.name) {
      this.setState({
        name: this.props.name
      })
    }
    if (this.props.address !== prevProps.address) {
      this.setState({
        address: this.props.address
      })
    }
  }

  handleEditMode = () => {
    const isEditing = !this.state.isEditing
    this.setState({
      isEditing: isEditing
    })
  }

  handleAddressChange = async (location) => {
    try {
      const clientObj = {phoneNumber: this.props.phoneNumber, address: location}
      this.setState({
        address: location
      })
      const response = await axios.put(`${process.env.REACT_APP_HOST_URL}/client-crud/updateByNumber`, clientObj);
      return null
    } catch (error) {
      this.props.showPopup(new Error(error.response.data.message))
    }
  };

  handleNameChange = async (newName) => {
    try {
      const clientObj = {phoneNumber: this.props.phoneNumber, name: newName}
      this.setState({
        name: newName
      })
      const response = await axios.put(`${process.env.REACT_APP_HOST_URL}/client-crud/updateByNumber`, clientObj);
      return null
    } catch (error) {
      this.props.showPopup(new Error(error.response.data.message))
    }
  };

  handleBlock = async (phoneNumber, newBlockedState, clientRegisterBlockedStateFunc) => {
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
    const { name, phoneNumber, chatIsBlocked, isGloballyBlocked, hasLocation, openMapModalCallback,
      clientRegisterBlockedStateFunc, tomorrowsDayLocationIndex, dayLocations, isFavorite, allClientLocations, willMessageTommorrow } = this.props;

    return (
      <div className={willMessageTommorrow ? `row ${Color.Third} list-item z-depth-2 border` : `row list-item z-depth-2 border`}>
        <div className="col s3">
          {
            this.state.isEditing == true ?
            <input style={{display: 'block' }} value={this.state.name} onChange={(e) => this.handleNameChange(e.target.value)}/>
            :
            <span className="client-name">{this.state.name}</span>
          }
        </div>
        <div className="col s2">
          {
            this.state.isEditing == true ?
            <select style={{display: 'block' }} value={this.state.address} onChange={(e) => this.handleAddressChange(e.target.value)}>
              {
                allClientLocations && allClientLocations?.map(x => (
                  <option value={x}>{x}</option>
                ))
              }
            </select>
            :
            <span>{this.state.address}</span>
          }
        </div>
        <div className="col s2">
          <span>+{phoneNumber}</span>
        </div>
        <div className="col s2">{hasLocation ? "" : <p className='red-text'>No tiene ubicacion de entrega</p>}</div>
        <div className="col s1">
          {
            isFavorite == true ? 
            <a><i style={{ color: "#ff8c00" }} className={`material-icons`}>star</i></a>
            :
            <div></div>
          }
        </div>
        <div className="col s1">
          {
            <button className={`waves-effect waves-light btn-small ${this.state.isEditing ? Color.Button_1 : Color.Second}`} onClick={() => openMapModalCallback(phoneNumber)}>
              <i className="material-icons">{this.state.isEditing ? "save" : "edit"}</i>
            </button>
          }
        </div>
        <div className="col s1">
          {
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