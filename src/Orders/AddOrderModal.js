import axios from 'axios';
import { es } from 'date-fns/locale';
import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Modal from 'react-modal';
import Select from 'react-select';
import { Color, ColorHex } from '../Colors';
import { PopupStyle } from '../Popups/PopupManager';
import CssProperties from '../CssProperties';
import CustomSelect from '../Searchbar/CustomSelect';
import CustomDatePicker from '../Searchbar/CustomDatePicker';

class AddOrderModal extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            clientNumber: "",
            pointsUsed: 0,
            movil: "",
            items: [],
            deliveryDate: new Date()
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
            const orderDto = {
                clientNumber: this.state.clientNumber,
                movil: this.state.movil,
                items: this.state.items,
                pointsUsed: this.state.pointsUsed,
                deliveryDate: this.state.deliveryDate
            }
            
            if(!orderDto.clientNumber || orderDto.clientNumber.length < 12) { this.props.showPopup(new Error("No se cargo un cliente!")); return;}
            if(!orderDto.movil || orderDto.movil.length < 1) { this.props.showPopup(new Error("No se cargo un movil!")); return;}
            if(!orderDto.items || orderDto.items.length < 1) { this.props.showPopup(new Error("No se cargo productos!")); return;}
            if(!orderDto.deliveryDate || orderDto.deliveryDate.length < 1) { this.props.showPopup(new Error("No se cargo una fecha de entrega!")); return;}

            const response = await axios.post(`${process.env.REACT_APP_HOST_URL}/order/createOrderFromInterface`, orderDto);
            let orderResponse = {...response.data}
            delete orderResponse._id
            delete orderResponse.chat
            delete orderResponse.clientStats
            delete orderResponse.editedOrder
            delete orderResponse.__v
            this.props.addNewOrderCallback(orderResponse)
          } catch (error) {
            this.props.showPopup(error);
          }
    }

    handleClientChange = (value) => {
        this.setState({
            clientNumber: value.value
        })
    }

    handlePointsChange = (value) => {
        this.setState({
            pointsUsed: value
        })
    }

    handleEditDate = (date) => {
        this.setState({
          deliveryDate: date
        })
      }

    handleMovilChange = (value) => {
        this.setState({
            movil: value.value
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
                {
                    this.state.items.length > 0 ? 
                    <a className={`right waves-effect waves-light btn ${Color.Fifth}`} onClick={this.handleSave}>
                        <i className="material-icons">save</i>
                    </a>
                    :
                    <div></div>
                }
                <div className="card-content">
                    <span className="card-title">{`Nuevo Pedido`}</span>
                    <div className="row">
                        <div className="col s12">
                            <span>{`Cliente:`}</span>
                            <Select
                                options={clientNumbersSelect}
                                onChange={this.handleClientChange}
                                value={clientNumbersSelect?.find(x => x.value == this?.state?.clientNumber)}
                                isSearchable={true}
                            />
                            <span>{`Movil:`}</span>
                            <Select
                                options={movilNames}
                                onChange={this.handleMovilChange}
                                value={movilNames?.find(x => x.value == this?.state?.movil)}
                                isSearchable={true}
                            />
                            <div class="input-field">
                                <input id="pointsUsed" name='pointsUsed' type="number" value={this.state.pointsUsed} class="validate" style={{display: 'block' }} onChange={(e) => this.handlePointsChange(e.target.value)}/>
                                <label for="first_name" className='active'>Puntos usados</label>
                            </div> 
                            <div class="input-field">
                                <label htmlFor="datepicker" className='active'>Fecha de Entrega</label>
                                <DatePicker
                                    id="datepicker"
                                    dateFormat="dd/MM/yy"
                                    selected={this.state.deliveryDate}
                                    onChange={(date) => this.handleEditDate(date)}
                                    locale={es}
                                />                                           
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
                        </div>
                    </div>
                </div>
            </div>
        </Modal>

        const headersStyle = {
            ...CssProperties.MediumHeadetTextStyle,
            color: ColorHex.TextBody, 
            marginTop: '25px'
        }

        
        const addOrderModalNew =             
        <Modal
            isOpen={isOpen}
            onRequestClose={closeCallback}
            contentLabel="Example Modal"
            style={PopupStyle.Medium}
        >
           <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>Crear Pedido</p>
           <hr style={{marginTop: '-15px'}}/>
           <p style={headersStyle}>Numero de cliente</p>
           <CustomSelect
                placeHolderText={"Ingresar el número de cliente......"}
                options={clientNumbersSelect}
                onChange={this.handleClientChange}
                value={clientNumbersSelect?.find(x => x.value == this?.state?.clientNumber)}
                isSearchable={true}
            />
            <p style={headersStyle}>Movil</p>
           <CustomSelect placeHolderText={"Ingresar movil......"}
                options={movilNames}
                onChange={this.handleMovilChange}
                value={movilNames?.find(x => x.value == this?.state?.movil)}
                isSearchable={true}
            />
            <p style={headersStyle}>Fecha de Entrega</p>     
            <CustomDatePicker
                selected={this.state.deliveryDate}
                onChange={(date) => this.handleEditDate(date)}
            />    
        </Modal>


        return (addOrderModalNew)
    }
}

export default AddOrderModal;