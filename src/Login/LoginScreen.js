import React, { Component } from 'react';
import { ColorHex } from '../Colors';
import CustomButton from '../Searchbar/CustomButton';
import CustomInput from '../Searchbar/CustomInput';
import CssProperties from '../CssProperties';
import { toast, ToastContainer } from 'react-toastify';
import { withRouter } from 'react-router-dom/cjs/react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { isMobile, isTablet, isDesktop } from 'react-device-detect';
import { error } from 'jquery';

class LoginScreen extends Component {
  constructor(props) {
      super(props);
  
      this.state = {
        email: '',
        password: '',
        error: ''
      }
  }

  componentDidMount() {
    if(!isDesktop) { this.props.history.push('/clientOrderPlacing'); return; }

    const token = Cookies.get('token');

    if(!token || token.length < 1) { return; }

    window.token = token
    this.props.history.push('/blockChats');
  }

  handleLogin = async () => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_HOST_URL}/auth/signin`, {email: this.state.email, password: this.state.password});
        console.log("user logged in", response.data)
        Cookies.set('token', response.data.token, { secure: true, sameSite: 'Strict' });
        window.token = response.data.token
        this.props.history.push('/blockChats');
        this.setState({ error: '' })
    } catch(err) {
      this.setState({
        error: err?.response?.data?.message ?? 'Server Error'
      })
      console.log("Login Error", err.response.data.message)
    }
  }

  handleChangeData = (name, value) => {
    this.setState({
        [name]: value
    })
  }

  handleCreateAccount = () => {
    toast.success("Contacte con tu proveedor del servicio para que te cree una cuenta", {
        style: {
            backgroundColor: ColorHex.GreenDark_1,
            color: '#fff',
            fontWeight: 'bold',
            padding: '10px',
        },
        progressStyle: {
            backgroundColor: '#fff',
        },
        autoClose: 5000,
        icon: false
    });
  }

  getErrorMessage = () => {
    if (this.state.error === 'email') {
      return "*No existe una cuenta asociada a este correo.";
    } else if (this.state.error === 'password') {
      return "*Contraseña incorrecta.";
    } else if(this.state.error.length > 0) {
      return "*Ocurrió un error en el servidor.";
    }
  };

  render() {
    const loginCardStyling = {
        width: '400px',
        height: '456px',
        marginTop: '10px',
        alignItems: 'center',
        padding: '15px',
        boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
        border: `1px solid ${ColorHex.BorderColor}`,
        borderRadius: '12px',
        backgroundColor: ColorHex.White,
    }

    const inputStyling = {
        marginBottom: '25px'
    }

    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '200px'}}>
        <ToastContainer />
        <img src='./images/Whatsbot_Green.png' alt="Logo" className="img-fluid" style={{ width: '350px', height: "350px", marginTop: '7px', marginRight: '250px',  }} />
        <div style={loginCardStyling}>
            <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.RedFabri, position: 'absolute', top: 200}}>
              {this.getErrorMessage()}
            </p>
            <div style={inputStyling}><CustomInput hasError={this.state.error == 'email'} width='364px' height='65px' dataType="text" placeHolderText="Correo" onChange={(value) => this.handleChangeData("email", value)}/></div>
            <div style={inputStyling}><CustomInput hasError={this.state.error == 'password'} width='364px' height='65px' dataType="text" placeHolderText="Contraseña" onChange={(value) => this.handleChangeData("password", value)}/></div>
            <div style={inputStyling}><CustomButton text="Iniciar Sesión"  width="364px" height="65px" classStyle='btnGreen-clicked' onClickCallback={this.handleLogin}/></div>
            <hr />
            <p style={{...CssProperties.BodyTextStyle, color: ColorHex.TextBody, justifySelf: 'center'}}>No tenes una cuenta?</p>
            <div style={{...inputStyling, marginTop: '15px', justifySelf: 'center'}}><CustomButton text="Crear Cuenta" classStyle='btnGreen'  width="264px" height="65px" onClickCallback={this.handleCreateAccount}/></div>
        </div>
      </div>
    );
  }
}

export default withRouter(LoginScreen);
