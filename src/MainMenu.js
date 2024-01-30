import React, { Component } from 'react';
import ExcelFileInput from './Excel/ExcelFileInput';
import ExcelFileOutput from './Excel/ExcelFileOutput';

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

        return (
            <div>
                {this.state.currentPopup}
                <div className='row'>
                    <div style={{ height: '100%' }} className='col s6'>
                        <h6>Actualizar Clientes</h6>
                        <ExcelFileInput dataTypeName={'clientes'} />
                        <p> </p>
                        <h6>Actualizar Productos</h6>
                        <ExcelFileInput dataTypeName={'productos'} />
                    </div>
                </div>
            </div>
        )
    }
}

export default MainMenu
