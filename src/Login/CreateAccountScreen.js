import Cookies from 'js-cookie';
import React, { Component } from 'react';
import { isDesktop } from 'react-device-detect';
import { withRouter } from 'react-router-dom/cjs/react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import HttpRequest from '../HttpRequest';
import CustomButton from '../Searchbar/CustomButton';
import CustomInput from '../Searchbar/CustomInput';
import CountryDropdown from '../Searchbar/CountryDropdown';

class CreateAccountScreen extends Component {
  constructor(props) {
      super(props);
  
      this.state = {
        currentStep: 1,
        name: '',
        email: '',
        password: '',
        countryCode: '+595', // New state for country code
        nationalNumber: '', // Changed from phoneNumber
        error: ''
      }
  }

  nextStep = () => {
    const { currentStep } = this.state;
    if (this.validateStep(currentStep)) {
      this.setState({ 
        currentStep: currentStep + 1,
        error: '' 
      });
    }
  }

  prevStep = () => {
    const { currentStep } = this.state;
    this.setState({ 
      currentStep: currentStep - 1,
      error: '' 
    });
  }

  validateStep = (step) => {
    const { name, email, password, nationalNumber  } = this.state;
    switch(step) {
      case 1:
        if (!name.trim()) {
          this.setState({ error: 'Por favor ingresa tu nombre' });
          return false;
        }
        return true;
      case 2:
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
          this.setState({ error: 'Correo electrónico inválido' });
          return false;
        }
        if (!password.match(/^(?=.*\d)(?=.*[A-Z]).{6,}$/)) {
          this.setState({ error: 'La contraseña debe tener al menos 6 caracteres, 1 número y 1 mayúscula' });
          return false;
        }
        return true;
        case 3:
            if (!nationalNumber.match(/^\d{10}$/)) {
                this.setState({ error: 'Número de teléfono inválido (10 dígitos)' });
                return false;
            }
            return true;
      default:
        return true;
    }
  }

  handleCreateAccount = async () => {
    if (!this.validateStep(3)) return;
    
    try {
        const response = await HttpRequest.post('/auth/signup', 
        {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            botNumber: this.state.countryCode + this.state.nationalNumber,
            role: 'manager'
        }, true);
        Cookies.set('token', response.data.token, { secure: true, sameSite: 'Strict' });
        window.token = response.data.token
        this.props.history.push('/blockChats');
        this.setState({ error: '' })
    } catch(err) {
      this.setState({
        error: err?.response?.data?.message ?? 'Error del servidor'
      })
      console.log("Login Error", err.response.data.message)
    }
  }

  handleChangeData = (name, value) => {
    this.setState({
        [name]: value
    })
  }

  renderPhoneInput() {
    const { error, countryCode, nationalNumber } = this.state;
    
    return (
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <CountryDropdown OnChange={(value) => this.setState({countryCode: value})}/>
        </div>
        
        <CustomInput 
          hasError={error.includes('teléfono')}
          width='264px'
          height='65px'
          dataType="tel" 
          placeHolderText="Número de teléfono" 
          value={nationalNumber}
          onChange={(value) => this.handleChangeData('nationalNumber', value)}
        />
      </div>
    );
  }

  renderProgressBar() {
    const { currentStep } = this.state;
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        width: '80%', 
        margin: '20px 0' 
      }}>
        {[1, 2, 3].map((step) => (
          <div key={step} style={{ 
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: currentStep >= step ? ColorHex.GreenDark_1 : ColorHex.BorderColor,
            color: ColorHex.White,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <p style={{...CssProperties.SmallHeaderTextStyle, marginTop: '15px'}}>{currentStep > step ? '✓' : step}</p>
            {step < 3 && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: 'calc(100% + 15px)',
                width: '150px',
                height: '2px',
                backgroundColor: currentStep > step ? ColorHex.GreenDark_1 : ColorHex.BorderColor
              }} />
            )}
          </div>
        ))}
      </div>
    );
  }

  renderStep() {
    const { currentStep, error, name, email, password, phoneNumber } = this.state;
    
    switch(currentStep) {
      case 1:
        return (
          <>
            <CustomInput 
              hasError={error.includes('nombre')}
              width='364px' 
              height='65px' 
              dataType="text" 
              placeHolderText="Nombre completo"
              value={name}
              onChange={(value) => this.handleChangeData("name", value)}
            />
          </>
        );
      case 2:
        return (
          <>
            <CustomInput 
              hasError={error.includes('correo')}
              width='364px' 
              height='65px' 
              dataType="email" 
              placeHolderText="Correo"
              value={email}
              onChange={(value) => this.handleChangeData("email", value)}
            />
            <div style={{ marginTop: '25px' }}>
              <CustomInput 
                hasError={error.includes('contraseña')}
                width='364px' 
                height='65px' 
                dataType="password" 
                placeHolderText="Contraseña" 
                value={password}
                onChange={(value) => this.handleChangeData("password", value)}
              />
            </div>
          </>
        );
      case 3:
        return this.renderPhoneInput();
      default:
        return null;
    }
  }

  render() {
    const { currentStep, error } = this.state;
    const isLastStep = currentStep === 3;

    const cardStyling = {
        width: '600px',
        height: '456px',
        marginTop: '10px',
        alignItems: 'center',
        padding: '15px',
        boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
        border: `1px solid ${ColorHex.BorderColor}`,
        borderRadius: '12px',
        backgroundColor: ColorHex.White,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    }

    return (
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '50px'}}>
        <ToastContainer />
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.GreenDark_1, fontWeight: 'bold', marginTop: '15px', marginRight: '10px'}}>WhatsBot</p>
            <img src='./images/icon.png' alt="Logo" className="img-fluid" style={{ width: '60px', height: "60px"  }} />
        </div>
        <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody}}>¿Estás listo para automatizar tus ventas?</p>
        <div style={cardStyling}>
            {this.renderProgressBar()}
            
            <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.RedFabri, height: '20px', margin: '10px 0'}}>
              {error}
            </p>

            <div style={{ marginBottom: '25px' }}>
              {this.renderStep()}
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              {currentStep > 1 && (
                <CustomButton 
                  text="Atrás" 
                  width="172px" 
                  height="65px" 
                  classStyle='btnGray' 
                  onClickCallback={this.prevStep}
                />
              )}
              
              <CustomButton 
                text={isLastStep ? "Crear Cuenta" : "Siguiente"} 
                width="172px" 
                height="65px" 
                classStyle='btnGreen-clicked' 
                onClickCallback={isLastStep ? this.handleCreateAccount : this.nextStep}
              />
            </div>
        </div>
      </div>
    );
  }
}

export default withRouter(CreateAccountScreen);