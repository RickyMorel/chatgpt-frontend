import React, { Component } from 'react';
import ExcelFileInput from './Excel/ExcelFileInput';
import ExcelFileOutput from './Excel/ExcelFileOutput';
import { Color } from './Colors';

class MainMenu extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          modalIsOpen: 0,
        };
    }

    openModal = (modalNum) => {
    this.setState({ modalIsOpen: modalNum });
    };

    closeModal = () => {
    this.setState({ modalIsOpen: 0 });
    };

    render() {
        const { modalIsOpen } = this.state;
        console.log("mainmenu this.props", this.props)

        return (
            <div className={`card bordered ${Color.Background}`}>
                <div className="card-content">
                    {this.state.currentPopup}
                    <div className='row'>
                        <div style={{ height: '100%' }} className='col s6 center-align'>
                            <h6>Actualizar Clientes</h6>
                            <ExcelFileInput dataTypeName={'clientes'} setIsLoading={this.props.setIsLoading} />
                            <p> </p>
                            <h6>Actualizar Productos</h6>
                            <ExcelFileInput dataTypeName={'productos'} setIsLoading={this.props.setIsLoading}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MainMenu
