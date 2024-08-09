import React, { Component, createRef } from 'react';
import '../MultiSelect.css';

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
    const textStyle2 = {
      "margin-left": "50%",
      "marginRight": "50%" 
    };

    return (
        <div>
            {
            this.props.isEditing ? 
            <div className='row'>
                <div className='col s5'><input value={this.state?.startTime} style={textStyle} type="time" onChange={(e) => this.handleChangeProcessTimes(e, 1)}/></div>
                <div className="col s1 black-text"><h5>-</h5></div>
                <div className='col s5'><input value={this.state?.endTime} style={textStyle} type="time" onChange={(e) => this.handleChangeProcessTimes(e, 2)}/></div>
            </div>   
            : 
            // <div>
            //     <p>{"__:__?"}</p>
            //     {/* <p>{this.state?.endTime ?? "__:__?"}</p> */}
            // </div>
            <div className='row'>
                <div className='col s5 black-text'>{this.state?.startTime ?? "__:__?"}</div>
                <div className='col s1 black-text'>-</div>
                <div className='col s5 black-text'>{this.state?.endTime ?? "__:__?"}</div>
            </div>
            }
        </div>
    );
  }
}

export default TimeBlock;
