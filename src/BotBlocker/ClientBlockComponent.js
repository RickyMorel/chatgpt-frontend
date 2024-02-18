import React from 'react'
import axios from 'axios';
import { Color } from '../Colors';

class ClientBlockComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      isBlocked: false,
      address: ""
    };
  }

  componentDidMount() {
    const wasBlocked = this.props.chatIsBlocked

    this.setState({
      isBlocked: wasBlocked,
      address: this.props.address
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.chatIsBlocked !== prevProps.chatIsBlocked) {
      this.setState({
        isBlocked: this.props.chatIsBlocked,
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
    const { name, phoneNumber, chatIsBlocked, isGloballyBlocked,
      clientRegisterBlockedStateFunc, tomorrowsDayLocationIndex, dayLocations, isFavorite, allClientLocations } = this.props;
    const willMessageTommorrow = dayLocations[tomorrowsDayLocationIndex]?.locations?.find(location => location == this.state.address)

    console.log("renderrrrrr", this.props)
    

    return (
      <div className={willMessageTommorrow ? `row ${Color.Third} list-item z-depth-2 border` : `row list-item z-depth-2 border`}>
        <div className="col s12 m4">
          <span className="client-name">{name}</span>
        </div>
        <div className="col s12 m3">
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
        <div className="col s12 m2">
          <span>+{phoneNumber}</span>
        </div>
        <div className="col s12 m1">
          {
            isFavorite == true ? 
            <a><i style={{ color: "#ff8c00" }} className={`material-icons`}>star</i></a>
            :
            <div></div>
          }
        </div>
        <div className="col s12 m1">
          {
            <button className={`waves-effect waves-light btn-small ${this.state.isEditing ? Color.Button_1 : Color.Second}`} onClick={this.handleEditMode}>
              <i className="material-icons">{this.state.isEditing ? "save" : "edit"}</i>
            </button>
          }
        </div>
        <div className="col s12 m1">
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