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
import { faFloppyDisk, faRectangleXmark } from '@fortawesome/free-regular-svg-icons';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

class AddOrderScreen extends Component {
    constructor(props) {
        super(props);

        const orderData = this.props.location && this.props.location.state ? this.props.location.state.linkData : undefined;

        console.log("orderData", orderData)
    
        this.state = {
            clientNumbers: [],
            inventoryItemCodes: [],
            movilObjs: null,
            clientNumber: orderData?.clientNumber ?? "",
            pointsUsed: orderData?.pointsUsed ?? 0,
            movil: orderData?.movil ?? "",
            items: orderData?.items?.map(x => ({code: x.code, amount: x.amount})) ?? [],
            deliveryDate: orderData?.deliveryDate ?? new Date(),
            isCreateOrder: orderData == undefined,
            orderState: orderData?.orderState ?? "CONFIRMED",
            fieldsWithErrors: []
        };
    }

    componentDidMount = () => {
        this.fetchInventoryItemNames();
        this.fetchClientData();
        this.fetchMovilData();
    }

    componentDidUpdate = (prevProps) => {
        //Don't update if user didnt swap items
        if(this.props?.itemToEdit?.name == prevProps?.itemToEdit?.name) {return;}

        this.setState({
            itemToEdit: this.props.itemToEdit
        })
    }
    
    fetchInventoryItemNames = async () => {
        try {
        const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/inventory/getAllNamesWithCodes`);
        this.setState({
            inventoryItemCodes: response.data,
        });
        } catch{}
    };

    fetchClientData = async () => {
        this.props.setIsLoading(true)
    
        try {
          const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/client-crud/phoneNumbers`);
          this.setState({
            clientNumbers: response.data,
          })
        } catch (error) {
    
        }
    
