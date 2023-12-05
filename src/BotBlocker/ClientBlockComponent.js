import React from 'react'

function ClientBlockComponent() {
  return (
    <div className="row list-item z-depth-2 border">
      <div className="col s8">
        <span className="client-name">Client Name</span>
      </div>
      <div className="col s4">
        <a className="waves-effect waves-light btn red red-button">Block</a>
      </div>
    </div>
  )
}

export default ClientBlockComponent