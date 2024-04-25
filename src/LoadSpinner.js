import React, { Component } from 'react';
import { Circles, ColorRing, RotatingSquare } from 'react-loader-spinner';
import { ColorHex } from './Colors';

class LoadSpinner extends Component {
  constructor(props) {
    super(props);
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

    const spinnerHtml = this.props.isLoading ? (
      <div style={overlayStyles}>
        <ColorRing
          visible={this.props.isLoading}
          height="200"
          width="200"
          ariaLabel="color-ring-loading"
          wrapperStyle={{}}
          wrapperClass="color-ring-wrapper"
          colors={[ColorHex.First, ColorHex.Fifth, ColorHex.Second, ColorHex.Third, '#849b87']}
        />
        <h4>Cargando...</h4>
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
