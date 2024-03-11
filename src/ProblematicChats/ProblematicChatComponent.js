import React from 'react';
import { Color } from '../Colors';

class ProblematicChatComponent extends React.Component {

    render() {
        const {data, index} = this.props

        const alertIconColor = true == true ? "#bd3020" : "#f2f0f0"
        return (
        <div className="row list-item z-depth-2 border">
            <div className="col s1">
                <span className="client-name">{index}</span>
            </div>
            <div className="col s2">
                <span className="client-name">{data.clientName}</span>
            </div>
            <div className="col s5">
                <span className="client-name">{data.chatDescription}</span>
            </div>
            <div className="col s3">
                <span className="client-name">{data.link}</span>
            </div>
            <div className="col s1">
            {/* ${true == true ? Color.First : Color.Fifths} */}
                <i style={{color: alertIconColor}} className={`material-icons`}>brightness_1</i>
            </div>
        </div>
        );
    }
}

export default ProblematicChatComponent;