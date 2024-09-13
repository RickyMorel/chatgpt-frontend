import React, { Component } from 'react'
import CssProperties from '../CssProperties'
import { ColorHex } from '../Colors'
import CustomButton from '../Searchbar/CustomButton'
import { faPenToSquare, faRectangleXmark, faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import CustomSelect from '../Searchbar/CustomSelect'
import CustomInput from '../Searchbar/CustomInput'
import Map from './Map'
import axios from 'axios';
import RemovableItem from '../Searchbar/RemovableItem'

class EditClientScreen extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            fieldsWithErrors: [],
            clientLocations: [],
            locationData: undefined,
            clientToEdit: undefined
        };
    }

    componentDidMount() {
        const itemData = this.props.location && this.props.location.state ? this.props.location.state.linkData : undefined;

        this.setState({
            clientToEdit: {...itemData},
        })

        this.fetchAllClientLocations()
        this.fetchClientLocation(itemData)
        this.fetchExtraClientData(itemData)
    }

    handleSave = async () => {
        console.log("handleSave")
        const {clientToEdit, locationData} = this.state

        try {
            const clientObj = {
                phoneNumber: clientToEdit.phoneNumber,
                name: clientToEdit.name,
                address: clientToEdit.address,
                location: locationData.location,
                locationPicture: locationData.locationPicture
            }
            console.log("handleSave", clientObj)
            const response = await axios.put(`${process.env.REACT_APP_HOST_URL}/client-crud/updateWithLocation`, clientObj);
            this.props.history.goBack()
        } catch (error) {
            console.log("error", error)
            //this.props.showPopup(new Error(error.response.data.message))
        }
    }

    handleStringChange = (name, value) => {
        this.setState({
            clientToEdit: {
                ...this.state.clientToEdit,
                [name]: value
            }
        })
    }

    fetchAllClientLocations = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/client-crud/getAllClientZones`);
    
          this.setState({
            clientLocations: [...response.data]
          })
        } catch (error) {
          console.log("error", error)
          return error
        }
    };

    fetchExtraClientData = async (clientToEdit) => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/client-crud/getClientByPhoneNumber?phoneNumber=${clientToEdit.phoneNumber}`);
    
          this.setState({
            clientToEdit: response.data
          })
        } catch (error) {
          console.log("error", error)
          return error
        }
    };

    fetchClientLocation = async (clientToEdit) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/client-location/getLocationByNumber?phoneNumber=${clientToEdit.phoneNumber}`);
            
            this.setState({
                locationData: response.data
            })

            console.log(response.data)
        } catch (error) {
            console.log("Error fetching location:", error);
        }
    };

    formInput = (title, placeholder, dataName, dataType = 'text', canEdit = true) => (
        <>
            <p style={headersStyle}>{title}</p>
            <CustomInput
                width='800px'
                height='75px'
                placeHolderText={placeholder}
                dataType={dataType}
                onChange={(value) => this.handleStringChange(dataName, value)}
                value={this.state?.clientToEdit[dataName]}
                hasError={this.state.fieldsWithErrors.includes(dataName)}
                canEdit={canEdit}
            />
        </>
    )

    render() {
        const {clientToEdit, clientLocations, locationData} = this.state
        
        const favoriteFoodsHtml = clientToEdit?.favoriteFoods?.map(x => (
            <RemovableItem itemName={x} deleteCallback={this.handleRemoveTag} width='594px' height='75px'/>
        ))

        let clientLocationOptions = clientLocations?.filter(x => x.includes(",") == false)?.map(x => ({value: x, label: x}))

        return (
            <div>
                <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>{'Editar Cliente'}</p>
                <div style={{display: 'flex', width: '100%', paddingTop: '25px', marginTop: '-25px'}}>
                    <div class="flex-grow-1" style={{paddingRight: '25px'}}><CustomButton text={'Guardar Cambios'} classStyle="btnGreen" width="182px" height="45px" icon={faPenToSquare} onClickCallback={this.handleSave}/></div>
                    <div class="flex-grow-1"style={{paddingRight: '25px'}}><CustomButton text={'Cancelar Cambios'} classStyle="btnRed" icon={faRectangleXmark} link="blockChats"/></div>
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
                        {clientToEdit && this.formInput("Numero de Cliente *", " ", "phoneNumber", "numeric", false)}
                        {clientToEdit && this.formInput("Nombre de Cliente *", "Ingresar nombre de cliente......", "name")}
                        <p style={headersStyle}>Barrio *</p>
                        <CustomSelect
                            width='800px'
                            placeHolderText={"Ingresar el barrio....."}
                            options={clientLocationOptions}
                            onChange={(option) => this.handleStringChange("address", option.value)}
                            value={clientLocationOptions.find(x => x.value == clientToEdit.address)}
                            isSearchable={true}
                        />
                        <p style={headersStyle}>Productos Favoritos</p>
                        <div style={{...blockStyle, height: '65%'}}>
                            <div style={{...scrollStyle, overflowY: 'scroll', display: favoriteFoodsHtml?.length > 0 ? '' : 'flex' }}>
                                {
                                    favoriteFoodsHtml?.length > 0 ?
                                    favoriteFoodsHtml
                                    :
                                    <p style={{...CssProperties.MediumHeadetTextStyle, color: ColorHex.TextBody}}>No Tiene Productos Favoritos</p>
                                }
                            </div>
                        </div>
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
                                    locationData?.locationPicture?.length > 0 ?
                                    <img style={{ maxWidth: '100%', maxHeight: '100%' }} src={locationData?.locationPicture.trim('"')} alt="Example Image" />
                                    :
                                    <p style={{...CssProperties.MediumHeadetTextStyle, color: ColorHex.TextBody}}>Imagen No Encontrado</p>
                                }
                            </div>
                        </div>
                        <p style={headersStyle}>Google Maps Ubicacion</p>
                        <div style={{...blockStyle, height: '85%'}}>
                            <Map clientNumber={clientToEdit?.phoneNumber} positionObj={{ lat: locationData?.location.lat, lng: locationData?.location.lng }}/>
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
  }

const blockStyle = {
    width: '800px',
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