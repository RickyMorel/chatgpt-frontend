import React, { Component } from 'react';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import ExplinationPopup from './ExplinationPopup';

class CustomToggle extends Component {
    constructor(props) {
        super(props);

        this.state = {
          showHint: false
        }

        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }

    handleMouseEnter() {
        this.setState({
          showHint: true
        })
    }

    handleMouseLeave() {
      this.setState({
        showHint: false
      })
    }

    render() {
        const { text, value, onChange, width, height } = this.props;

        return (
          <>
              <div className="form-check form-switch" style={{ display: 'inline-block' }} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                <input
                    style={{ width: '55px', height: '25px' }}
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={value}
                    onChange={onChange}
                    id="flexSwitchCheckDefault"
                />
                <label
                    style={{ ...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginLeft: '10px'}}
                    className="form-check-label"
                    htmlFor="flexSwitchCheckDefault"
                >
                    {text}
                </label>
              </div>
              {
                this.state.showHint ?
                <ExplinationPopup text="Al activar Auto Promo, se elegirán los mejores artículos para ponerlos en promoción"/>
                :
                <></>
              }
          </>
        );
    }
}

export default CustomToggle;
