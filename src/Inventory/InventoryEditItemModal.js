import React, { Component } from 'react';
import { PopupStyle } from '../Popups/PopupManager';
import { Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';
import Modal from 'react-modal';
import { Color } from '../Colors';

class InventoryEditItemModal extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            itemToEdit: {
                name: '',
                description: '',
                tags: [],
                price: '',
                imageLink: ''
            },
            newTagInput: ''
        };
    }

    componentDidMount = () => {
        this.setState({
            itemToEdit: this.props.itemToEdit
        })
    }

    handleTagChange = (e) => {
        console.log("e", e)
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        this.setState(prevState => ({
            itemToEdit: {
                ...prevState.itemToEdit,
                tags: selectedOptions
            }
        }));
    }

    handleAddNewTag = () => {
        const newTag = this.state.newTagInput.trim();
        if (newTag && !this.state.itemToEdit.tags.includes(newTag)) {
            this.setState(prevState => ({
                itemToEdit: {
                    ...prevState.itemToEdit,
                    tags: [...prevState.itemToEdit.tags, newTag]
                },
                newTagInput: ''
            }));
        }
    }

    render() {
        const {isOpen, itemToEdit, closeCallback} = this.props

        const editItemModal =             
        <Modal
            isOpen={isOpen}
            onRequestClose={closeCallback}
            contentLabel="Example Modal"
            style={PopupStyle.Big}
        >
            <div className={`card bordered ${Color.Background}`}>
                <div className="card-content">
                    <span className="card-title">{`Editar ${itemToEdit?.name}`}</span>
                    <div className="row">
                        <div className="col s8">
                            <span>{`Nombre:`}</span>
                            <input style={{display: 'block' }} value={itemToEdit?.name}/>
                            <span>{`Descripción:`}</span>
                            <input style={{display: 'block' }} value={itemToEdit?.description}/>
                            <span>{`Precio:`}</span>
                            <input style={{display: 'block' }} value={itemToEdit?.price}/>
                            <span>{`Imagen URL:`}</span>
                            <input style={{display: 'block' }} value={itemToEdit?.imageLink}/>
                            <span>{`Etiquetas:`}</span>
                            <FormControl style={{ width: '100%' }}>
                                <Select
                                    labelId="tags-label"
                                    multiple
                                    value={itemToEdit?.tags}
                                    onChange={this.handleTagChange}
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                    {itemToEdit?.tags.map((tag) => (
                                        <MenuItem key={tag} value={tag}>
                                            {tag}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <input
                                style={{display: 'block' }}
                                type="text"
                                placeholder="Nueva etiqueta"
                                value={this.state.newTagInput}
                                onChange={this.handleNewTagChange}
                            />
                            <Button variant="contained" onClick={this.handleAddNewTag}>Agregar etiqueta</Button>
                            <button className={`waves-effect waves-light btn ${Color.Button_1}`} onClick={() => this.handleEditItem(undefined)}>Guardar</button>
                            <button className={`waves-effect waves-light btn ${Color.Second}`} onClick={() => this.handleEditItem(undefined)}>Cerrar</button> 
                        </div>                 
                        <div className="col s4">
                            <img style={{ display: 'block', maxWidth: '100%', height: '400px' }}  src={itemToEdit?.imageLink} alt="Example Image"/>                     
                        </div>
                    </div>
                </div>
            </div>
        </Modal>

        return (editItemModal)
    }
}

export default InventoryEditItemModal;