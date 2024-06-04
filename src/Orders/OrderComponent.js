import React from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min.js';
import { ColorHex } from '../Colors';

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

    let unsureItemHtml = <p className='green-text'>Seguro de pedido</p>

    for(const item of order) {
      if(item.botState == "UNSURE") {unsureItemHtml = <p className='orange-text'>Inseguro de pedido</p>}
      else if(item.botState == "NOT_IN_INVENTORY") {unsureItemHtml = <p className='red-text'>No encontro producto pedido</p>; break;}
    }

    const orderList = order?.map(x => {
      orderItemCount = orderItemCount + 1
      const i = orderItemCount
      let botStateHtml = <p className='green-text'>Seguro</p>
      if(x.botState == "UNSURE") {botStateHtml = <p className='orange-text'>Inseguro</p>}
      else if(x.botState == "NOT_IN_INVENTORY") {botStateHtml = <p className='red-text'>No encontro</p>;}

      return(
        <div className='row'>
          <div className='col s3'>
            <span style={{ width: '100%'  }}>{i}</span>
          </div>
          <div className='col s3'>
            <span style={{ width: '100%'  }}>{x.name}</span>
          </div>
          <div className='col s4'>
            <span style={{ width: '100%'  }}>{x.amount}</span>
          </div>
          <div className='col s2'>
            <span style={{ width: '100%'  }}>{botStateHtml}</span>
          </div>
        </div>
      )
      });

    return (
        <li className="collection-item">
          <div class="collapsible-header">
            <span class="client-name" style={{ width: '80%'  }}>{orderNumber}</span>
            <span class="client-name" style={{ width: '100%'  }}>{name}</span>
            <span class="client-name" style={{ width: '100%'  }}>
              <a href={"https://wa.me/" + phoneNumber} target="_blank" rel="noopener noreferrer" className="underlined-link">{phoneNumber}</a>
            </span>
            <span class="client-name" style={{ width: '100%'  }}>{orderNumber}</span>
            <span class="client-name" style={{ width: '100%'  }}>{unsureItemHtml}</span>
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