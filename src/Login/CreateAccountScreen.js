import React, { Component } from 'react';
import { withRouter } from 'react-router-dom/cjs/react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import { globalEmitter } from '../GlobalEventEmitter';
import HttpRequest from '../HttpRequest';
import CustomButton from '../Searchbar/CustomButton';
import CustomInput from '../Searchbar/CustomInput';
import CustomTextArea from '../Searchbar/CustomTextArea';
import CustomToggle from '../Searchbar/CustomToggle';
import PhoneNumberComponent from '../Searchbar/PhoneNumberComponent';
import Utils from '../Utils';

class CreateAccountScreen extends Component {
  constructor(props) {
      super(props);
  
      this.state = {
        currentStep: 1,
        name: ' ',
        email: '',
        password: '',
        confirmPassword: '',
        usesInventory: true,
        permanentlyBlockClientsAfterCustomerService: false,
        aiRoleFrase: '',
        companyDescriptionFrase: '',
        phoneNumber: '',
        error: ''
      }
  }

  nextStep = async () => {
    const { currentStep } = this.state;
    if (await this.validateStep(currentStep)) {
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

  validateStep = async (step) => {
    const { name, email, password, confirmPassword, phoneNumber, aiRoleFrase, companyDescriptionFrase  } = this.state;
    console.log("validateStep", step)
    switch(step) {
      case 1:
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
          this.setState({ error: 'Correo electrónico inválido' });
          return false;
        }
        else if (!password.match(/^(?=.*\d)(?=.*[A-Z]).{6,}$/)) {
          this.setState({ error: 'La contraseña debe tener al menos 6 caracteres, 1 número y 1 mayúscula' });
          return false;
        }
        else if (password != confirmPassword) {
          this.setState({ error: 'Las contraseñas ingresadas no son iguales' });
          return false;
        }
        else if(await this.confirmIfEmailAlreadyExists()) {
          this.setState({ error: 'Ya existe un usuario con este correo' });
          return false;
        }
        return true;
      case 2:
        console.log("phoneNumber", this.state.phoneNumber)
        if (phoneNumber.length < 9) {
          this.setState({ error: 'Numero invalido' });
          return false;
        }
        else if(await PhoneNumberComponent.confirmIfNumberAlreadyExists(this.state.phoneNumber)) {
          this.setState({ error: 'Numero ya exitse' });
          return false;
        }
        else {
          console.log("VALIDATE STEP 2 TRUE")
          return true;
        }
      case 3:
        if (aiRoleFrase.length < 20) {
            this.setState({ error: 'La descripcion del rol de la IA debe tener al menos 2 oraciones' });
            return false;
        }
        if (companyDescriptionFrase.length < 10) {
          this.setState({ error: 'La descripcion de tu empresa debe tener al menos 1 oracion' });
          return false;
        }
        return true;
      default:
        return true;
    }
  }

  confirmIfEmailAlreadyExists = async () => {
    try {
      const response = await HttpRequest.get(`/global-config/exists?email=${this.state.email}`, true);
      console.log("user logged in", response.data)
      return response.data
    } catch(err) {}
  }

  handleCreateAccount = async () => {    
    try {
        const response = await HttpRequest.post('/auth/signup', 
        {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            botNumber: this.state.phoneNumber,
            usesInventory: this.state.usesInventory,
            permanentlyBlockClientsAfterCustomerService: this.state.permanentlyBlockClientsAfterCustomerService,
            aiRoleFrase: this.state.aiRoleFrase,
            companyDescriptionFrase: this.state.companyDescriptionFrase,
            role: 'manager'
        }, true);
        this.props.history.push('/login');
        globalEmitter.emit('signedUp');   
    } catch(err) {
      this.setState({
        error: err?.response?.data?.message ?? 'Error del servidor'
      })
      console.log("Login Error", err)
    }
  }

  handleChangeData = (name, value) => {
    this.setState({
        [name]: value
    })
  }

  renderPhoneInput() {
    return (
      <PhoneNumberComponent OnChangeCallback={(value) => { console.log("Changed phone value", value); this.setState({phoneNumber: value} )}}/>
    );
  }

  renderBusinessQuestionsInput() {
    return (
      <div style={{paddingLeft: '25px'}}>
        <div style={{marginBottom: '25px'}}><CustomToggle explinationPopupWidth={"700px"} explinationPopupHeight={"110px"} text={`Usar catalogo de productos`} explinationText={Utils.useInventoryExplinationText} onChange={(e) => this.handleChangeData("usesInventory", e.target.checked)} value={this.state.usesInventory}/></div>
        <div><CustomToggle explinationPopupWidth={"700px"} explinationPopupHeight={"220px"} text={`Bloquear la conversación con el cliente de forma permanente una vez transferido a atención al cliente`} explinationText={Utils.permanantBlockChatExplanationText} onChange={(e) => this.handleChangeData("permanentlyBlockClientsAfterCustomerService", e.target.checked)} value={this.state.permanentlyBlockClientsAfterCustomerService}/></div>
      </div>
    )
  }

  renderBusinessDescriptionsInput() {
    return (
      <div>
        <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginTop: '15px'}}>Rol de la IA *</p>
        <CustomTextArea 
            value={this.state.aiRoleFrase} 
            noPadding={false} 
            width='800px' 
            height='150px' 
            placeHolderText="Ej: Eres recepcionista de English Is Easy. Tu trabajo es responder las preguntas de los clientes" 
            onChange={(value) => this.handleChangeData("aiRoleFrase", value)}
        />
        <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginTop: '15px'}}>Descripcion resumida de tu empresa *</p>
        <CustomTextArea 
            value={this.state.companyDescriptionFrase} 
            noPadding={false} 
            width='800px' 
            height='200px' 
            placeHolderText="Ej: English Is Easy es un instituto de aprendizaje de inglés. Se dan ambas clases presenciales como virtuales, en donde tenemos un enfoque en gramatica y pronunciacion" 
            onChange={(value) => this.handleChangeData("companyDescriptionFrase", value)}
        />
      </div>
    )
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
        {[1, 2, 3, 4].map((step) => (
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
            {step < 4 && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: 'calc(100%)',
                width: '90px',
                height: '2px',
                backgroundColor: currentStep > step ? ColorHex.GreenDark_1 : ColorHex.BorderColor
              }} />
            )}
          </div>
        ))}
      </div>
    );
  }

  renderEmailInput = () => {
    const { currentStep, error, name, email, password, confirmPassword, phoneNumber } = this.state;

    return (
      <>
        <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginTop: '15px'}}>Correo electrónico *</p>
        <CustomInput 
          hasError={error.includes('correo')}
          width='364px' 
          height='65px' 
          dataType="email" 
          placeHolderText="tuempresa@gmail.com"
          value={email}
          onChange={(value) => this.handleChangeData("email", value)}
        />
        <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginTop: '15px'}}>Contraseña *</p>
        <div style={{ marginTop: '10px' }}>
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
        <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginTop: '15px'}}>Confirmar Contraseña *</p>
        <div style={{ marginTop: '10px' }}>
          <CustomInput 
            hasError={error.includes('contraseña')}
            width='364px' 
            height='65px' 
            dataType="password" 
            placeHolderText="Contraseña" 
            value={confirmPassword}
            onChange={(value) => this.handleChangeData("confirmPassword", value)}
          />
        </div>
      </>
    );
  }

  renderStep() {
    const { currentStep, error, name, email, password, phoneNumber } = this.state;
    
    switch(currentStep) {
      case 1:
        return this.renderEmailInput();
      case 2:
        return this.renderPhoneInput()
      case 3:
        return this.renderBusinessDescriptionsInput();
      case 4:
        return this.renderBusinessQuestionsInput();
      default:
        return null;
    }
  }

  render() {
    const { currentStep, error } = this.state;
    const isLastStep = currentStep === 4;

    const cardStyling = {
        width: 'auto',
        height: 'auto',
        minWidth: '550px',
        minHeight: '300px',
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
      <div className='main-content' style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '50px', height: '125vh'}}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.GreenDark_1, fontWeight: 'bold', marginTop: '15px', marginRight: '10px'}}>WhatsBot</p>
            <img src='./images/icon.png' alt="Logo" className="img-fluid" style={{ width: '60px', height: "60px"  }} />
        </div>
        <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody}}>¿Estás listo para automatizar tus ventas?</p>
        <div style={cardStyling}>
            {this.renderProgressBar()}
            
            {
              error.length > 0 ?
              <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.RedFabri, height: '20px', margin: '10px 0'}}>
                {error}
              </p>
              :
              <></>
            }

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