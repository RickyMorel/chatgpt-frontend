import React from 'react'

class ClientBlockComponent extends React.Component {
  render() {
    const { name, phoneNumber, address } = this.props;

    return (
      <div className="row list-item z-depth-2 border">
        <div className="col s4">
          <span className="client-name">{name}</span>
        </div>
        <div className="col s4">
          <span className="client-name">+{phoneNumber}</span>
        </div>
        <div className="col s4">
          <a className="waves-effect waves-light btn red red-button">Block</a>
        </div>
      </div>
    );
  }
}

export default ClientBlockComponent;