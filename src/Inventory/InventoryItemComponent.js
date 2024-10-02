import React from 'react';
import { Color, ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import CustomButton from '../Searchbar/CustomButton';
import Utils from '../Utils';
import { faMinus, faPenToSquare, faPlus, faTag } from '@fortawesome/free-solid-svg-icons';

class InventoryItemComponent extends React.Component {
    render() {
        const { item, isInDailyInventory, isPromoItem, handleClickCallback, handleSelectPromoItemCallback, handleEditItemCallback, reccomendations } = this.props;

        return (
        <div className="row" style={trStyle}>
            <div className={isInDailyInventory ? "col-5" : "col-6"}>
                <p style={{...CssProperties.BodyTextStyle, color: ColorHex.TextBody, textAlign: 'left', marginTop: '12px'}}>{Utils.getCutName(item.name)}</p>
            </div>
            <div className="col-2">
                <p style={{...CssProperties.BodyTextStyle, color: ColorHex.RedFabri, textAlign: 'center'}}>{item.imageLink == " " ? "Sin Imagen" : ""}</p>
            </div>
            <div className="col-2">
                <p style={{...CssProperties.BodyTextStyle, color: ColorHex.TextBody, textAlign: 'center', marginTop: '12px'}}>{Utils.formatPrice(item.price)}</p>
            </div>
            <div className="col-1">
                <CustomButton iconSize="25px" width='40px' height="40px" icon={faPenToSquare} link="createItem" linkData={item}/>
            </div> 
            {
                isInDailyInventory ? 
                <div className="col-1">
                    <CustomButton iconSize="25px" className="red" classStyle={isPromoItem == true ? `btnBlue-clicked` : 'btnBlue'} width='40px' height="40px" icon={faTag} onClickCallback={() => handleSelectPromoItemCallback(item, isPromoItem)}/>
                </div>
                :
                <></>
            }
            <div className="col-1">
                <CustomButton iconSize="25px" width='40px' classStyle={isInDailyInventory == true ? "btnRed" : "btnGreen"} height="40px" icon={isInDailyInventory == true ? faMinus : faPlus} onClickCallback={() => handleClickCallback(item, isInDailyInventory)}/>
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
    height: '55px',
    width: '100%',
    alignItems: 'center',
    marginBottom: '12px',
    display: 'flex',
    marginLeft: '5px',
  }

export default InventoryItemComponent;