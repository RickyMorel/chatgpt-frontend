import React from 'react';
import { Color, ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import CustomButton from '../Searchbar/CustomButton';
import Utils from '../Utils';

class InventoryItemComponent extends React.Component {

    formatPrice = (numberString) => {
        const number = parseFloat(numberString);
      
        if (isNaN(number)) {
          return 'Invalid number';
        }
      
        const formattedNumber = new Intl.NumberFormat('es-PY', {
          style: 'currency',
          currency: 'PYG',
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        }).format(number);
      
        return `${formattedNumber}`;
    };

    render() {
        const { item, isInDailyInventory, isPromoItem, handleClickCallback, handleSelectPromoItemCallback, handleEditItemCallback, reccomendations } = this.props;

        return (
        <div className="row" style={trStyle}>
            <div className={isInDailyInventory ? "col-5" : "col-6"}>
                <p style={{...CssProperties.BodyTextStyle, color: ColorHex.TextBody, textAlign: 'left', marginTop: '12px'}}>{Utils.getCutName(item.name)}</p>
            </div>
            {/* <div className={isInDailyInventory ? "col-1" : "col-2"}>
                {
                    reccomendations?.length > 0 ?
                    <div></div>
                    // <span className="client-name orange-text">{`Rec: ${reccomendations.join(", ")}`}</span>
                    :
                    <div></div>
                }
            </div> */}
            <div className="col-2">
                <p style={{...CssProperties.BodyTextStyle, color: ColorHex.RedFabri, textAlign: 'center'}}>{item.imageLink == " " ? "Sin Imagen" : ""}</p>
            </div>
            <div className="col-2">
                <p style={{...CssProperties.BodyTextStyle, color: ColorHex.TextBody, textAlign: 'center', marginTop: '12px'}}>{this.formatPrice(item.price)}</p>
            </div>
            <div className="col-1">
                <CustomButton iconSize="25px" width='40px' height="40px" icon="edit" onClickCallback={() => handleEditItemCallback(item)}/>
            </div> 
            {
                isInDailyInventory ? 
                <div className="col-1">
                    <CustomButton iconSize="25px" className="red" classStyle={isPromoItem == true ? `btnBlue-clicked` : 'btnBlue'} width='40px' height="40px" icon="loyalty" onClickCallback={() => handleSelectPromoItemCallback(item, isPromoItem)}/>
                </div>
                :
                <></>
            }
            <div className="col-1">
                <CustomButton iconSize="25px" width='40px' classStyle={isInDailyInventory == true ? "btnRed" : "btnGreen"} height="40px" icon={isInDailyInventory == true ? "remove" : "add"} onClickCallback={() => handleClickCallback(item, isInDailyInventory)}/>
            </div>
        </div>
        );
    }
}

const trStyle = {
    borderRadius: '10px',
    backgroundColor: ColorHex.White,
    boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
    border: `1px solid ${ColorHex.BorderColor}`,
    height: '50px',
    width: '100%',
    alignItems: 'center',
    marginBottom: '12px',
    display: 'flex',
    marginLeft: '5px',
  }

export default InventoryItemComponent;