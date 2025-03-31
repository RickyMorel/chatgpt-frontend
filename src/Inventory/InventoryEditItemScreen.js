import { faRectangleXmark, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { Component } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import { storage } from '../firebaseConfig';
import CustomButton from '../Searchbar/CustomButton';
import CustomFileInput from '../Searchbar/CustomFileInput';
import CustomInput from '../Searchbar/CustomInput';
import CustomSelect from '../Searchbar/CustomSelect';
import RemovableItem from '../Searchbar/RemovableItem';
import HttpRequest from '../HttpRequest';

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
                imageLink: ''
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

    uploadImageToFirebase = async (imageUri) => {
        const response = await fetch(imageUri);
        let blob = await response.blob();

        const storageRef = ref(storage, `chabot-product-images/${this.state.itemToEdit.name}.jpg`);

        try {
            const snapshot = await uploadBytes(storageRef, blob)
    
            const downloadURL = await getDownloadURL(snapshot.ref);

            blob = null;
    
            return downloadURL;
        } catch(err) {
            console.log("error", err)
        }
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

    handleImageChange = (selectedImage) => {
        this.setState({ selectedImage: selectedImage});
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
                    const imageLink = await this.uploadImageToFirebase(this.state.selectedImage)
                    newItem.imageLink = imageLink
                }

                let missingFields = []
                if(!newItem.name || newItem.name.length < 1) { missingFields.push("name");}
                if(!newItem.imageLink || newItem.imageLink.length < 1) { missingFields.push("imageLink");}
                if(!newItem.description || newItem.description.length < 1) { missingFields.push("description");}
                if(!newItem.price || newItem.price.length < 1) { missingFields.push("price");}
                // if(!newItem.tags || newItem.tags.length < 1) { missingFields.push("tags");}

                this.setState({
                    fieldsWithErrors: missingFields
                })

                if(missingFields.length > 0) {return;}
                
                const response = await HttpRequest.post(`/inventory/addItems`, [newItem]);
            } else {
                if(this.state.selectedImage) {
                    const imageLink = await this.uploadImageToFirebase(this.state.selectedImage)
                    itemToEdit.imageLink = imageLink
                }
                const response = await HttpRequest.put(`/inventory/updateItem`, itemToEdit);
            }
            this.props.history.goBack()
          } catch (error) {
            console.log("ERROR", error)
            this.props.showPopup(new Error("Ya existe un item con este nombre!"));
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

    formInput = (title, placeholder, dataName, dataType = 'text') => (
        <>
            <p style={headersStyle}>{title}</p>
            <CustomInput
                width='800px'
                height='75px'
                placeHolderText={placeholder}
                dataType={dataType}
                onChange={(value) => this.handleStringChange(dataName, value)}
                value={this.state.itemToEdit[dataName]}
                hasError={this.state.fieldsWithErrors.includes(dataName)}
            />
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
                            else if(x == 'imageLink') {return "*Falta imagen.\n"} 
                            else if(x == 'tags') {return "*Falta etiquetas.\n"} 
                            else if(x == 'price') {return "*Falta precio.\n"} 
                        })
                    }
                </p>
                <div className="row">
                    <div className="col-6">
                        {this.formInput("Nombre del item *", "Ingresar nombre de item......", "name")}
                        {this.formInput("Descripcion del item *", "Ingresar descripcion de item......", "description")}
                        {this.formInput("Precio del item *", "Ingresar precio de item......", "price", "number")}
                        <p style={{...headersStyle, marginBottom: '-25px'}}>Imagen *</p>
                        <CustomFileInput imageURL={this.state?.itemToEdit?.imageLink} onChange={this.handleImageChange}/>
                        {/* {this.formInput("URL De Imagen *", "Ingresar URL del imagen......", "imageLink")} */}
                        {/* <div style={{...blockStyle, height: '305px'}}>
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
                        </div> */}
                    </div>
                    <div className="col-6">
                        <p style={headersStyle}>Agregar Nuevas Etiquetas</p>
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
    imageLink: ''
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