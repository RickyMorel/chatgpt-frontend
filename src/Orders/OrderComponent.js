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
      // <ul class="collapsible">
        <li>
          <div class="collapsible-header">
            <div class="row">
              <div class="col s12">
                <span class="client-name">{orderNumber}</span>
              </div>
            </div>
            <div class="row">
              <div class="col s12">
                <span class="client-name">{name}</span>
              </div>
            </div>
            <div class="row">
              <div class="col s12">
                <span class="client-name">+{phoneNumber}</span>
              </div>
            </div>
            <div class="row">
              <div class="col s6">
                <span class="client-name">       </span>
              </div>
              <div class="col s6">
                <a><i className='material-icons'>keyboard_arrow_downs</i></a>
              </div>
            </div>
          </div>
          <div class="collapsible-body">{orderList}</div>
        </li>
      // </ul>
                // <ul class="collapsible">
                //   <li>
                //     <div class="collapsible-header"><i class="material-icons">filter_drama</i>First</div>
                //     <div class="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
                //   </li>
                //   <li>
                //     <div class="collapsible-header"><i class="material-icons">place</i>Second</div>
                //     <div class="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
                //   </li>
                //   <li>
                //     <div class="collapsible-header"><i class="material-icons">whatshot</i>Third</div>
                //     <div class="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
                //   </li>
                // </ul>
    );
  }
}

export default OrderComponent;