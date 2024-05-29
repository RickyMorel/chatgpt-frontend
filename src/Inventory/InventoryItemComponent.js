import React from 'react';
import { Color } from '../Colors';

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
        const { item, isInDailyInventory, isPromoItem, handleClickCallback, handleSelectPromoItemCallback, handleEditItemCallback } = this.props;

        return (
        <div className="row list-item z-depth-2 border">
            <div className="col s5">
                <span className="client-name">{item.name}</span>
            </div>
            <div className="col s2">
                <span className="client-name red-text">{item.imageLink == " " ? "Sin imagen" : ""}</span>
            </div>
            <div className="col s3">
                <span className="client-name">{this.formatPrice(item.price)}</span>
            </div>
            {
                isInDailyInventory == false ? 
                <div className="col s1">
                    <a className={`waves-effect waves-light btn btn-small right ${Color.Second}`} onClick={() => handleEditItemCallback(item)}>
                    <i className="material-icons">edit</i>
                    </a>
                </div> 
                :
                <div className="col s1">
                    <a className={`btn btn-small right ${isPromoItem == true ? Color.First : Color.Third}`} onClick={() => handleSelectPromoItemCallback(item, isPromoItem)}>
                        <i className="material-icons">star_border</i>
                    </a>
                </div>
            }
            <div className="col s1">
                <a className={`waves-effect waves-light btn btn-small right ${isInDailyInventory == true ? Color.Second : Color.Fifth}`} onClick={() => handleClickCallback(item, isInDailyInventory)}>
                <i className="material-icons">{isInDailyInventory == true ? "arrow_back" : "arrow_forward"}</i>
                </a>
            </div>
        </div>
        );
    }
}

export default InventoryItemComponent;