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
import CustomButton from '../Searchbar/CustomButton';
import CustomInput from '../Searchbar/CustomInput';
import CustomScroll from '../Searchbar/CustomScroll';

class AddOrderScreen extends Component {
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
                    <CustomSelect
                        placeHolderText={"Ingresar nombre del item......"}
                        options={inventoryItemCodesSelect}
                        onChange={(value) => this.handleItemChange(x.code, value)}
                        value={inventoryItemCodesSelectValues.find(y => y.value == x.code)}
                        isSearchable={true}
                    />
                </div>       
                <div className='col s3'>
                    <CustomInput
                        placeHolderText="Ingresar cantidad......"
                        dataType="number"
                        onChange={(e) => this.handleItemChange(x.code, undefined, e.target.value)}
                    />
                </div>
                <div className="col s1">
                    <button className={`waves-light btn-small ${Color.Second}`} onClick={() => this.handleAddOrRemoveProduct(x.code)}><i className="material-icons">close</i></button>
                </div>
            </div>
        )})

        itemsHtml.push(<CustomButton width='100%' height="75px" icon="add" onClickCallback={() => this.handleAddOrRemoveProduct()}/>)

        const headersStyle = {
            ...CssProperties.MediumHeadetTextStyle,
            color: ColorHex.TextBody, 
            marginTop: '25px'
        }

        
        const addOrderModalNew =             
        <div>
           <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>Crear Pedido</p>
           <div style={{display: 'flex', width: '100%', paddingTop: '25px'}}>
                <div class="flex-grow-1" style={{paddingLeft: '25px'}}><CustomButton text="Agregar Pedido" icon="save" onClickCallback={this.handleSave}/></div>
                <div class="flex-grow-1"style={{paddingLeft: '25px'}}><CustomButton text="Cancelar Pedido" icon="cancel" link="orders"/></div>
                <div className="col-10"></div>
            </div>
            <div className="row">
                <div className="col-6">
                    <p style={headersStyle}>Numero de cliente *</p>
                    <CustomSelect
                        placeHolderText={"Ingresar el número de cliente......"}
                        options={clientNumbersSelect}
                        onChange={this.handleClientChange}
                        value={clientNumbersSelect?.find(x => x.value == this?.state?.clientNumber)}
                        isSearchable={true}
                    />
                </div>
                <div className="col-6">
                    <p style={headersStyle}>Movil</p>
                    <CustomSelect placeHolderText={"Ingresar movil......"}
                        options={movilNames}
                        onChange={this.handleMovilChange}
                        value={movilNames?.find(x => x.value == this?.state?.movil)}
                        isSearchable={true}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <p style={headersStyle}>Fecha de Entrega *</p>     
                    <CustomDatePicker
                        selected={this.state.deliveryDate}
                        onChange={(date) => this.handleEditDate(date)}
                    />    
                </div>
                <div className="col-6">
                    <p style={headersStyle}>Puntos</p>
                    <CustomInput
                        placeHolderText="Ingresar puntos de descuento usados......"
                        dataType="number"
                        onChange={this.handlePointsChange}
                    />
                </div>
            </div>

            <p style={headersStyle}>Pedido del Cliente *</p>
            <CustomScroll panelIncluded={true} blocks={itemsHtml}/>
        </div>


        return (addOrderModalNew)
    }
}

export default AddOrderScreen;