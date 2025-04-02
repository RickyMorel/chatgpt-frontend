import { faPenToSquare, faRectangleXmark, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import React, { Component } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from 'react-toastify';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import HttpRequest from '../HttpRequest';
import CustomButton from '../Searchbar/CustomButton';
import CustomSelect from '../Searchbar/CustomSelect';
import CustomTextArea from '../Searchbar/CustomTextArea';

class CreateExampleConversationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            exampleMessages: [],
            selectedUser: 'Cliente',
            messageText: '',
            creationDate: new Date(),
            nextId: 1,
            isCreateExample: true,
            editingId: null, // New state for tracking edits
        };

        this.catalogLink = "[catalogLink]"
        this.atentionPhrase = "Te pasaremos con atencion al cliente"
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

        this.fetchExample()
    }

    fetchExample = async () => {
        try {
          this.props.setIsLoading(true)
          const response = await HttpRequest.get(`/self-learn/example`);
          const formattedExamples = this.formatMessages(response.data.correctedChat)
    
          this.setState({
            exampleMessages: [...formattedExamples]
          })
          this.props.setIsLoading(false)
        } catch (error) {
          console.log("error", error)
          return error
        }
    };

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
        if(value.includes)
        this.setState({ messageText: value });
    }

    handleAddMessage() {
        if (!this.state.messageText) return;

        if(this.state.messageText.includes(this.catalogLink) && this.state.selectedUser != "IA") {
            this.showErrorToast("Solo la IA 🤖 puede pasar el link del catalogo", ColorHex.OrangeFabri)
            return;
        }
        else if(this.state.messageText.includes(this.atentionPhrase) && this.state.selectedUser != "IA") {
            this.showErrorToast("Solo la IA 🤖 puede pasarle al consumidor junto con atencion al cliente", ColorHex.OrangeFabri)
            return;
        }

        if(this.state.messages.find(x => x.text == this.atentionPhrase)) {
            this.showErrorToast("Una vez que WhatsBot haya pasado la conversacion a atencion al cliente, ya no responde mas", ColorHex.RedFabri)
            return;
        }

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

            this.removeAIMessagesBeforeAtentionMessage(newMessage)

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

    handleAddSpecialPhrase = (phrase) => {
        let messageText = this.state.messageText
        messageText = messageText.replaceAll(phrase, "")

        this.setState({
            selectedUser: "IA",
            messageText: messageText + phrase
        });
    }

    handleRemoveMessage = (id) => {
        this.setState(prevState => ({
            messages: prevState.messages.filter(message => message.id !== id)
        }));
    };

    showErrorToast = (message, color) => {
      toast.success(message, {
        style: {
            backgroundColor: color,
            color: '#fff',
            fontWeight: 'bold',
            padding: '10px',
        },
        progressStyle: {
            backgroundColor: '#fff',
        },
        autoClose: 10000,
        icon: false
      });
    }

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

    removeAIMessagesBeforeAtentionMessage = (newMessage) => {
        //if(this.state.messages[this.state.messages.length - 1].text != this.atentionPhrase) { return; }
        if(newMessage.text != this.atentionPhrase) { return; }

        this.showErrorToast("Cuando se envia el mensaje de atencion al cliente, es el unico mensaje que puede enviar", ColorHex.OrangeFabri)

        let messages = this.state.messages.reverse()

        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            
            console.log("messsage", message)

            if(message.sender != "IA") { break; }

            messages.splice(i, 1);
        }

        messages = messages.reverse()

        this.setState({
            messages: messages
        })
    }

    messageElement = (message, isExample) => {
        let messageOwner = message.sender

        if(message.text.includes(this.atentionPhrase)) { messageOwner = "atencion" }

        return (
            <div 
                key={message.id}
                style={{
                    ...messageBubbleStyle(this.state.messages.length < 1, messageOwner),
                }}
            >
                <div style={styles.messageHeader}>
                    <span style={styles.senderName}>{message.sender}</span>
                    {
                        isExample ?
                        <></>
                        :
                        <div style={{display: 'flex', marginLeft: 'auto', gap: '10px' }}>
                            {
                                message.text != this.atentionPhrase ?
                                <div><CustomButton icon={faPenToSquare} width="20px" height="20px" iconSize="20px" onClickCallback={() => this.handleEditMessage(message)}/></div>
                                :
                                <></>
                            }
                            <div><CustomButton icon={faRectangleXmark} width="20px" height="20px" iconSize="20px" classStyle='btnRed' onClickCallback={() => this.handleRemoveMessage(message.id)}/></div>
                        </div>
                    }
                </div>
                <div style={styles.messageText}>{message.text}</div>
            </div>
        )
    }

    render() {
        const dropdownItems = [
            {value: "Cliente", label: "Cliente"},
            {value: "IA", label: "IA"}
        ]

        return (
            <div>
                <ToastContainer />
                <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>{this.state.isCreateExample ? 'Crear Conversacion Ejemplo' : 'Editar Conversacion Ejemplo'}</p>
                <div style={{display: 'flex', width: '100%', paddingTop: '25px', marginTop: '-25px'}}>
                    <div class="flex-grow-1" style={{paddingRight: '25px'}}><CustomButton text={this.state.isCreateExample ? 'Crear Ejemplo' : 'Editar Ejemplo'} classStyle="btnGreen" width="182px" height="45px" icon={this.state.isCreateExample ? faSquarePlus : faPenToSquare} onClickCallback={this.handleSave}/></div>
                    <div class="flex-grow-1"style={{paddingRight: '25px'}}><CustomButton text={this.state.isCreateExample ? 'Cancelar Creacion' : 'Cancelar Edicion'} classStyle="btnRed" icon={faRectangleXmark} link="exampleConversations"/></div>
                    {
                        this.state.messages.length < 1 ?
                        <div class="flex-grow-1"style={{paddingRight: '25px'}}><CustomButton text='Ver Otro Ejemplo' icon={faRotateRight} onClickCallback={this.fetchExample}/></div>
                        :
                        <div className="col-1"></div>
                    }
                    <div className="col-9"></div>
                </div>
                <div style={styles.container}>
                    <div className="row">
                        <div className="col-6">
                            <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody}}>Conversacion</p>
                            <div style={styles.chatWindow}>
                                {
                                    this.state.messages.length > 0 ?
                                    this.state.messages.map(message => (
                                        this.messageElement(message, false)
                                    ))
                                    :
                                    this.state.exampleMessages.map(exampleMessage => (
                                        this.messageElement(exampleMessage, true)
                                    ))
                                }
                            </div>
                        </div>
                        <div className="col-6">
                            <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody}}>Editar</p>
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
                            <div style={styles.controls}>
                                {
                                    this.props?.globalConfig?.usesInventory == true ?
                                    <CustomButton text="Añadir link del catalogo"  width="200px" height="45px" classStyle='btnGreen-clicked' onClickCallback={() => this.handleAddSpecialPhrase(this.catalogLink)}/>
                                    :
                                    <></>
                                }
                                <CustomButton text="Pasar a atencion al cliente"  width="230px" height="45px" classStyle='btnOrange-clicked' onClickCallback={() => this.handleAddSpecialPhrase(this.atentionPhrase)}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const messageBubbleStyle = (isExample, messageOwner) => {
    let backgroundColor = '#e0e0e0'

    if(messageOwner == "IA") { backgroundColor = '#0084ff'}
    else if(messageOwner == "atencion") { backgroundColor = ColorHex.RedFabri }

    return {
        padding: '10px 15px',
        borderRadius: '15px',
        marginBottom: '10px',
        maxWidth: '70%',
        opacity: isExample ? '0.5' : '1',
        backgroundColor: backgroundColor,
        color: messageOwner == "Cliente" ? 'black' : 'white',
        marginLeft: messageOwner == "Cliente" ? '' : 'auto',
        marginRight: messageOwner == "Cliente" ? 'auto' : ''
    }
}

const styles = {
    container: {
        paddingTop: '20px',
    },
    chatWindow: {
        backgroundColor: '#f5f5f5',
        height: '700px',
        overflowY: 'auto',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
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