import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import React, { Component } from 'react';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import CustomButton from '../Searchbar/CustomButton';
import SearchBar from '../Searchbar/Searchbar';
import StatCard from '../Searchbar/StatCard';
import HttpRequest from '../HttpRequest';
import ExampleConversationComponent from '../ExampleConversations/ExampleConversationComponent';
import QuestionAndAnswerComponent from './QuestionAndAnswerComponent';

class QuestionsAndAnswersScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
        questions: []
    };
  }

  componentDidMount() {
    this.fetchAllExamples()
  }

  fetchAllExamples = async () => {
    try {
      const response = await HttpRequest.get(`/questions-and-answers/all`);

      this.setState({
        questions: [...response.data]
      })
    } catch (error) {
      console.log("error", error)
      return error
    }
  };

  openDeleteExamplePopup = (creationDate) => {
    console.log("openDeleteExamplePopup", creationDate)
      this.props.showPopup_2_Buttons(
        "Eliminar Pregunta y Respuesta",
        `Estas seguro que queres eliminar esta pregunta?`,
        " ",
        [],
        () => this.deleteQuestion(creationDate),
        undefined,
        "Cancelar",
        "Confirmar"
    )
  }

  deleteQuestion = async (creationDate) => {
    this.props.setIsLoading(true)

    try {
        const response = await HttpRequest.put(`/questions-and-answers/delete`, {
          creationDate: new Date(creationDate).toISOString()
        });
        let updatedExamples = [...this.state.questions]
        updatedExamples = updatedExamples.filter(x => x.creationDate != creationDate)
        console.log("updatedExamples", updatedExamples)
        this.setState({questions: [...updatedExamples]})
      } catch (error) {
        console.log("ERROR", error)
        this.props.showPopup(new Error("No se eliminar la pregunta"));
      }

    this.props.setIsLoading(false)
}

  render() {
    const allExamplesList = this.state.questions?.map(x => {
        return(
            <QuestionAndAnswerComponent 
                key={x.creationDate}
                questionObj={x}
                deleteCallback={this.openDeleteExamplePopup}
            />
        )
    });

    return (
        <div>
            <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>Preguntas y Respuestas</p>

            <div style={{display: 'flex'}}>
                <div class="flex-grow-1"><StatCard title="Preguntas" amountColor={ColorHex.TextBody} amountFunction={() => this.state.questions.length}/></div>
                <div className="col-11"></div>
            </div>

            <div style={{display: 'flex', width: '100%', paddingTop: '25px'}}>
                <div class="flex-grow-1" style={{paddingRight: '25px'}}><CustomButton text={'Crear Pregunta'} width="170px" height="45px" icon={faSquarePlus} link='createQuestionAndAnswer'/></div>
                <div className="col-11"></div>
            </div>

            <div style={inventoryPanelStyling}>
                <SearchBar width='100%' height='45px' itemList={this.state.products} searchText="Buscar Pregunta..." OnSearchCallback={this.handleSearchInputChange}/>
                <div style={{ alignItems: 'center', height: '45px', display: 'flex', marginTop: '10px'}}>
                    <div style={headerStyle} className='col-9'>Pregunta</div>
                    <div style={headerStyle} className='col-2'>Fecha de Creacion</div>
                    <div style={headerStyle} className='col-1'></div>
                </div>
                <div style={scrollPanelStyle}>
                    <div style={scrollStyle}>
                        {allExamplesList}
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

const headerStyle = {
  textAlign: 'center',
  color: ColorHex.TextBody,
  ...CssProperties.BodyTextStyle
}

const scrollStyle = {
    overflowY: 'scroll', 
    height: '100%',
    width: '100%',
    alignItems: 'center',
    overflowX: 'hidden'
  }

const scrollPanelStyle = {
    borderRadius: '10px',
    backgroundColor: ColorHex.Background,
    padding: '10px',
    marginTop: '20px',
    boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.3)',
    height: '80%',
    width: '100%',
    alignItems: 'center',
    paddingTop: '10px'
}

const inventoryPanelStyling = {
    width: '100%',
    height: '70vh',
    marginTop: '10px',
    marginTop: '25px',
    padding: '25px',
    boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
    border: `1px solid ${ColorHex.BorderColor}`,
    borderRadius: '10px',
    backgroundColor: ColorHex.White
}

export default QuestionsAndAnswersScreen;
