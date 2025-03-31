import React, { Component } from 'react'
import CssProperties from '../CssProperties';
import { ColorHex } from '../Colors';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import CustomButton from '../Searchbar/CustomButton';
import Utils from '../Utils';
import { faDeleteLeft, faTrash } from '@fortawesome/free-solid-svg-icons';

class ExampleConversationComponent extends Component {
    render() {
        const { example, deleteCallback } = this.props;

        return (
        <div className="row" style={trStyle}>
            <div className="col-8">
                <p style={{...CssProperties.BodyTextStyle, color: ColorHex.TextBody, textAlign: 'left', marginTop: '12px'}}>{Utils.getCutName(example.correctedChat[0].content, 140)}</p>
            </div>
            <div className="col-1">
                <p style={{...CssProperties.BodyTextStyle, color: ColorHex.TextBody, textAlign: 'center', marginTop: '12px'}}>{example.correctedChat.length}</p>
            </div>
            <div className="col-2">
                <p style={{...CssProperties.BodyTextStyle, color: ColorHex.TextBody, textAlign: 'center', marginTop: '12px'}}>{Utils.formatDate(example.creationDate)}</p>
            </div>
            <div className="col-1" style={{display: 'flex', gap: '10px'}}>
                <CustomButton iconSize="25px" width='40px' height="40px" icon={faPenToSquare} link="createExampleConversation" linkData={example}/>
                <CustomButton iconSize="25px" width='40px' height="40px" icon={faTrash} classStyle="btnRed" onClickCallback={() => deleteCallback(example.creationDate)}/>
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
    height: '65px',
    width: '100%',
    alignItems: 'center',
    marginBottom: '12px',
    display: 'flex',
    marginLeft: '5px',
  }

export default ExampleConversationComponent