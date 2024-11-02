import React, { Component } from 'react'
import CssProperties from '../CssProperties'
import { ColorHex } from '../Colors'
import Utils from '../Utils'
import { faCheck, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import CustomButton from '../Searchbar/CustomButton'
import CustomInput from '../Searchbar/CustomInput'

class ClientCartItem extends Component {
  render() {
    const {item, editAmountCallback, itemsInCart} = this.props

    return (
        <div style={trStyle}>
            <div className="col-2" style={colStyle}>
                {
                    item?.imageLink && item?.imageLink?.length > 1 ?
                    <img src={item.imageLink} className="img-fluid rounded" style={{ width: '55px', height: "100%" }} />
                    :
                    <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbQLGnT0RH-Rh0_5NefuPRVbUAXU0CxPfpDw&s' className="img-fluid rounded" style={{ width: '55px', height: "1--%" }} />
                }
            </div>
            <div className="col-5">
                <p style={{...CssProperties.BodyTextStyle, color: ColorHex.TextBody, textAlign: 'left', marginTop: '20px', marginRight: '5px',textOverflow: 'ellipsis', whiteSpace: 'nowrap' ,overflow: 'hidden'}}>{item.name}</p>
                <p style={{...CssProperties.BodyTextStyle, color: ColorHex.TextBody, textAlign: 'left', marginTop: '-15px'}}>{Utils.formatPrice(item.price)}</p>
            </div>
            <div className="col-4" style={{display: 'flex', alignItems: 'center'}}>
                <CustomButton iconSize="15px" width='15px' height="15px" icon={faMinus} onClickCallback={() => editAmountCallback(item, false)}/>
                <div style={amountStyle}>
                    <p style={{...CssProperties.BodyTextStyle, color: ColorHex.TextBody, textAlign: 'center', marginTop: '15px'}}>{item.amount}</p>
                </div>
                <CustomButton iconSize="15px" width='15px' height="15px" icon={faPlus} onClickCallback={() => editAmountCallback(item, true)}/>
            </div>
        </div>
    )
  }
}

const colStyle = {
    marginRight: '10px'
}

const amountStyle = {
    backgroundColor: ColorHex.White,
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
    border: `1px solid ${ColorHex.BorderColor}`,
    position: 'relative',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

const trStyle = {
    borderRadius: '10px',
    backgroundColor: ColorHex.White,
    boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
    border: `1px solid ${ColorHex.BorderColor}`,
    height: '65px',
    width: '100%',
    alignItems: 'center',
    marginBottom: '12px',
    display: 'flex',
    padding: '10px'
}

export default ClientCartItem