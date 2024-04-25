import React, { Component } from 'react';
import { Circles } from 'react-loader-spinner';

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
      <Circles
        height="400"
        width="400"
        color="#4fa94d"
        ariaLabel="circles-loading"
        wrapperStyle={overlayStyles}
        wrapperClass=""
        visible={this.props.isLoading}
      />
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
