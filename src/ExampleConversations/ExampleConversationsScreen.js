import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import React, { Component } from 'react';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import CustomButton from '../Searchbar/CustomButton';
import SearchBar from '../Searchbar/Searchbar';
import StatCard from '../Searchbar/StatCard';
import HttpRequest from '../HttpRequest';
import ExampleConversationComponent from './ExampleConversationComponent';

class ExampleConversationsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
        examples: []
    };
  }

  componentDidMount() {
    this.fetchAllExamples()
  }

  fetchAllExamples = async () => {
    try {
      const response = await HttpRequest.get(`/self-learn/all`);

      this.setState({
        examples: [...response.data]
      })
    } catch (error) {
      console.log("error", error)
      return error
    }
  };

  openDeleteExamplePopup = (creationDate) => {
    console.log("openDeleteExamplePopup", creationDate)
      this.props.showPopup_2_Buttons(
        "Eliminar Ejemplo",
        `Estas seguro que queres eliminar este ejemplo?`,
        " ",
        [],
        () => this.deleteExample(creationDate),
        undefined,
        "Cancelar",
        "Confirmar"
    )
  }

  deleteExample = async (creationDate) => {
    this.props.setIsLoading(true)

    try {
        const response = await HttpRequest.put(`/self-learn/delete`, {
          creationDate: new Date(creationDate).toISOString()
        });
        let updatedExamples = [...this.state.examples]
        updatedExamples = updatedExamples.filter(x => x.creationDate != creationDate)
        console.log("updatedExamples", updatedExamples)
        this.setState({examples: [...updatedExamples]})
      } catch (error) {
        console.log("ERROR", error)
        this.props.showPopup(new Error("No se eliminar el ejemplo"));
      }

    this.props.setIsLoading(false)
}

  render() {
    const allExamplesList = this.state.examples?.map(x => {
        return(
            <ExampleConversationComponent 
                key={x.creationDate}
                example={x}
                deleteCallback={this.openDeleteExamplePopup}
            />
        )
    });

    return (
        <div>
            <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>Conversaciones Ejemplo</p>

            <div style={{display: 'flex'}}>
                <div class="flex-grow-1"><StatCard title="Ejemplos" amountColor={ColorHex.TextBody} amountFunction={() => this.state.examples.length}/></div>
                <div className="col-11"></div>
            </div>

            <div style={{display: 'flex', width: '100%', paddingTop: '25px'}}>
                <div class="flex-grow-1" style={{paddingRight: '25px'}}><CustomButton text={'Crear Ejemplo'} width="170px" height="45px" icon={faSquarePlus} link='createExampleConversation'/></div>
                <div className="col-11"></div>
            </div>

            <div style={inventoryPanelStyling}>
                <SearchBar width='100%' height='45px' itemList={this.state.products} searchText="Buscar Conversacion..." OnSearchCallback={this.handleSearchInputChange}/>
                <div style={{ alignItems: 'center', height: '45px', display: 'flex', marginTop: '10px'}}>
                    <div style={headerStyle} className='col-8'>Mensajes</div>
                    <div style={headerStyle} className='col-1'>Cantidad Mensajes</div>
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

export default ExampleConversationsScreen;
