import axios from 'axios';
import React, { Component } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import CustomButton from '../Searchbar/CustomButton';
import CustomDatePicker from '../Searchbar/CustomDatePicker';
import CustomInput from '../Searchbar/CustomInput';
import CustomScroll from '../Searchbar/CustomScroll';
import CustomSelect from '../Searchbar/CustomSelect';

class InventoryEditItemScreen extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            itemToEdit: {
                name: '',
                code: '',
                description: '',
                tags: [],
                price: '',
                imageLink: ''
            },
            newTagInput: ''
        };
    }

    componentDidUpdate = (prevProps) => {
        //Don't update if user didnt swap items
        if(this.props?.itemToEdit?.name == prevProps?.itemToEdit?.name) {return;}

        this.setState({
            itemToEdit: this.props.itemToEdit
        })
    }

    handleAddNewTag = () => {
        const newTag = this.state.newTagInput
        this.props.addNewTagCallback(newTag)

        const newTagsArray = [...this.state.itemToEdit.tags, newTag]

        this.setState({
            itemToEdit: {
                ...this.state.itemToEdit,
                tags: newTagsArray
            },
            newTagInput: "",
        })
    }

     handleSave = async () => {
        const itemToEdit = this.state.itemToEdit
        this.props.closeCallback()

        try {
            if(this.props.isCreateItem) {
                let newItem = {...itemToEdit}
                newItem.code = itemToEdit.name
                newItem.amount = 20

                if(!newItem.name || newItem.name.length < 1) { this.props.showPopup(new Error("Falta ponerle un nombre al item!")); return;}
                if(!newItem.imageLink || newItem.imageLink.length < 1) { this.props.showPopup(new Error("Falta ponerle una imagen al item!")); return;}
                if(!newItem.description || newItem.description.length < 1) { this.props.showPopup(new Error("Falta ponerle una descripcion al item!")); return;}
                if(!newItem.tags || newItem.tags.length < 1) { this.props.showPopup(new Error("Falta ponerle etiquetas al item!")); return;}
                
                const response = await axios.post(`${process.env.REACT_APP_HOST_URL}/inventory/addItems`, [newItem]);
            } else {
                const response = await axios.put(`${process.env.REACT_APP_HOST_URL}/inventory/updateItem`, itemToEdit);
            }
            this.props.updateProductsCallback(itemToEdit)
            return null
          } catch (error) {
            console.log("ERROR", error)
            this.props.showPopup(new Error("Ya existe un item con este nombre!"));
          }
    }

    handleStringChange = (name, value) => {

        if(name == "newTagInput") {
            this.setState({
                newTagInput: value
            })

            return;
        }

        this.setState({
            itemToEdit: {
                ...this.state.itemToEdit,
                [name]: value
            }
        })
    }

    handleTagChange = (e) => {
        const selectedOptions = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
        this.setState(prevState => ({
            itemToEdit: {
                ...prevState.itemToEdit,
                tags: selectedOptions
            }
        }));
    }

    render() {
        return (
            <div>
                <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>Crear Item</p>
                <div style={{display: 'flex', width: '100%', paddingTop: '25px', marginTop: '-25px'}}>
                    <div class="flex-grow-1" style={{paddingRight: '25px'}}><CustomButton text="Crear Item" classStyle="btnGreen" width="182px" height="45px" icon="save" onClickCallback={this.handleSave}/></div>
                    <div class="flex-grow-1"style={{paddingRight: '25px'}}><CustomButton text="Cancelar Creacion" classStyle="btnRed" icon="cancel" link="inventory"/></div>
                    <div className="col-10"></div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <p style={headersStyle}>Nombre del item *</p>
                        <CustomInput
                            width='800px'
                            height='75px'
                            placeHolderText="Ingresar nombre de item......"
                            dataType="text"
                            onChange={(value) => this.handleStringChange("name", value)}
                        />
                    </div>
                    <div className="col-6">
                        <p style={headersStyle}>Agregar Nuevas Etiquetas</p>
                        <CustomInput
                            width='800px'
                            height='75px'
                            placeHolderText="Ingresar una nueva etiqueta para agregar......"
                            dataType="text"
                            onChange={(value) => this.handleStringChange("newTagInput", value)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <p style={headersStyle}>Descripcion del item *</p>     
                        <CustomInput
                            width='800px'
                            height='75px'
                            placeHolderText="Ingresar descripcion del item......"
                            dataType="text"
                            onChange={(value) => this.handleStringChange("description", value)}
                        />
                    </div>
                    <div className="col-6">
                        {/* <p style={headersStyle}>Puntos</p>
                        <CustomInput
                            placeHolderText="Ingresar puntos de descuento usados......"
                            dataType="number"
                            onChange={this.handlePointsChange}
                        /> */}
                    </div>
                </div>
    
                {/* <p style={headersStyle}>Pedido del Cliente *</p>
                <CustomScroll panelIncluded={true} blocks={itemsHtml}/> */}
            </div>
        )
    }
}

const headersStyle = {
    ...CssProperties.SmallHeaderTextStyle,
    color: ColorHex.TextBody, 
    marginTop: '25px'
}

export default InventoryEditItemScreen;