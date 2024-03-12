import React from 'react';
import { Color } from '../Colors';

class ProblematicChatComponent extends React.Component {

    getTime = (date) => {
        const reactDate = new Date(date)
        const hours = reactDate.getHours();
        const minutes = reactDate.getMinutes();

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    }

    render() {
        const {data, index} = this.props

        const alertIconColor = data.attended == true ? "#f2f0f0" : "#bd3020"
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
            <div className="col s1">
                <span className="client-name">{this.getTime(data.createdDate)}</span>
            </div>
            <div className="col s2">
                <a href={"https://wa.me/" + data.phoneNumber} target="_blank" rel="noopener noreferrer">{data.phoneNumber}</a>
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