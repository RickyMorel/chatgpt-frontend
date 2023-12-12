import React from 'react';

class ProductComponent extends React.Component {

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
    const { name, price, amount } = this.props;

    return (
      <div className="row list-item z-depth-2 border">
        <div className="col s7">
          <span className="client-name">{name}</span>
        </div>
        <div className="col s2">
          <span className="client-name">{amount}</span>
        </div>
        <div className="col s3">
        <span className="client-name">{this.formatPrice(price)}</span>
        </div>
      </div>
    );
  }
}

export default ProductComponent;