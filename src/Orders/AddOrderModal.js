import React, { Component } from 'react';
import Select from 'react-select';
import { PopupStyle } from '../Popups/PopupManager';
import { MenuItem, InputLabel, FormControl, Button } from '@mui/material';
import Modal from 'react-modal';
import { Color, ColorHex } from '../Colors';
import axios from 'axios';

class AddOrderModal extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            clientNumber: "",
            pointsUsed: 0,
            movil: "",
            items: []
        };
    }

    componentDidUpdate = (prevProps) => {
        //Don't update if user didnt swap items
        if(this.props?.itemToEdit?.name == prevProps?.itemToEdit?.name) {return;}

        this.setState({
            itemToEdit: this.props.itemToEdit
        })
    }

     handleSave = async () => {
        const itemToEdit = this.state.itemToEdit
        this.props.closeCallback()

        try {
            const response = await axios.put(`${process.env.REACT_APP_HOST_URL}/inventory/updateItem`, itemToEdit);
            this.props.updateProductsCallback(itemToEdit)
            return null
          } catch (error) {
            this.props.showPopup(error);
          }
    }

    handleClientChange = (value) => {
        this.setState({
            clientNumber: value
        })
    }

    handlePointsChange = (value) => {
        this.setState({
            pointsUsed: value
        })
    }

    handleMovilChange = (value) => {
        this.setState({
            movil: value
        })
    }

    handleItemChange = (itemCode, newCode = undefined, newAmount = undefined) => {
        let allItems = [...this.state.items]

        let itemToRemove = allItems.find(x => x.code == itemCode)

        if(newCode) {
            console.log("newCode", newCode)
            itemToRemove.code = newCode.value
        }
        else if(newAmount) {
            itemToRemove.amount = newAmount
        }

        this.setState({
            items: allItems
        })
    }

    handleAddOrRemoveProduct = (itemToRemoveCode = undefined) => {
        let allItems = [...this.state.items]

        if(itemToRemoveCode) {
            allItems = allItems.filter(x => x.code != itemToRemoveCode)
        } else {
            let i = 0
            while(allItems.find(x => x.code == this.props.inventoryItemCodes[i].code)) { i++}

            allItems.push({code: this.props.inventoryItemCodes[i].code, amount: 1})
        }

        console.log("allItems", allItems)

        this.setState({
            items: allItems
        })
    }

    render() {
        const {isOpen, itemToEdit, closeCallback, movilObjs, inventoryItemCodes, clientNumbers} = this.props

        const movilNames = movilObjs?.map(x => ({value: x.van, label: x.van}))
        
        const filteredInventoryItemCodes = this?.state?.items?.length > 0 ? 
        inventoryItemCodes.filter(x => this.state.items.find(y => y.code == x.code) == undefined)
        :
        inventoryItemCodes

        const inventoryItemCodesSelect = filteredInventoryItemCodes?.map(x => ({value: x.code, label: x.name}))
        const inventoryItemCodesSelectValues = inventoryItemCodes?.map(x => ({value: x.code, label: x.name}))
        const clientNumbersSelect = clientNumbers?.map(x => ({value: x, label: x}))

        const itemsHtml = this?.state?.items?.map(x => {
            return (
            <div>
                <div className='col s8'>
                    <Select
                        options={inventoryItemCodesSelect}
                        onChange={(value) => this.handleItemChange(x.code, value)}
                        value={inventoryItemCodesSelectValues.find(y => y.value == x.code)}
                        isSearchable={true}
                    />
                </div>       
                <div className='col s3'>
                    <input style={{display: 'block' }} name='amount' value={x.amount} type='number' onChange={(e) => this.handleItemChange(x.code, undefined, e.target.value)}/>
                </div>
                <div className="col s1">
                    <button className={`waves-light btn-small ${Color.Second}`} onClick={() => this.handleAddOrRemoveProduct(x.code)}><i className="material-icons">close</i></button>
                </div>
            </div>
        )})

        const addOrderModal =             
        <Modal
            isOpen={isOpen}
            onRequestClose={closeCallback}
            contentLabel="Example Modal"
            style={PopupStyle.Medium}
        >
            <div className={`card bordered ${Color.Background}`}>
                <a className={`right waves-effect waves-light btn ${Color.Second}`} onClick={closeCallback}>
                    <i className="material-icons">close</i>
                </a>
                <div className="card-content">
                    <span className="card-title">{`Nuevo Pedido`}</span>
                    <div className="row">
                        <div className="col s12">
                            <span>{`Cliente:`}</span>
                            <Select
                                options={clientNumbersSelect}
                                onChange={this.handleClientChange}
                                value={this?.state?.clientNumber}
                                isSearchable={true}
                            />
                            <span>{`Movil:`}</span>
                            <Select
                                options={movilNames}
                                onChange={this.handleMovilChange}
                                value={this?.state?.movil}
                                isSearchable={true}
                            />
                            <div class="input-field">
                                <input id="pointsUsed" name='pointsUsed' type="number" value={this.state.pointsUsed} class="validate" style={{display: 'block' }} onChange={(e) => this.handlePointsChange(e.target.value)}/>
                                <label for="first_name" className='active'>Puntos usados</label>
                            </div> 
                            <div className="row">
                                <div className="col s11">
                                    <span>{`Pedido:`}</span>
                                </div>
                                <div className="col s1">
                                    <button onClick={() => this.handleAddOrRemoveProduct()} className={`waves-effect waves-light btn ${Color.Fifth}`}>
                                        <i className={`material-icons`}>add_circle_outline</i>
                                    </button>
                                </div>
                            </div>
                            <div className="row">
                                {itemsHtml}
                            </div>
                            {/* <a className={`waves-effect waves-light btn ${Color.First}`} onClick={this.handleSave} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="material-icons">save</i>
                                Guardar
                            </a> */}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>

        return (addOrderModal)
    }
}

export default AddOrderModal;