import React, { Component } from 'react';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import ExplinationPopup from './ExplinationPopup';

class CustomToggle extends Component {
    constructor(props) {
        super(props);

        // Generate a unique ID for each instance
        this.id = `custom-toggle-${Math.random().toString(36).substr(2, 9)}`;

        this.state = {
          showHint: false
        }

        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }

    handleMouseEnter() {
        this.setState({ showHint: true });
    }

    handleMouseLeave() {
        this.setState({ showHint: false });
    }

    render() {
      const { text, value, onChange, width, explinationText, explinationPopupWidth, explinationPopupHeight } = this.props;

      return (
        <>
          <div 
            style={{ 
              display: 'inline-block',
              position: 'relative',
              padding: '5px 0',
              verticalAlign: 'middle' // Ensure proper vertical alignment
            }} 
            onMouseEnter={this.handleMouseEnter} 
            onMouseLeave={this.handleMouseLeave}
          >
            <input
              style={{ opacity: 0, width: 0, height: 0 }}
              type="checkbox"
              role="switch"
              checked={value}
              onChange={onChange}
              id={this.id} // Use unique ID
            />
            <label
              htmlFor={this.id} // Reference unique ID
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: width ?? '55px',
                  height: '25px',
                  backgroundColor: value ? ColorHex.GreenDark_1 : '#ccc',
                  borderRadius: '15px',
                  transition: 'background-color 0.15s ease',
                  padding: '3px',
                }}
              >
                <span style={handleStyle(value)} />
              </div>
              <span style={{ marginLeft: '10px', ...CssProperties.BodyTextStyle, color: ColorHex.TextBody }}>
                {text}
              </span>
            </label>
            {this.state.showHint && (
              <ExplinationPopup 
                width={explinationPopupWidth} 
                height={explinationPopupHeight} 
                text={explinationText} 
              />
            )}
          </div>
        </>
      );
  }
}
const handleStyle = (value) => ({
  position: 'absolute',
  top: '2px',
  left: '2px',
  width: '21px',
  height: '21px',
  backgroundColor: '#fff',
  borderRadius: '50%',
  transition: 'transform 0.15s ease',
  transform: value ? 'translateX(30px)' : 'translateX(0)',
})

export default CustomToggle;