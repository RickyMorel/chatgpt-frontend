import { faRectangleXmark, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import React, { Component } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import { globalEmitter } from '../GlobalEventEmitter';
import HttpRequest from '../HttpRequest';
import CustomButton from '../Searchbar/CustomButton';
import CustomFileInput from '../Searchbar/CustomFileInput';
import CustomInput from '../Searchbar/CustomInput';
import CustomTextArea from '../Searchbar/CustomTextArea';
import CustomSelect from '../Searchbar/CustomSelect';
import RemovableItem from '../Searchbar/RemovableItem';

class InventoryEditItemScreen extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            products: [],
            allTags: [],
            itemToEdit: {
                name: '',
                code: '',
                description: '',
                tags: [],
                price: '',
                imageBase64: ''
            },
            newTagInput: '',
            isCreateItem: true,
            fieldsWithErrors: [],
            selectedImage: null
        };
    }

    componentDidMount() {
        const itemData = this.props.location && this.props.location.state ? this.props.location.state.linkData : undefined;

        this.setState({
            itemToEdit: itemData ? {...itemData} : initialItemToEditState,
            isCreateItem: itemData == undefined
        })
        this.fetchProductData()
    }

    componentDidUpdate = (prevProps) => {
        //Don't update if user didnt swap items
        if(this.props?.itemToEdit?.name == prevProps?.itemToEdit?.name) {return;}

        this.setState({
            itemToEdit: this.props.itemToEdit
        })
    }

    fetchProductData = async () => {
        try {
            const response = await HttpRequest.get(`/inventory/allItems`);

            this.getAllTags(response.data)

            this.setState({
                products: response.data,
            });
        } catch (error) {}
    };

    getAllTags = (products) => {
        let allTags = this.state.allTags

        products?.forEach(item => {
            item.tags.forEach(tag => {
                if(allTags.includes(tag) == false) { allTags.push(tag) }
            });
        });

        allTags = allTags?.sort()

        this.setState({
            allTags: allTags
        })
    }

    handleAddNewTag = () => {
        const newTag = this.state.newTagInput

        const newTagsArray = [...this.state.itemToEdit.tags, newTag]

        this.setState({
            itemToEdit: {
                ...this.state.itemToEdit,
                tags: newTagsArray
            },
            // newTagInput: "",
        })
    }

    handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const base64 = e.target.result;
                console.log("setState base64", base64)
                this.setState({ selectedImage: base64 });
            };
            
            reader.readAsDataURL(file);
        }
      };

    handleSave = async () => {
        this.props.setIsLoading(true)

        let itemToEdit = this.state.itemToEdit

        try {
            if(this.state.isCreateItem) {
                let newItem = {...itemToEdit}
                newItem.code = itemToEdit.name
                newItem.amount = 20

                console.log("this.state.selectedImage", this.state.selectedImage)
                if(this.state.selectedImage) {
                    newItem.imageBase64 = this.state.selectedImage
                }

                let missingFields = []
                if(!newItem.name || newItem.name.length < 1) { missingFields.push("name");}
                if(!newItem.imageBase64 || newItem.imageBase64.length < 1) { missingFields.push("imageBase64");}
                if(!newItem.description || newItem.description.length < 1) { missingFields.push("description");}
                if(!newItem.price || newItem.price.length < 1) { missingFields.push("price");}
                // if(!newItem.tags || newItem.tags.length < 1) { missingFields.push("tags");}

                this.setState({
                    fieldsWithErrors: missingFields
                })

                if(missingFields.length > 0) {return;}
                
                const response = await HttpRequest.post(`/inventory/createItem`, newItem);

                if(!this.props.setupConditions.minimumConditionsMet) { globalEmitter.emit('checkMetConditions'); }
            } else {
                if(this.state.selectedImage) {
                    itemToEdit.imageBase64 = this.state.selectedImage
                }
                const response = await HttpRequest.put(`/inventory/updateItem`, itemToEdit);
            }
            this.props.history.goBack()
          } catch (error) {
            console.log("ERROR", error)
            // this.props.showPopup(new Error("Ya existe un item con este nombre!"));
          }

        this.props.setIsLoading(false)
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

    handleTagChange = (options) => {
        const selectedOptions = options.map(x => x.value)

        this.setState(prevState => ({
            itemToEdit: {
                ...prevState.itemToEdit,
                tags: selectedOptions
            }
        }));
    }

    handleRemoveTag = (tagToRemove) => {
        const selectedOptions = this.state.itemToEdit.tags.filter(x => x != tagToRemove)

        this.setState(prevState => ({
            itemToEdit: {
                ...prevState.itemToEdit,
                tags: selectedOptions
            }
        }));
    }

    formInput = (title, placeholder, dataName, explinationText, dataType = 'text', isTextArea=false) => (
        <>
            <p style={headersStyle}>{title}</p>
            {
                isTextArea ? 
                <CustomTextArea
                    width='800px'
                    height='95px'
                    explinationText={explinationText}
                    placeHolderText={placeholder}
                    dataType={dataType}
                    onChange={(value) => this.handleStringChange(dataName, value)}
                    value={this.state.itemToEdit[dataName]}
                    hasError={this.state.fieldsWithErrors.includes(dataName)}
                />
                :
                <CustomInput
                    width='800px'
                    height='75px'
                    explinationText={explinationText}
                    placeHolderText={placeholder}
                    dataType={dataType}
                    onChange={(value) => this.handleStringChange(dataName, value)}
                    value={this.state.itemToEdit[dataName]}
                    hasError={this.state.fieldsWithErrors.includes(dataName)}
                />
            }
        </>
    )

    render() {
        const allTagOptions = this.state.allTags.map(x => ({label: x, value: x}))
        const itemTagsHtml = this.state?.itemToEdit?.tags?.map(x => (
            <RemovableItem itemName={x} deleteCallback={this.handleRemoveTag} width='594px' height='75px'/>
        ))

        return (
            <div>
                <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>{this.state.isCreateItem ? 'Crear Item' : 'Editar Item'}</p>
                <div style={{display: 'flex', width: '100%', paddingTop: '25px', marginTop: '-25px'}}>
                    <div class="flex-grow-1" style={{paddingRight: '25px'}}><CustomButton text={this.state.isCreateItem ? 'Crear Item' : 'Editar Item'} classStyle="btnGreen" width="182px" height="45px" icon={this.state.isCreateItem ? faSquarePlus : faPenToSquare} onClickCallback={this.handleSave}/></div>
                    <div class="flex-grow-1"style={{paddingRight: '25px'}}><CustomButton text={this.state.isCreateItem ? 'Cancelar Creacion' : 'Cancelar Edicion'} classStyle="btnRed" icon={faRectangleXmark} link="inventory"/></div>
                    <div className="col-10"></div>
                </div>
                <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.RedFabri, marginTop: '10px', marginBottom: '-5px'}}>
                    {
                        this.state.fieldsWithErrors.map(x => {
                            if(x == 'name') {return "*Falta nombre.\n"} 
                            else if(x == 'description') {return "*Falta descripcion.\n"} 
                            else if(x == 'imageBase64') {return "*Falta imagen.\n"} 
                            else if(x == 'tags') {return "*Falta etiquetas.\n"} 
                            else if(x == 'price') {return "*Falta precio.\n"} 
                        })
                    }
                </p>
                <div className="row">
                    <div className="col-6">
                        {this.formInput("Nombre del item *", "Ej: Pan de Leche", "name", "Aca solo pondras el nombre del producto")}
                        {this.formInput("Descripcion del item *", "Ej: Es un pan suave y esponjoso, con un toque ligeramente dulce, ideal para el desayuno o la merienda. Está elaborado con harina de trigo, leche, mantequilla y azúcar", "description",  "Aquí debes describir el producto y agregar información relevante, como su valor nutricional, si se vende por kilo o metro cuadrado, si viene en paquete y cuántas unidades incluye, entre otros detalles", "text", true)}
                        {this.formInput("Precio del item *", "Ej: 25000", "price", "Cuanto cuesta tu producto", "number")}
                        <p style={{...headersStyle, marginBottom: '-25px'}}>Imagen *</p>
                        <CustomFileInput imageURL={this.state?.itemToEdit?.imageLink} onChange={this.handleImageChange}/>
                    </div>
                    <div className="col-6">
                        <p style={headersStyle}>Agregar Nuevas Etiquetas</p>
                        <div style={{display: 'flex', paddingBottom: '0px'}}>
                            <div className="flex-grow-2" style={{paddingRight: '25px'}}>
                                <CustomInput
                                    width='700px'
                                    height='75px'
                                    placeHolderText="Ej: harina de trigo"
                                    explinationText="Aquí debes agregar etiquetas a tu producto para que WhatsBot pueda encontrarlo fácilmente. Por ejemplo, un brownie podría tener las etiquetas: 'chocolate', 'nuez', 'dulce'"
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
                            options={allTagOptions}
                            onChange={this.handleTagChange}
                            value={this.state.itemToEdit.tags.map(x => ({value: x, label: x}))}
                            isSearchable={true}
                            isMulti={true}
                        />
                        <div style={{...blockStyle, height: '65%', marginTop: '40px'}}>
                            <div style={{...scrollStyle, overflowY: 'scroll', display: itemTagsHtml.length > 0 ? '' : 'flex' }}>
                                {
                                    itemTagsHtml.length > 0 ?
                                    itemTagsHtml
                                    :
                                    <p style={{...CssProperties.MediumHeadetTextStyle, color: ColorHex.TextBody}}>No Tiene Etiquetas</p>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const initialItemToEditState = {
    name: '',
    code: '',
    description: '',
    tags: [],
    price: '',
    imageBase64: ''
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

export default InventoryEditItemScreen;