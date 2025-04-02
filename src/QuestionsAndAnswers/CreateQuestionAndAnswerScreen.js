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
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';

class CreateQuestionAndAnswerScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: '',
            answer: '',
            isCreateExample: true,
            exampleQuestion: '',
            exampleAnswer: ''
        };
    }

    componentDidMount() {
        const exampleData = this.props.location && this.props.location.state ? this.props.location.state.linkData : undefined;

        this.setState({
            question: exampleData ? exampleData.question : "",
            answer: exampleData ? exampleData.answer : "",
            creationDate: exampleData ? exampleData.creationDate : new Date(),
            isCreateExample: exampleData == undefined,
        })

        this.fetchExample()
    }

    fetchExample = async () => {
        try {
          const response = await HttpRequest.get(`/questions-and-answers/example`);
    
          this.setState({
            exampleQuestion: response.data.question,
            exampleAnswer: response.data.answer
          })
        } catch (error) {
          console.log("error", error)
          return error
        }
      };

    handleValueChange(property, value) {
        this.setState({ [property]: value });
    }

    handleSave = async () => {
        this.props.setIsLoading(true)

        try {
            if(this.state.isCreateExample) {
                const response = await HttpRequest.post(`/questions-and-answers/create`, {
                    question: this.state.question,
                    answer: this.state.answer
                });
            } else {
                const response = await HttpRequest.put(`/questions-and-answers/update`, {
                    question: this.state.question,
                    answer: this.state.answer,
                    creationDate: new Date(this.state.creationDate).toISOString()
                });
                this.props.history.goBack()
            }
           this.setState({question: '', answer: ''})
          } catch (error) {
            console.log("ERROR", error)
            this.props.showPopup(new Error("No se pudo guardar el ejemplo"));
          }

        this.props.setIsLoading(false)
    }

    render() {
        return (
            <div>
                <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>{this.state.isCreateExample ? 'Crear Pregunta y Respuesta' : 'Editar Pregunta y Respuesta'}</p>
                <div style={{display: 'flex', width: '100%', paddingTop: '25px', marginTop: '-25px'}}>
                    <div class="flex-grow-1" style={{paddingRight: '25px'}}><CustomButton text={this.state.isCreateExample ? 'Crear Pregunta' : 'Editar Pregunta'} classStyle="btnGreen" width="182px" height="45px" icon={this.state.isCreateExample ? faSquarePlus : faPenToSquare} onClickCallback={this.handleSave}/></div>
                    <div class="flex-grow-1"style={{paddingRight: '25px'}}><CustomButton text={this.state.isCreateExample ? 'Cancelar Creacion' : 'Cancelar Edicion'} classStyle="btnRed" icon={faRectangleXmark} link="questionsAndAnswers"/></div>
                    {
                        this.state.answer.length < 1 && this.state.question.length < 1 ?
                        <div class="flex-grow-1"style={{paddingRight: '25px'}}><CustomButton text='Ver Otro Ejemplo' icon={faRotateRight} onClickCallback={this.fetchExample}/></div>
                        :
                        <div className="col-1"></div>
                    }
                    <div className="col-9"></div>
                </div>
                <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginTop: '15px'}}>Pregunta *</p>
                <CustomInput value={this.state.question} noPadding={false} width='600px' height='45px' dataType="text" placeHolderText={`Ej: ${this.state.exampleQuestion}`} onChange={(value) => this.handleValueChange("question", value)}/>
                <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, marginTop: '15px'}}>Respuesta *</p>
                <CustomTextArea 
                    value={this.state.answer} 
                    noPadding={false} 
                    width='600px' 
                    height='250px' 
                    dataType="text" 
                    placeHolderText={`Ej: ${this.state.exampleAnswer}`}
                    onChange={(value) => this.handleValueChange("answer", value)}
                />
                {/* <CustomInput value={this.state.answer} noPadding={false} width='600px' height='45px' dataType="text" placeHolderText="Ej: Nosotros abrimos desde las 9:00 hasta las 17:00" onChange={(value) => this.handleValueChange("answer", value)}/> */}
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

export default CreateQuestionAndAnswerScreen;