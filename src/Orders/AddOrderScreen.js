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

class AddOrderScreen extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            clientNumbers: [],
            inventoryItemCodes: [],
            movilObjs: null,
            clientNumber: "",
            pointsUsed: 0,
            movil: "",
            items: [],
            deliveryDate: new Date()
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
        const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/inventory/getTommorowsInventoryNamesWithCodes`);
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
        console.log("handleItemChange", itemCode, newCode, newAmount)
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

            allItems.push({code: this.state.inventoryItemCodes[i].code, amount: 1})
        }

        this.setState({
            items: allItems
        })
    }

    render() {
        const { inventoryItemCodes, clientNumbers, movilObjs } = this.state

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
                    />
                </div>
                <div className="col s1">
                    <CustomButton width='100%' height="75px" icon="close" onClickCallback={() => this.handleAddOrRemoveProduct(x.code)}/>
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
           <div style={{display: 'flex', width: '100%', paddingTop: '25px', marginTop: '-25px'}}>
                <div class="flex-grow-1" style={{paddingRight: '25px'}}><CustomButton text="Agregar Pedido" classStyle="btnGreen" width="182px" height="45px" icon="save" onClickCallback={this.handleSave}/></div>
                <div class="flex-grow-1"style={{paddingRight: '25px'}}><CustomButton text="Cancelar Pedido" classStyle="btnRed" icon="cancel" link="orders"/></div>
                <div className="col-10"></div>
            </div>
            <div className="row">
                <div className="col-6">
                    <p style={headersStyle}>Numero de cliente *</p>
                    <CustomSelect
                        placeHolderText={"Ingresar el número de cliente......"}
                        options={clientNumbersSelect}
                        onChange={this.handleClientChange}
                        value={this?.state?.clientNumber ? clientNumbersSelect?.find(x => x.value == this?.state?.clientNumber) : ""}
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