import React from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min.js';

class OrderComponent extends React.Component {

  componentDidMount() {
    M.AutoInit(); 
  }

  componentDidUpdate(prevProps, prevState) {
    if(!prevState) {return}
    
    if (prevState.isEditingLocations !== this.state.isEditingLocations) {
      M.AutoInit(); 
    }
  }

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
    const { orderNumber ,name, phoneNumber, order } = this.props;

    const orderList = order?.map(x => (
      <li>
      <div className="row">
          <div className="col s6">
            <p>{x.name}</p>
          </div>
          <div className="col s6">
            <p>{x.amount}</p>
          </div>
      </div>
      </li>
    ));

    console.log("orderList", orderList)

    return (
        <div className="collection-item">
          <div class="collapsible-header">
            <span class="client-name">{orderNumber}</span>
            <span class="client-name">{name}</span>
            <span class="client-name">+{phoneNumber}</span>
            <span class="client-name">{orderNumber}</span>
            <a><i className='material-icons'>keyboard_arrow_downs</i></a>
          </div>
          <div class="collapsible-body">{orderList}</div>
          {/* <div class="collapsible-header">
            <div class="row">
              <div class="col s3">
                <span class="client-name">{orderNumber}</span>
              </div>
              <div class="col s3">
                <span class="client-name">{name}</span>
              </div>
              <div class="col s3">
                <span class="client-name">+{phoneNumber}</span>
              </div>
              <div class="col s3">
                  <a><i className='material-icons'>keyboard_arrow_downs</i></a>
              </div>
            </div>
          </div>
          <div class="collapsible-body">{orderList}</div> */}
        </div>
    );
  }
}

export default OrderComponent;