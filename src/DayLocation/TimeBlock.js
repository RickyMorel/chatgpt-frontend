import React, { Component, createRef } from 'react';
import '../MultiSelect.css';
import CssProperties from '../CssProperties';
import { ColorHex } from '../Colors';
import CustomInput from '../Searchbar/CustomInput';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import CustomButton from '../Searchbar/CustomButton';

class TimeBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
        id: -1,
        startTime: undefined,
        endTime: undefined
    }
  }

  componentDidMount() {
    this.setState({
        id: this.props.id,
        startTime: this.props.set.startTime,
        endTime: this.props.set.endTime
    })
  }

  handleChangeProcessTimes = (value, processTimeId) => {
    if(processTimeId == 1) {
      this.setState({
        startTime: value
      }, () => this.props.changeTimesCallback(this.state.id, {startTime: value, endTime: this.state.endTime}))
    }
    else if(processTimeId == 2) {
      this.setState({
        endTime: value
      }, () => this.props.changeTimesCallback(this.state.id, {startTime: this.state.startTime, endTime: value}))
    }
  }

  render() {
    const { removeTimeCallback } = this.props

    return (
        <div style={{width: this.props.isEditing ? '356px' : '156px', height: '50px', marginLeft: '25px'}}>
            {
            this.props.isEditing ? 
            <div style={{display: 'flex', marginTop: '-5px'}}>
                <CustomInput value={this?.state?.startTime} noPadding={true} width='150px' height='40px' dataType="time" onChange={(value) => this.handleChangeProcessTimes(value, 1)}/>
                <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody}}>-</p>
                <CustomInput value={this?.state?.endTime} noPadding={true} width='150px' height='40px' dataType="time" onChange={(value) => this.handleChangeProcessTimes(value, 2)}/>
                <CustomButton width='40px' height="40px" iconSize={25} icon={faTrash} onClickCallback={() => removeTimeCallback(this.state.id)}/>
            </div>   
            : 
            <div style={{display: 'flex'}}>
              <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginRight: '10px'}}>{this.state?.startTime ?? "__:__?"}</p>
              <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginRight: '10px'}}>-</p>
              <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody}}>{this.state?.endTime ?? "__:__?"}</p>
            </div>
            }
        </div>
    );
  }
}

export default TimeBlock;
