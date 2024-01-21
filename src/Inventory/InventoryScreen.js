
import React, { Component } from 'react';
import ProductComponent from '../Products/ProductComponent';
import SearchBar from '../Searchbar/Searchbar';
import axios from 'axios';

class InventoryScreen extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          products: null,
          filteredProducts: null,
          searchInput: '',
          dayInventories: null,
          selectedDayInventory: null
        };
    }

    componentDidMount() {
        this.fetchGlobalConfig();
        this.fetchProductData();
    }
    
    fetchProductData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/inventory/allItems`);
            this.setState({
            products: response.data,
            filteredProducts: response.data,
            });
        } catch (error) {}
    };

    fetchGlobalConfig = async () => {
        console.log("fetchGlobalConfig")
        try {
            const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/inventory/getDayInventories`);
            this.setState({
                dayInventories: response.data,
                selectedDayInventory: response.data[0]
            });
        } catch (error) {}
    }

    handleClick = (selectedDayNumber) => {
        const allInventories = this.state.dayInventories
        this.setState({
            selectedDayInventory: allInventories[selectedDayNumber]
        })
    }
    

    handleSearch = (filteredList) => {
        this.setState({
          filteredProducts: filteredList
        })
    }
    
    render() {
        const allProductsList = this.state.filteredProducts?.map(x => (
            <ProductComponent key={x.id} {...x} />
          ));
        const selectedDayProductsList = this.state.selectedDayInventory?.items?.map(x => (
            <ProductComponent key={x.id} {...x} />
        ));

        const navbarStyle = {
        display: 'flex',
        justifyContent: 'center',
        };

        return (
        <div>
            <nav className="transparent" style={navbarStyle}>
                <ul className="center-align">
                    <li onClick={() => this.handleClick(0)}><a>Lunes</a></li>
                    <li onClick={() => this.handleClick(1)}><a>Martes</a></li>
                    <li onClick={() => this.handleClick(2)}><a>Miercoles</a></li>
                    <li onClick={() => this.handleClick(3)}><a>Jueves</a></li>
                    <li onClick={() => this.handleClick(4)}><a>Viernes</a></li>
                    <li onClick={() => this.handleClick(5)}><a>Sabado</a></li>
                    <li onClick={() => this.handleClick(6)}><a>Domingo</a></li>
                </ul>
            </nav>
            <div className='row'>
                <div className='col s6'>
                    <SearchBar itemList={this.state.products} searchText="Buscar Productos..." OnSearchCallback={this.handleSearch}/>
                    <div style={{ overflowY: 'scroll', height: '600px' }}>
                        {allProductsList}
                    </div>
                </div>
                <div className='col s6'>
                    <SearchBar itemList={this.state.products} searchText="Buscar Productos..." OnSearchCallback={this.handleSearch}/>
                    <div style={{ overflowY: 'scroll', height: '600px' }}>
                        {selectedDayProductsList}
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default InventoryScreen;
