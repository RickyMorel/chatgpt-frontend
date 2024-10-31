import React, { Component } from 'react'
import CssProperties from '../CssProperties'
import { ColorHex } from '../Colors'
import Utils from '../Utils'
import { faCheck, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import CustomButton from '../Searchbar/CustomButton'

class OrderPlacingItem extends Component {
  render() {
    const {item, OnAddCallback, itemsInCart} = this.props

    return (
        <div style={trStyle}>
            <div className="col-2" style={colStyle}>
                {
                    item?.imageLink && item?.imageLink?.length > 1 ?
                    <img src={item.imageLink} className="img-fluid rounded" style={{ width: '100%', height: "100%" }} />
                    :
                    <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbQLGnT0RH-Rh0_5NefuPRVbUAXU0CxPfpDw&s' className="img-fluid rounded" style={{ width: '100%', height: "100%" }} />
                }
            </div>
            <div className="col-8">
                <p style={{...CssProperties.BodyTextStyle, color: ColorHex.TextBody, textAlign: 'left', marginTop: '20px', marginRight: '5px',textOverflow: 'ellipsis', whiteSpace: 'nowrap' ,overflow: 'hidden'}}>{item.name}</p>
                <p style={{...CssProperties.BodyTextStyle, color: ColorHex.TextBody, textAlign: 'left', marginTop: '-15px'}}>{Utils.formatPrice(item.price)}</p>
            </div>
            <div className="col-1">
                {
                    !itemsInCart.find(x => x.code == item.code) ?
                    <CustomButton iconSize="25px" width='40px' height="40px" icon={faPlus} onClickCallback={() => OnAddCallback(item, true)}/>
                    :
                    <CustomButton iconSize="25px" width='40px' classStyle="btnGreen-clicked" height="40px" icon={faCheck} onClickCallback={() => OnAddCallback(item, false)}/>
                }
            </div>
        </div>
    )
  }
}

const colStyle = {
    marginRight: '10px'
}

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

export default OrderPlacingItem