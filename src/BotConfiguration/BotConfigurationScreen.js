import { faComments, faPenToSquare, faRectangleXmark, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import React, { Component } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import HttpRequest from '../HttpRequest';
import CustomButton from '../Searchbar/CustomButton';
import CustomInput from '../Searchbar/CustomInput';
import CustomSelect from '../Searchbar/CustomSelect';
import { faFloppyDisk, faQuestion } from '@fortawesome/free-solid-svg-icons';
import CustomTextArea from '../Searchbar/CustomTextArea';
import CustomToggle from '../Searchbar/CustomToggle';
import Utils from '../Utils';

class BotConfigurationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            botNumber: '',
            aiRoleFrase: '',
            companyDescriptionFrase: '',
            customerServiceFrase: '',
            permanentlyBlockClientsAfterCustomerService: false,
            usesInventory: false,
            needsToSave: false
        };
    }

    componentDidMount = () => {
        this.fetchGlobalConfig()
    }

    fetchGlobalConfig = async () => {
        try {
            const response = await HttpRequest.get(`/global-config`);

            console.log("fetchGlobalConfig", response.data)
    
            this.setState({
                botNumber: response.data.botNumber,
                aiRoleFrase: response.data.aiRoleFrase,
                companyDescriptionFrase: response.data.companyDescriptionFrase,
                customerServicePhrase: response.data.customerServiceFrase,
                permanentlyBlockClientsAfterCustomerService: response.data.permanentlyBlockClientsAfterCustomerService,
                usesInventory: response.data.usesInventory
            })
        } catch (error) {}
      }

    handleValueChange(property, value) {
        this.setState({ 
            [property]: value,
            needsToSave: true
         });
    }

    handleSave = async () => {
        this.props.setIsLoading(true)

        console.log("handleSave globalConfig", this.state)

        try {
            const response = await HttpRequest.put(`/global-config`, {
                botNumber: this.state.botNumber,
                aiRoleFrase: this.state.aiRoleFrase,
                companyDescriptionFrase: this.state.companyDescriptionFrase,
                customerServicePhrase: this.state.customerServiceFrase,
                permanentlyBlockClientsAfterCustomerService: this.state.permanentlyBlockClientsAfterCustomerService,
                usesInventory: this.state.usesInventory
            });
            this.setState({needsToSave: false})
          } catch (error) {
            console.log("ERROR", error)
            this.props.showPopup(new Error("No se pudo guardar el ejemplo"));
          }

        this.props.setIsLoading(false)
        window.location.reload();
    }

    render() {
        return (
            <div>
                <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>Configuración IA</p>
                <div style={{display: 'flex', width: '100%', paddingTop: '25px', marginTop: '-25px'}}>
                    <div class="flex-grow-1" style={{paddingRight: '25px'}}><CustomButton text={'Conversaciones Ejemplo'} width="252px" height="45px" icon={faComments} link='exampleConversations'/></div>
                    <div class="flex-grow-1"style={{paddingRight: '25px'}}><CustomButton text={'Preguntas Frecuentes'} icon={faQuestion} link="questionsAndAnswers"/></div>
                    <div class="flex-grow-1">
                        {
                            this.state.needsToSave ? 
                            <CustomButton text="Guardar Cambios"  width="195px" height="45px" classStyle='btnBlue-clicked' icon={faFloppyDisk} onClickCallback={this.handleSave}/>
                            :
                            <></>
                        }
                    </div>
                    <div className="col-10"></div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <div style={styles.container}>
                            <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginTop: '15px'}}>Numero de WhatsApp *</p>
                            <CustomInput value={this.state.botNumber} noPadding={false} width='600px' height='45px' dataType="text" placeHolderText="Ej: 595971602158" onChange={(value) => this.handleValueChange("botNumber", value)}/>
                           
                            <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginTop: '15px'}}>Rol de la IA *</p>
                            <CustomTextArea 
                                value={this.state.aiRoleFrase} 
                                noPadding={false} 
                                width='800px' 
                                height='150px' 
                                placeHolderText="Ej: Eres recepcionista de English Is Easy. Tu trabajo es responder las preguntas de los clientes" 
                                onChange={(value) => this.handleValueChange("aiRoleFrase", value)}
                            />
                            <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginTop: '15px'}}>Descripcion resumida de Empresa *</p>
                            <CustomTextArea 
                                value={this.state.companyDescriptionFrase} 
                                noPadding={false} 
                                width='800px' 
                                height='200px' 
                                placeHolderText="Ej: English Is Easy es un instituto de aprendizaje de inglés. Se dan ambas clases presenciales como virtuales, en donde tenemos un enfoque en gramatica y pronunciacion" 
                                onChange={(value) => this.handleValueChange("companyDescriptionFrase", value)}
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginTop: '15px'}}>Parametros Opcionales</p>
                        <CustomToggle explinationPopupWidth={"700px"} explinationPopupHeight={"110px"} text={`Usar catalogo de productos y/o servicios`} explinationText={Utils.useInventoryExplinationText} onChange={(e) => this.handleValueChange("usesInventory", e.target.checked)} value={this.state.usesInventory}/>
                        <CustomToggle explinationPopupWidth={"700px"} explinationPopupHeight={"220px"} text="Bloquear la conversación con el cliente de forma permanente una vez transferido a atención al cliente" explinationText={Utils.permanantBlockChatExplanationText} onChange={(e) => this.handleValueChange("permanentlyBlockClientsAfterCustomerService", e.target.checked)} value={this.state.permanentlyBlockClientsAfterCustomerService}/>
                    </div>
                </div>
            </div>
        );
    }
}

const styles = {
    container: {
        paddingTop: '20px',
        maxWidth: '70%',
    },
    chatWindow: {
        backgroundColor: '#f5f5f5',
        height: '400px',
        overflowY: 'auto',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
    },
    messageBubble: {
        padding: '10px 15px',
        borderRadius: '15px',
        marginBottom: '10px',
        maxWidth: '70%'
    },
    user1: {
        backgroundColor: '#e0e0e0',
        marginRight: 'auto'
    },
    user2: {
        backgroundColor: '#0084ff',
        color: 'white',
        marginLeft: 'auto'
    },
    messageHeader: {
        marginBottom: '5px',
        fontSize: '0.9em',
        display: 'flex',
        justifyContent: 'space-between'
    },
    senderName: {
        fontWeight: 'bold'
    },
    messageText: {
        whiteSpace: 'pre-wrap'
    },
    controls: {
        display: 'flex',
        gap: '15px',
        marginTop: '15px',
        flexDirection: 'column'
    },
    select: {
        padding: '8px',
        borderRadius: '4px'
    },
    textInput: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        flexGrow: 1
    },
    addButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        padding: '10px',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    clearButton: {
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        padding: '10px',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    deleteButton: {
        background: 'none',
        border: 'none',
        color: '#ff4444',
        cursor: 'pointer',
        fontSize: '1.2em',
        padding: '0 5px',
        ':hover': {
            color: '#cc0000'
        }
    },
};

export default BotConfigurationScreen;