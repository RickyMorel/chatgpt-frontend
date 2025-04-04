import React, { Component } from 'react';
import { Circles, ColorRing, RotatingSquare } from 'react-loader-spinner';
import { ColorHex } from './Colors';

class LoadSpinner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    }
  }

  componentDidUpdate(prevProps) {
    //Disable loadr automatically after 10 seconds
    if (this.props.isLoading !== prevProps.isLoading) {
      this.setState({isLoading: this.props.isLoading})

      if(this.props.isLoading == true) {
        setTimeout(() => {
          this.setState({isLoading: false})
        }, 10000);
      }
    }
  }

  render() {
    const overlayStyles = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      zIndex: 9999, 
    };

    const spinnerHtml = this.state.isLoading ? (
      <div style={overlayStyles}>
        <ColorRing
          visible={this.state.isLoading}
          height="200"
          width="200"
          ariaLabel="color-ring-loading"
          wrapperStyle={{}}
          wrapperClass="color-ring-wrapper"
          colors={[ColorHex.GreenFabri, ColorHex.GreenDark_1, ColorHex.GreenDark_2, ColorHex.GreyFabri, ColorHex.BlueFabri]}
        />
        <h4>{this.props.loaderMessge == "" ? "Cargando..." : this.props.loaderMessge}</h4>
      </div>
    ) : (
      <div></div>
    );
    
    
    return (
      <div>
        {spinnerHtml}
      </div>
    );
  }
}

export default LoadSpinner;
