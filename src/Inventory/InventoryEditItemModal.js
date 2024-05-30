import React, { Component } from 'react';
import { PopupStyle } from '../Popups/PopupManager';
import { Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';
import Modal from 'react-modal';
import { Color, ColorHex } from '../Colors';

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

    componentDidUpdate = (prevProps) => {
        if(this.props == prevProps) {return;}

        this.setState({
            itemToEdit: this.props.itemToEdit
        })
    }

    handleAddNewTag = () => {
        this.props.addNewTagCallback(this.state.newTagInput)

        this.setState({
            newTagInput: ""
        })
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
        console.log("selectedOptions", selectedOptions, "e.target.value", e.target.value)
        this.setState(prevState => ({
            itemToEdit: {
                ...prevState.itemToEdit,
                tags: selectedOptions
            }
        }));
    }

    render() {
        const {isOpen, itemToEdit, closeCallback, allTags} = this.props

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
                <a className={`right waves-effect waves-light btn ${Color.Button_1}`} onClick={closeCallback}>
                    <i className="material-icons">save</i>
                </a>
                <div className="card-content">
                    <span className="card-title">{`Editar ${itemToEdit?.name}`}</span>
                    <div className="row">
                        <div className="col s8">
                            <span>{`Nombre:`}</span>
                            <input style={{display: 'block' }} name="name" value={this.state.itemToEdit?.name} onChange={this.handleStringChange}/>
                            <span>{`Descripción:`}</span>
                            <input style={{display: 'block' }} name="description" value={this.state.itemToEdit?.description} onChange={this.handleStringChange}/>
                            <span>{`Precio:`}</span>
                            <input style={{display: 'block' }} name="price" value={this.state.itemToEdit?.price} onChange={this.handleStringChange}/>
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
                            <input
                                style={{display: 'block' }}
                                type="text"
                                placeholder="Nueva etiqueta"
                                name='newTagInput'
                                value={this.state.newTagInput}
                                onChange={this.handleStringChange}
                            />
                            <Button variant="contained" onClick={this.handleAddNewTag}>Agregar etiqueta</Button>
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