        this.props.setIsLoading(false)
    };

    fetchMovilData = async () => {
    this.props.setIsLoading(true)

    try {
        const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/extentions/getEmporioMoviles`);
        this.setState({
        movilObjs: response.data,
        });
    } catch (error) {}

    this.props.setIsLoading(false)
    };

    resetScreen = () => {
        this.setState({
            clientNumber: "",
            pointsUsed: 0,
            movil: "",
            items: [],
            deliveryDate: new Date()
        })
    }

    handleSave = async () => {
        if(this.hasSaveErrors()) {return;}

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

            this.resetScreen()

            this.props.showPopup();
          } catch (error) {
            this.props.showPopup(error);
          }
    }

    handleSaveEdit = async () => {
        const {clientNumber, pointsUsed, movil, items, deliveryDate} = this.state

        if(this.hasSaveErrors()) {return;}

        try {
            const dto = { 
                phoneNumber: clientNumber,
                order: items, 
                movil: movil, 
                pointsUsed: pointsUsed,
                deliveryDate: deliveryDate
            }
    
            const response = await axios.put(`${process.env.REACT_APP_HOST_URL}/order/editOrder`, dto);
            this.props.history.goBack()         
          } catch (error) {
            this.props.showPopup(error);
          }
    }

    hasSaveErrors = () => {
        const {clientNumber, pointsUsed, movil, items, deliveryDate, isCreateOrder} = this.state

        let missingFields = []
        if(!deliveryDate) { missingFields.push("deliveryDate");}
        if(!movil || movil.length < 1) { missingFields.push("movil");}
        if(isCreateOrder && items.length < 1) { missingFields.push("no items");}
        if(isCreateOrder && (!clientNumber || clientNumber.length < 1)) { missingFields.push("clientNumber");}

        this.setState({
            fieldsWithErrors: missingFields
        })

        return missingFields.length > 0
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

    handleOrderStateChange = (value) => {
        this.setState({
            orderState: value.value
        })
    }

    handleItemChange = (itemCode, newCode = undefined, newAmount = undefined) => {
        let allItems = [...this.state.items]

        let itemToRemove = allItems.find(x => x.code == itemCode)

        if(newCode) {
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
            while(allItems.find(x => x.code == this.state.inventoryItemCodes[i].code)) { i++}

            const wantedItem = this.state.inventoryItemCodes[i]

            allItems.push({code: wantedItem.code, amount: 1})
        }

        this.setState({
            items: allItems
        })
    }

    render() {
        const { inventoryItemCodes, clientNumbers, movilObjs, isCreateOrder, clientNumber } = this.state

        const confirmedState = "CONFIRMED"
        const canceldState = "CANCELED"
        const SURE = "SURE"

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
            <div style={{display: 'flex', paddingBottom: '25px'}}>
                <div className="flex-grow-1">
                    <CustomSelect
                        width='1237px'
                        placeHolderText={"Ingresar nombre del item......"}
                        options={inventoryItemCodesSelect}
                        onChange={(value) => this.handleItemChange(x.code, value)}
                        value={inventoryItemCodesSelectValues.find(y => y.value == x.code)}
                        isSearchable={true}
                    />
                </div>       
                <div className="flex-grow-1">
                    <CustomInput
                        width='228px'
                        placeHolderText="Ingresar cantidad......"
                        dataType="number"
                        onChange={(value) => this.handleItemChange(x.code, undefined, value)}
                        value={x.amount}
                    />
                </div>
                <div className="col s1">
                    <CustomButton width='100%' height="75px" icon={faTrash} onClickCallback={() => this.handleAddOrRemoveProduct(x.code)}/>
                </div>
            </div>
        )})

        itemsHtml.push(<CustomButton width='100%' height="75px" icon={faPlus} onClickCallback={() => this.handleAddOrRemoveProduct()}/>)

        const headersStyle = {
            ...CssProperties.MediumHeadetTextStyle,
            color: ColorHex.TextBody, 
            marginTop: '25px'
        }

        const botStateOptions = [
            {value: SURE, label: 'FALTA CONFIRMAR'},
            {value: confirmedState, label: 'Confirmado'},
            {value: canceldState, label: 'Cancelado'}
        ]
        
        const addOrderModalNew =             
        <div>
           <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>{isCreateOrder ? 'Crear Pedido' : 'Editar Pedido'}</p>
           <div style={{display: 'flex', width: '100%', paddingTop: '25px', marginTop: '-25px'}}>
                <div class="flex-grow-1" style={{paddingRight: '25px'}}>
                    {
                        isCreateOrder ?
                        <CustomButton text="Agregar Pedido" classStyle="btnGreen" width="182px" height="45px" icon={faFloppyDisk} onClickCallback={this.handleSave}/>
                        :
                        <CustomButton text="Guardar" classStyle="btnGreen" width="182px" height="45px" icon={faFloppyDisk} onClickCallback={this.handleSaveEdit}/>
                    }
                </div>
                <div class="flex-grow-1"style={{paddingRight: '25px'}}><CustomButton text="Cancelar Pedido" classStyle="btnRed" icon={faRectangleXmark} link="orders"/></div>
                <div className="col-10"></div>
            </div>
            <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.RedFabri, marginTop: '20px', marginBottom: '-25px'}}>
                {
                    this.state.fieldsWithErrors.map(x => {
                        if(x == 'deliveryDate') {return "*Falta fecha.\n"} 
                        else if(x == 'movil') {return "*Falta movil.\n"} 
                        else if(x == 'no items') {return "*Falta agregar items.\n"} 
                        else if(x == 'clientNumber') {return "*Falta numero de cliente.\n"} 
                    })
                }
            </p>
            <div className="row">
                <div className="col-6">
                    <p style={headersStyle}>Numero de cliente *</p>
                    {
                        isCreateOrder ?
                        <CustomSelect
                            placeHolderText={"Ingresar el número de cliente......"}
                            options={clientNumbersSelect}
                            onChange={this.handleClientChange}
                            value={this?.state?.clientNumber ? clientNumbersSelect?.find(x => x.value == this?.state?.clientNumber) : ""}
                            isSearchable={true}
                            hasError={this.state.fieldsWithErrors.includes("clientNumber")}
                        />
                        :
                        <CustomInput
                            width='800px'
                            height='75px'
                            value={clientNumber}
                            canEdit={false}
                        />
                    }
                </div>
                <div className="col-6">
                    <p style={headersStyle}>Movil *</p>
                    <CustomSelect placeHolderText={"Ingresar movil......"}
                        options={movilNames}
                        onChange={this.handleMovilChange}
                        value={movilNames?.find(x => x.value == this?.state?.movil)}
                        isSearchable={true}
                        hasError={this.state.fieldsWithErrors.includes("movil")}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <p style={headersStyle}>Fecha de Entrega *</p>     
                    <CustomDatePicker
                        selected={this.state.deliveryDate}
                        onChange={(date) => this.handleEditDate(date)}
                        hasError={this.state.fieldsWithErrors.includes("deliveryDate")}
                    />    
                </div>
                <div className="col-6">
                    {
                        !this.state.isCreateOrder ?
                        <div className='row'>
                            <div className="col-9">
                                <p style={headersStyle}>Estado Del Pedido *</p>
                                <CustomSelect
                                    width='600px'
                                    options={botStateOptions}
                                    onChange={this.handleOrderStateChange}
                                    value={botStateOptions.find(x => x.value == this.state.orderState) ?? botStateOptions[0]}
                                    isSearchable={false}
                                />
                            </div>
                            <div className="col-3">
                                <p style={headersStyle}>Puntos</p>
                                <CustomInput
                                    placeHolderText="Ingresar puntos de descuento usados......"
                                    dataType="number"
                                    onChange={this.handlePointsChange}
                                    width='150px'
                                />
                            </div>
                        </div>
                        :
                        <>
                            <p style={headersStyle}>Puntos</p>
                            <CustomInput
                                placeHolderText="Ingresar puntos de descuento usados......"
                                dataType="number"
                                onChange={this.handlePointsChange}
                            />
                        </>
                    }
                </div>
            </div>

            <p style={headersStyle}>Pedido del Cliente *</p>
            <CustomScroll panelIncluded={true} blocks={itemsHtml}/>
        </div>


        return (addOrderModalNew)
    }
}

export default AddOrderScreen;