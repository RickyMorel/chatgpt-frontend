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
        const { item, isInDailyInventory, handleClickCallback } = this.props;

        return (
        <div className="row list-item z-depth-2 border">
            <div className="col s7">
                <span className="client-name">{item.name}</span>
            </div>
            <div className="col s3">
                <span className="client-name">{this.formatPrice(item.price)}</span>
            </div>
            <div className="col s2">
                <a className={`waves-effect waves-light btn btn-small right ${isInDailyInventory == true ? Color.Second : Color.Fifth}`} onClick={() => handleClickCallback(item, isInDailyInventory)}>
                <i className="material-icons">{isInDailyInventory == true ? "arrow_back" : "arrow_forward"}</i>
                </a>
            </div>
        </div>
        );
    }
}

export default InventoryItemComponent;