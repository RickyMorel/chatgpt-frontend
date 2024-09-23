import React, { Component, createRef } from 'react';
import '../MultiSelect.css';
import CssProperties from '../CssProperties';
import { ColorHex } from '../Colors';
import CustomInput from '../Searchbar/CustomInput';

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

  handleChangeProcessTimes = (e, processTimeId) => {
    if(processTimeId == 1) {
      this.setState({
        startTime: e.target.value
      }, () => this.props.changeTimesCallback(this.state.id, {startTime: e.target.value, endTime: this.state.endTime}))
    }
    else if(processTimeId == 2) {
      this.setState({
        endTime: e.target.value
      }, () => this.props.changeTimesCallback(this.state.id, {startTime: this.state.startTime, endTime: e.target.value}))
    }
  }

  render() {
    const textStyle = {
      "margin-left": "5%"
    };

    return (
        <div style={{width: '216px', height: '50px', marginLeft: '25px'}}>
            {
            this.props.isEditing ? 
            <div style={{display: 'flex', marginTop: '-5px'}}>
                <CustomInput value={this.state?.startTime} style={textStyle} noPadding={true} width='125px' height='40px' dataType="time" onChange={(e) => this.handleChangeProcessTimes(e, 1)}/>
                <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody}}>-</p>
                <CustomInput value={this.state?.endTime} style={textStyle} noPadding={true} width='105px' height='40px' dataType="time" onChange={(e) => this.handleChangeProcessTimes(e, 2)}/>
            </div>   
            : 
            <div style={{display: 'flex'}}>
              <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody}}>{this.state?.startTime ?? "__:__?"}-{this.state?.endTime ?? "__:__?"}</p>
            </div>
            }
        </div>
    );
  }
}

export default TimeBlock;
