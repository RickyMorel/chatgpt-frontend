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
import CustomTextArea from '../Searchbar/CustomTextArea';

class CreateExampleConversationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            selectedUser: 'Cliente',
            messageText: '',
            creationDate: new Date(),
            nextId: 1,
            isCreateExample: true,
            editingId: null, // New state for tracking edits
        };

        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleAddMessage = this.handleAddMessage.bind(this);
        this.handleClearConversation = this.handleClearConversation.bind(this);
    }

    componentDidMount() {
        const exampleData = this.props.location && this.props.location.state ? this.props.location.state.linkData : undefined;

        this.setState({
            messages: exampleData ? this.formatMessages([...exampleData.correctedChat]) : [],
            creationDate: exampleData ? exampleData.creationDate : new Date(),
            isCreateExample: exampleData == undefined,
            nextId: exampleData?.length ?? 1
        })
    }

    formatMessages(dbMessages) {
        let formattedMessages = []
        let nextId = 0
        dbMessages.forEach(message => {
            const newMessage = {
                id: nextId,
                sender: message.role == "user" ? "Cliente" : "IA",
                text: message.content
            };
            nextId++
            formattedMessages.push(newMessage)
        });

        return formattedMessages
    }

    handleUserChange(value) {
        this.setState({ selectedUser: value });
    }

    handleTextChange(value) {
        if(value.length)
        this.setState({ messageText: value });
    }

    handleAddMessage() {
        if (!this.state.messageText) return;

        if (this.state.editingId !== null) {
            // Update existing message
            const updatedMessages = this.state.messages.map(message => {
                if (message.id === this.state.editingId) {
                    return {
                        ...message,
                        sender: this.state.selectedUser,
                        text: this.state.messageText
                    };
                }
                return message;
            });

            this.setState(prevState => ({
                messages: updatedMessages,
                messageText: '',
                selectedUser: prevState.selectedUser === "Cliente" ? "IA" : "Cliente",
                editingId: null
            }));
        } else {
            // Add new message
            const newMessage = {
                id: this.state.nextId,
                sender: this.state.selectedUser,
                text: this.state.messageText
            };

            this.setState(prevState => ({
                messages: [...prevState.messages, newMessage],
                messageText: '',
                nextId: prevState.nextId + 1,
                selectedUser: prevState.selectedUser === "Cliente" ? "IA" : "Cliente"
            }));
        }
    }

    handleClearConversation() {
        this.setState({ 
            messages: [], 
            nextId: 1, 
            selectedUser: 'Cliente',
            editingId: null 
        });
    }

    handleEditMessage = (message) => {
        this.setState({
            editingId: message.id,
            selectedUser: message.sender,
            messageText: message.text
        });
    };

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
            if(this.state.isCreateExample) {
                const response = await HttpRequest.post(`/self-learn/create`, {
                    chat: formattedMessages,
                    wasGoodResponse: true,
                    correctedChat: formattedMessages,
                });
            } else {
                console.log("creationDate for update", new Date(this.state.creationDate).toISOString())
                const response = await HttpRequest.put(`/self-learn/update`, {
                    correctedChat: formattedMessages,
                    creationDate: new Date(this.state.creationDate).toISOString()
                });
                this.props.history.goBack()
            }
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
                <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>{this.state.isCreateExample ? 'Crear Conversacion Ejemplo' : 'Editar Conversacion Ejemplo'}</p>
                <div style={{display: 'flex', width: '100%', paddingTop: '25px', marginTop: '-25px'}}>
                    <div class="flex-grow-1" style={{paddingRight: '25px'}}><CustomButton text={this.state.isCreateExample ? 'Crear Ejemplo' : 'Editar Ejemplo'} classStyle="btnGreen" width="182px" height="45px" icon={this.state.isCreateExample ? faSquarePlus : faPenToSquare} onClickCallback={this.handleSave}/></div>
                    <div class="flex-grow-1"style={{paddingRight: '25px'}}><CustomButton text={this.state.isCreateExample ? 'Cancelar Creacion' : 'Cancelar Edicion'} classStyle="btnRed" icon={faRectangleXmark} link="exampleConversations"/></div>
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
                                    <div style={{display: 'flex', marginLeft: 'auto', gap: '10px' }}>
                                        <div><CustomButton icon={faPenToSquare} width="20px" height="20px" iconSize="20px" onClickCallback={() => this.handleEditMessage(message)}/></div>
                                        <div><CustomButton icon={faRectangleXmark} width="20px" height="20px" iconSize="20px" classStyle='btnRed' onClickCallback={() => this.handleRemoveMessage(message.id)}/></div>
                                    </div>
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
                        <CustomButton 
                            text={this.state.editingId !== null ? 'Guardar Cambios' : 'Agregar Mensaje'} 
                            width="150px" 
                            height="45px" 
                            classStyle={this.state.editingId !== null ? 'btnGreen-clicked' : 'btnGreen'}
                            onClickCallback={this.handleAddMessage}
                        />
                        {
                            this.state.editingId ?
                                <CustomButton 
                                    text="Cancelar Edicion" 
                                    width="150px" 
                                    height="45px" 
                                    classStyle={'btnRed-clicked'}
                                    onClickCallback={() => this.setState({editingId: null, messageText: ''})}
                                />
                            :
                                <></>
                        }
                        <CustomButton text="Limpiar Conversacion"  width="200px" height="45px" classStyle='btnRed' onClickCallback={this.handleClearConversation}/>
                    </div>
                    <CustomTextArea 
                        value={this.state.messageText} 
                        noPadding={false} 
                        width='600px' 
                        height='250px' 
                        dataType="text" 
                        placeHolderText="Texto de Mensaje" 
                        onChange={(value) => this.handleTextChange(value)}
                    />
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
        marginBottom: '15px'
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