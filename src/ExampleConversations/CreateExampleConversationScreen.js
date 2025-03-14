import React, { Component } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import CustomInput from '../Searchbar/CustomInput';
import CustomButton from '../Searchbar/CustomButton';
import { Dropdown } from 'rsuite';
import CustomSelect from '../Searchbar/CustomSelect';
import CssProperties from '../CssProperties';
import { ColorHex } from '../Colors';
import { faPenToSquare, faRectangleXmark, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import HttpRequest from '../HttpRequest';

class CreateExampleConversationScreen extends Component {
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
        return (
            <div>
                <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>{this.state.isCreateItem ? 'Crear Conversacion Ejemplo' : 'Editar Conversacion Ejemplo'}</p>
                <div style={{display: 'flex', width: '100%', paddingTop: '25px', marginTop: '-25px'}}>
                    <div class="flex-grow-1" style={{paddingRight: '25px'}}><CustomButton text={this.state.isCreateItem ? 'Crear Ejemplo' : 'Editar Ejemplo'} classStyle="btnGreen" width="182px" height="45px" icon={this.state.isCreateItem ? faSquarePlus : faPenToSquare} onClickCallback={this.handleSave}/></div>
                    <div class="flex-grow-1"style={{paddingRight: '25px'}}><CustomButton text={this.state.isCreateItem ? 'Cancelar Creacion' : 'Cancelar Edicion'} classStyle="btnRed" icon={faRectangleXmark} link="inventory"/></div>
                    <div className="col-10"></div>
                </div>
                <div style={styles.container}>
                    <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody}}>Conversacion</p>
                    <div style={styles.chatWindow}>
                        {this.state.messages.map(message => (
                            <div 
                                key={message.id}
                                style={{
                                    ...styles.messageBubble,
                                    ...(message.sender === 'Cliente' ? styles.user1 : styles.user2)
                                }}
                            >
                                <div style={styles.messageHeader}>
                                    <span style={styles.senderName}>{message.sender}</span>
                                    <div><CustomButton icon={faRectangleXmark} width="20px" height="20px" iconSize="20px" classStyle='btnRed' onClickCallback={() => this.handleRemoveMessage(message.id)}/></div>
                                </div>
                                <div style={styles.messageText}>{message.text}</div>
                            </div>
                        ))}
                    </div>
                    
                    <div style={styles.controls}>
                        <CustomSelect
                        width="180px"
                            height='45px'
                            options={dropdownItems}
                            onChange={(value) => {this.handleUserChange(value.value)}}
                            value={dropdownItems.find(x => x.value == this.state.selectedUser)}
                            isSearchable={false}
                        />
                        <CustomInput value={this.state.messageText} noPadding={false} width='600px' height='45px' dataType="text" placeHolderText="Texto de Mensaje" onChange={(value) => this.handleTextChange(value)}/>
                        <CustomButton text="Agregar Mensaje"  width="150px" height="45px" classStyle='btnGreen' onClickCallback={this.handleAddMessage}/>
                        <CustomButton text="Limpiar Conversacion"  width="200px" height="45px" classStyle='btnRed' onClickCallback={this.handleClearConversation}/>
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
        gap: '10px'
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

export default CreateExampleConversationScreen;