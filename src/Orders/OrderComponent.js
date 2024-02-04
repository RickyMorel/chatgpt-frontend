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

    let orderItemCount = 0
    const orderList = order?.map(x => {
      orderItemCount = orderItemCount + 1
      const i = orderItemCount

      return(
        <div className='row'>
          <div className='col s3'>
            <span style={{ width: '100%'  }}>{i}</span>
          </div>
          <div className='col s3'>
            <span style={{ width: '100%'  }}>{x.name}</span>
          </div>
          <div className='col s6'>
            <span style={{ width: '100%'  }}>{x.amount}</span>
          </div>
        </div>
      )
      });

    console.log("orderList", orderList)

    return (
        <li className="collection-item">
          <div class="collapsible-header">
            <span class="client-name" style={{ width: '80%'  }}>{orderNumber}</span>
            <span class="client-name" style={{ width: '100%'  }}>{name}</span>
            <span class="client-name" style={{ width: '100%'  }}>+{phoneNumber}</span>
            <span class="client-name" style={{ width: '100%'  }}>{orderNumber}</span>
            <a><i className='material-icons' style={{ width: '100%'  }}>keyboard_arrow_downs</i></a>
          </div>
          <div class="collapsible-body">
            {orderList} 
          </div>
        </li>
    );
  }
}

export default OrderComponent;