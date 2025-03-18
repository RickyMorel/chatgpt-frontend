import { faComments, faPenToSquare, faRectangleXmark, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import React, { Component } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import HttpRequest from '../HttpRequest';
import CustomButton from '../Searchbar/CustomButton';
import CustomInput from '../Searchbar/CustomInput';
import CustomSelect from '../Searchbar/CustomSelect';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import CustomTextArea from '../Searchbar/CustomTextArea';
import CustomToggle from '../Searchbar/CustomToggle';

class BotConfigurationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            selectedUser: 'Cliente',
            messageText: '',
            nextId: 1,
            isCreateItem: true
        };

        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleAddMessage = this.handleAddMessage.bind(this);
        this.handleClearConversation = this.handleClearConversation.bind(this);
    }

    handleUserChange(value) {
        this.setState({ selectedUser: value });
    }

    handleTextChange(value) {
        this.setState({ messageText: value });
    }

    handleAddMessage() {
        if (!this.state.messageText) return;

        const newMessage = {
            id: this.state.nextId,
            sender: this.state.selectedUser,
            text: this.state.messageText
        };

        this.setState(prevState => ({
            messages: [...prevState.messages, newMessage],
            messageText: '',
            nextId: prevState.nextId + 1,
            selectedUser: prevState.selectedUser == "Cliente" ? "IA" : "Cliente"
        }));
    }

    handleClearConversation() {
        this.setState({ messages: [], nextId: 1, selectedUser: 'Cliente' });
    }

    handleRemoveMessage = (id) => {
        this.setState(prevState => ({
            messages: prevState.messages.filter(message => message.id !== id)
        }));
    };

    handleSave = async () => {
        this.props.setIsLoading(true)

        try {
            const formattedMessages = this.state.messages.map(x => {
                return (
                    {role: x.sender == "Cliente" ? "user" : "assistant", content: x.text}
                )
            })
            if(this.state.isCreateItem) {
                const response = await HttpRequest.post(`/self-learn/create`, {
                    chat: formattedMessages,
                    wasGoodResponse: true,
                    correctedChat: formattedMessages
                });
            } else {

            }
           // this.props.history.goBack()
           this.handleClearConversation()
          } catch (error) {
            console.log("ERROR", error)
            this.props.showPopup(new Error("No se pudo guardar el ejemplo"));
          }

        this.props.setIsLoading(false)
    }

    render() {
        const dropdownItems = [
            {value: "Cliente", label: "Cliente"},
            {value: "IA", label: "IA"}
        ]
        const explanationText = `<strong>Caso Bloquear:</strong><br/>En un Instituto de Inglés, se establece que la IA interactúe únicamente en el primer contacto con el cliente. Una vez que el cliente se registra como alumno, la IA deja de responder sus mensajes, bloqueando la conversación.<br/><strong>Caso No Bloquear:</strong><br/>En una panadería o restaurante, se requiere que la IA responda cada vez que el cliente se comunique, proporcionando información como precios o detalles de productos, sin bloquear la conversación.`
        return (
            <div>
                <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>Configuración IA</p>
                <div style={{display: 'flex', width: '100%', paddingTop: '25px', marginTop: '-25px'}}>
                    <div class="flex-grow-1" style={{paddingRight: '25px'}}><CustomButton text={'Conversaciones Ejemplo'} width="252px" height="45px" icon={faComments} link='exampleConversations'/></div>
                    <div class="flex-grow-1"style={{paddingRight: '25px'}}><CustomButton text={'Preguntas Frecuentes'} icon={faQuestion} link="inventory"/></div>
                    <div className="col-10"></div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <div style={styles.container}>
                            <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginTop: '15px'}}>Rol de la IA *</p>
                            <CustomTextArea 
                                value={this.state.messageText} 
                                noPadding={false} 
                                width='800px' 
                                height='150px' 
                                placeHolderText="Eres recepcionista de English Is Easy. Tu trabajo es responder las preguntas de los clientes" 
                                onChange={(value) => this.handleTextChange(value)}
                            />
                            <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginTop: '15px'}}>Descripcion resumida de Empresa *</p>
                            <CustomTextArea 
                                value={this.state.messageText} 
                                noPadding={false} 
                                width='800px' 
                                height='200px' 
                                placeHolderText="English Is Easy es un instituto de aprendizaje de inglés. Se dan ambas clases presenciales como virtuales, en donde tenemos un enfoque en gramatica y pronunciacion" 
                                onChange={(value) => this.handleTextChange(value)}
                            />
                            <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginTop: '15px'}}>Frase para dirigir al cliente a atención al cliente *</p>
                            <CustomInput value={this.state.messageText} noPadding={false} width='600px' height='45px' dataType="text" placeHolderText="Te pasaremos con atencion al cliente" onChange={(value) => this.handleTextChange(value)}/>
                        </div>
                    </div>
                    <div className="col-6">
                        <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginTop: '15px'}}>Parametros Opcionales</p>
                        <div style={styles.controls}>
                            <div style={{flexGrow: 0}}><CustomToggle explinationPopupWidth={"700px"} explinationPopupHeight={"220px"} text="Bloquear la conversación con el cliente de forma permanente una vez transferido a atención al cliente" explinationText={explanationText} onChange={this.handleGlobalBlock} value={this.state.isGloballyBlocked}/></div>
                        </div>
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
        gap: '10px',
        marginTop: '15px'
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