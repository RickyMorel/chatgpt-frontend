import React, { Component } from 'react'
import CssProperties from '../CssProperties'
import { ColorHex } from '../Colors'
import CustomButton from '../Searchbar/CustomButton'
import { faPenToSquare, faRectangleXmark, faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import CustomSelect from '../Searchbar/CustomSelect'
import CustomInput from '../Searchbar/CustomInput'

class EditClientScreen extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            fieldsWithErrors: []
        };
    }

    formInput = (title, placeholder, dataName, dataType = 'text') => (
        <>
            <p style={headersStyle}>{title}</p>
            <CustomInput
                width='800px'
                height='75px'
                placeHolderText={placeholder}
                dataType={dataType}
                onChange={(value) => this.handleStringChange(dataName, value)}
                // value={this.state.itemToEdit[dataName]}
                hasError={this.state.fieldsWithErrors.includes(dataName)}
            />
        </>
    )

    render() {
        return (
            <div>
                <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>{'Editar Cliente'}</p>
                <div style={{display: 'flex', width: '100%', paddingTop: '25px', marginTop: '-25px'}}>
                    <div class="flex-grow-1" style={{paddingRight: '25px'}}><CustomButton text={'Editar Item'} classStyle="btnGreen" width="182px" height="45px" icon={faPenToSquare} onClickCallback={this.handleSave}/></div>
                    <div class="flex-grow-1"style={{paddingRight: '25px'}}><CustomButton text={'Cancelar Cambios'} classStyle="btnRed" icon={faRectangleXmark} link="inventory"/></div>
                    <div className="col-10"></div>
                </div>
                <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.RedFabri, marginTop: '10px', marginBottom: '-5px'}}>
                    {
                        this.state?.fieldsWithErrors?.map(x => {
                            if(x == 'name') {return "*Falta nombre.\n"} 
                            else if(x == 'description') {return "*Falta descripcion.\n"} 
                            else if(x == 'imageLink') {return "*Falta imagen.\n"} 
                            else if(x == 'tags') {return "*Falta etiquetas.\n"} 
                            else if(x == 'price') {return "*Falta precio.\n"} 
                        })
                    }
                </p>
                <div className="row">
                    <div className="col-6">
                        {this.formInput("Numero de Cliente *", " ", "phoneNumber")}
                        {this.formInput("Nombre de Cliente *", "Ingresar nombre de cliente......", "name")}
                        <p style={headersStyle}>Barrio *</p>
                        <CustomSelect
                            width='800px'
                            placeHolderText={"Ingresar el barrio....."}
                            // options={allTagOptions}
                            onChange={this.handleTagChange}
                            // value={this.state.itemToEdit.tags.map(x => ({value: x, label: x}))}
                            isSearchable={true}
                        />
                    </div>
                    <div className="col-6">
                        <p style={headersStyle}>Foto de Ubicacion</p>
                        <div style={{...blockStyle, height: '305px'}}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                ...scrollStyle
                            }}>
                                {
                                    this.state?.itemToEdit?.imageLink?.length > 0 ?
                                    <img style={{ maxWidth: '100%', maxHeight: '100%' }} src={this.state?.itemToEdit?.imageLink} alt="Example Image" />
                                    :
                                    <p style={{...CssProperties.MediumHeadetTextStyle, color: ColorHex.TextBody}}>Imagen No Encontrado</p>
                                }
                            </div>
                        </div>
                        <div style={{display: 'flex', paddingBottom: '0px'}}>
                            <div className="flex-grow-2" style={{paddingRight: '25px'}}>
                                <CustomInput
                                    width='700px'
                                    height='75px'
                                    placeHolderText="Ingresar una nueva etiqueta para agregar......"
                                    dataType="text"
                                    onChange={(value) => this.handleStringChange("newTagInput", value)}
                                />
                            </div>
                            <div className="flex-grow-1">
                                <button onClick={this.handleAddNewTag} style={addNewTagButtonStyle}>
                                    <i className='material-icons' style={{ fontSize: '40px'}}>add</i>
                                </button>
                            </div>
                        </div>
                        <p style={headersStyle}>Etiquetas del item</p>
                        <CustomSelect
                            width='800px'
                            placeHolderText={"Ingresar las etiquetas del item......"}
                            // options={allTagOptions}
                            onChange={this.handleTagChange}
                            // value={this.state.itemToEdit.tags.map(x => ({value: x, label: x}))}
                            isSearchable={true}
                            isMulti={true}
                        />
                        <div style={{...blockStyle, height: '65%', marginTop: '40px'}}>
                            {/* <div style={{...scrollStyle, overflowY: 'scroll', display: itemTagsHtml.length > 0 ? '' : 'flex' }}>
                                {
                                    itemTagsHtml.length > 0 ?
                                    itemTagsHtml
                                    :
                                    <p style={{...CssProperties.MediumHeadetTextStyle, color: ColorHex.TextBody}}>No Tiene Etiquetas</p>
                                }
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const scrollStyle = {
    borderRadius: '10px',
    backgroundColor: ColorHex.Background,
    padding: '10px',
    boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.3)',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }

const blockStyle = {
    width: '800px',
    marginTop: '10px',
    marginTop: '25px',
    padding: '25px',
    boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
    border: `1px solid ${ColorHex.BorderColor}`,
    borderRadius: '10px',
    backgroundColor: ColorHex.White
}

const headersStyle = {
    ...CssProperties.SmallHeaderTextStyle,
    color: ColorHex.TextBody, 
    marginTop: '10px',
    marginBottom: '0px'
}

const addNewTagButtonStyle = {
    backgroundColor: ColorHex.White,
    fontColor: ColorHex.TextBody,
    width: '75px',
    height: '75px',
    borderRadius: '10px',
    boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
    border: `1px solid ${ColorHex.BorderColor}`,
    position: 'relative',
    display: 'flex',   
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingLeft: '15px',
    paddingRight: '15px',
    color: ColorHex.TextBody,
    textAlign: 'center',
    outline: 'none',
}

export default EditClientScreen