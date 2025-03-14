import React, { Component } from 'react';
import { PopupStyle } from '../Popups/PopupManager';
import { Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';
import Modal from 'react-modal';
import { Color, ColorHex } from '../Colors';
import axios from 'axios';
import HttpRequest from '../HttpRequest';

class InventoryEditItemModal extends Component {
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
                
                const response = await HttpRequest.post(`/inventory/addItems`, [newItem]);
            } else {
                const response = await HttpRequest.put(`/inventory/updateItem`, itemToEdit);
            }
            this.props.updateProductsCallback(itemToEdit)
            return null
          } catch (error) {
            console.log("ERROR", error)
            this.props.showPopup(new Error("Ya existe un item con este nombre!"));
          }
    }

    handleStringChange = (e) => {
        const { name, value } = e.target;

        if(name == "newTagInput") {
            this.setState({
                newTagInput: e.target.value
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
        const {isOpen, itemToEdit, closeCallback, allTags, isCreateItem} = this.props

        const editItemModal =             
        <Modal
            isOpen={isOpen}
            onRequestClose={closeCallback}
            contentLabel="Example Modal"
            style={PopupStyle.Big}
        >
            <div className={`card bordered ${Color.Background}`}>
                <a className={`right waves-effect waves-light btn ${Color.Second}`} onClick={closeCallback}>
                    <i className="material-icons">close</i>
                </a>
                <div className="card-content">
                    <span className="card-title">{isCreateItem ? `Crear Item` : `Editar ${itemToEdit?.name}`}</span>
                    <div className="row">
                        <div className="col s8">
                            <span>{`Nombre:`}</span>
                            <input style={{display: 'block' }} name="name" value={this.state.itemToEdit?.name} onChange={this.handleStringChange}/>
                            <span>{`Descripción:`}</span>
                            <input style={{display: 'block' }} name="description" value={this.state.itemToEdit?.description} onChange={this.handleStringChange}/>
                            <span>{`Precio:`}</span>
                            <input style={{display: 'block' }} type='number' name="price" value={this.state.itemToEdit?.price} onChange={this.handleStringChange}/>
                            <span>{`Imagen URL:`}</span>
                            <input style={{display: 'block' }} name="imageLink" value={this.state.itemToEdit?.imageLink} onChange={this.handleStringChange}/>
                            <span>{`Etiquetas:`}</span>
                            <FormControl style={{ width: '100%' }}>
                                <Select
                                    labelId="tags-label"
                                    multiple
                                    value={allTags?.filter(tag => this.state?.itemToEdit?.tags?.includes(tag))}
                                    onChange={this.handleTagChange}
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                    {allTags.map((tag) => (
                                        <MenuItem 
                                            key={tag} 
                                            value={tag} 
                                            style={{ 
                                                fontWeight: this.state?.itemToEdit?.tags?.includes(tag) ? 'bold' : 'normal', 
                                                color: this.state?.itemToEdit?.tags?.includes(tag) ? 'blue' : 'black',
                                                backgroundColor: this.state?.itemToEdit?.tags?.includes(tag) ? ColorHex.Third : 'white'
                                            }}
                                        >
                                            {tag}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <span>{`Nueva etiqueta:`}</span>
                            <div className="row">
                                <div className="col s8">
                                    <input
                                        style={{display: 'block' }}
                                        type="text"
                                        placeholder="Nueva etiqueta"
                                        name='newTagInput'
                                        value={this.state.newTagInput}
                                        onChange={this.handleStringChange}
                                    />
                                </div>
                                <div className="col s4">
                                    <button className={`right waves-effect waves-light btn ${Color.Button_1}`} onClick={this.handleAddNewTag}>Agregar etiqueta nueva</button>
                                </div>
                            </div>
                            {
                    this.props.itemToEdit != this.state.itemToEdit ?
                    <a className={`waves-effect waves-light btn ${Color.First}`} onClick={this.handleSave}  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="material-icons">save</i>
                        Guardar
                    </a>
                    :
                    <div></div>
                }
                        </div>                 
                        <div className="col s4">
                            <img style={{ display: 'block', maxWidth: '100%', height: '400px' }}  src={this.state.itemToEdit?.imageLink} alt="Example Image"/>                     
                        </div>
                    </div>
                </div>
            </div>
        </Modal>

        return (editItemModal)
    }
}

export default InventoryEditItemModal;