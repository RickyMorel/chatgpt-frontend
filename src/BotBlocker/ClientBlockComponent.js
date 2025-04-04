import React from 'react'
import axios from 'axios';
import { Color, ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import Utils from '../Utils';
import CustomButton from '../Searchbar/CustomButton';
import { faPenToSquare, faEnvelopeCircleCheck, faCommentSlash, faComment } from '@fortawesome/free-solid-svg-icons';
import { faFloppyDisk, faEnvelope} from '@fortawesome/free-regular-svg-icons';
import HttpRequest from '../HttpRequest';

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
    const wasBlocked = this.props.client.chatIsBlocked

    this.setState({
      isBlocked: wasBlocked,
      name: this.props.client.name,
      address: this.props.client.address
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.client.chatIsBlocked !== prevProps.client.chatIsBlocked) {
      this.setState({
        isBlocked: this.props.client.chatIsBlocked,
      })
    }

    if (this.props.client.name !== prevProps.client.name) {
      this.setState({
        name: this.props.client.name
      })
    }
    if (this.props.client.address !== prevProps.client.address) {
      this.setState({
        address: this.props.client.address
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
      const response = await HttpRequest.put(`/client-crud/updateByNumber`, clientObj);
      return null
    } catch (error) {
      this.props.showPopup(new Error(error.response.data.message))
    }
  };

  handleNameChange = async (newName) => {
    try {
      const clientObj = {phoneNumber: this.props.client.phoneNumber, name: newName}
      this.setState({
        name: newName
      })
      const response = await HttpRequest.put(`/client-crud/updateByNumber`, clientObj);
      return null
    } catch (error) {
      this.props.showPopup(new Error(error.response.data.message))
    }
  };

  handleBlock = async (phoneNumber, clientRegisterBlockedStateFunc) => {
    try {
      const newBlockedState = !this.state.isBlocked
      const response = await HttpRequest.put(`/client-crud/blockClientChat`, {phoneNumber: phoneNumber, isBlocked: newBlockedState});
      clientRegisterBlockedStateFunc(phoneNumber, newBlockedState)
      
      this.setState({
        isBlocked: newBlockedState
      })

      this.props.handleBlockCallback(newBlockedState)

      return response
    } catch (error) {
      return error
    }
  }

  render() {
    const { client, isGloballyBlocked,
      clientRegisterBlockedStateFunc, tomorrowsDayLocationIndex, dayLocations, allClientLocations, willMessageTommorrow } = this.props;
        
    const isGoingToMessage = client.chatIsBlocked == false && isGloballyBlocked == false && willMessageTommorrow != undefined

    return (
      <div className="row" style={trStyle}>
        <div className='col-3'>
          {
             this.state.isEditing == true ?
             <input style={{display: 'block' }} value={this.state.name} onChange={(e) => this.handleNameChange(e.target.value)}/>
             :
              <p style={trTextStyle}>{this.state.name}</p>
           }
        </div>
        <div className="col-3">
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
            <p style={trTextStyle}>{this.state.address}</p>
          }
        </div>
        <div className="col-3">
          <p style={trTextStyle}>+{client.phoneNumber}</p>
        </div>
        <div className="col-2">
          <p style={{...trTextStyle, color: !isGoingToMessage ? ColorHex.RedFabri : ColorHex.GreenFabri}}>{!isGoingToMessage ? 'NO' : 'SI'}</p>
        </div> 
        <div className='col-1'>
          <div className="row">
            <div className="col-6">
              <CustomButton iconSize="25px" width='40px' classStyle="btnGreen" height="40px" icon={faPenToSquare} link="editClient" linkData={client}/>
            </div>
            <div className="col-6">
              <CustomButton iconSize="25px" width='50px' classStyle={!isGoingToMessage ? "btnGreen" : "btnRed"} height="50px" icon={client.chatIsBlocked == true || isGloballyBlocked == true ? faComment : faCommentSlash} onClickCallback={() => this.handleBlock(client.phoneNumber, clientRegisterBlockedStateFunc)}/>
            </div>
          </div>
        </div>
    </div>
      // <div className={willMessageTommorrow ? `row ${Color.Third} list-item z-depth-2 border` : `row list-item z-depth-2 border`}>
      //   <div className="col s12 m4">
      //     {
      //       this.state.isEditing == true ?
      //       <input style={{display: 'block' }} value={this.state.name} onChange={(e) => this.handleNameChange(e.target.value)}/>
      //       :
      //       <span className="client-name">{this.state.name}</span>
      //     }
      //   </div>
      //   <div className="col s12 m3">
      //     {
      //       this.state.isEditing == true ?
      //       <select style={{display: 'block' }} value={this.state.address} onChange={(e) => this.handleAddressChange(e.target.value)}>
      //         {
      //           allClientLocations && allClientLocations?.map(x => (
      //             <option value={x}>{x}</option>
      //           ))
      //         }
      //       </select>
      //       :
      //       <span>{this.state.address}</span>
      //     }
      //   </div>
      //   <div className="col s12 m2">
      //     <span>+{phoneNumber}</span>
      //   </div>
      //   <div className="col s12 m1">
      //     {
      //       isFavorite == true ? 
      //       <a><i style={{ color: "#ff8c00" }} className={`material-icons`}>star</i></a>
      //       :
      //       <div></div>
      //     }
      //   </div>
      //   <div className="col s12 m1">
      //     {
      //       <button className={`waves-effect waves-light btn-small ${this.state.isEditing ? Color.Button_1 : Color.Second}`} onClick={this.handleEditMode}>
      //         <i className="material-icons">{this.state.isEditing ? "save" : "edit"}</i>
      //       </button>
      //     }
      //   </div>
      //   <div className="col s12 m1">
      //     {
      //       chatIsBlocked == true || isGloballyBlocked == true ?
      //       <a className={`waves-effect waves-light btn btn-small right ${Color.First
      //       }`} onClick={() => this.handleBlock(phoneNumber, false, clientRegisterBlockedStateFunc)}>
      //           <i className="material-icons">remove_circle</i>
      //       </a>
      //       :
      //       <a className={`waves-effect waves-light btn btn-small right ${Color.Fifths}`} onClick={() => this.handleBlock(phoneNumber, true, clientRegisterBlockedStateFunc)}>
      //         <i className="material-icons">check</i>
      //       </a>
      //     }
      //   </div>
      // </div>
    );
  }
}

const trStyle = {
  borderRadius: '10px',
  backgroundColor: ColorHex.White,
  boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
  border: `1px solid ${ColorHex.BorderColor}`,
  height: '70px',
  width: '100%',
  alignItems: 'center',
  marginBottom: '12px',
  display: 'flex',
  marginLeft: '5px',
}

const trTextStyle = {
  ...CssProperties.BodyTextStyle,
  color: ColorHex.TextBody,
  textAlign: 'center',
  marginTop: '12px'
}

export default ClientBlockComponent;