
import axios from 'axios';
import React, { Component } from 'react';
import SearchBar from '../Searchbar/Searchbar';
import InventoryItemComponent from './InventoryItemComponent';
import { Link } from 'react-router-dom';
import { Color } from '../Colors';

class InventoryScreen extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          products: null,
          filteredProducts: null,
          dayInventories: null,
          selectedDayInventory: null,
          filteredSelectedDayInventory: null,
          recommendedDailyItemAmount: 20
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
        try {
            const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/inventory/getDayInventories`);
            this.setState({
                dayInventories: response.data,
                selectedDayInventory: response.data[0],
                filteredSelectedDayInventory: response.data[0]
            });
        } catch (error) {}
    }

    handleItemClick = (movedItem, isInDailyInventory) => {
        if(!isInDailyInventory) {
            this.addToDailyInventory(movedItem);
        } else {
            this.removeFromDailyInventory(movedItem);
        }
    }

    addToDailyInventory(movedItem) {
        var currentSelectedItems = [...this.state.selectedDayInventory.items];

        if (!currentSelectedItems.find(x => x.code == movedItem.code)) { currentSelectedItems.push(movedItem); }

        const newSelectedInventory = { day: this.state.selectedDayInventory.day, items: currentSelectedItems };

        this.setState({
            selectedDayInventory: newSelectedInventory,
            filteredSelectedDayInventory: newSelectedInventory
        });

        this.checkDailyItemOverload();
    }

    removeFromDailyInventory(movedItem) {
        var currentSelectedItems = [...this.state.selectedDayInventory.items];

        currentSelectedItems = currentSelectedItems.filter(x => x.code != movedItem.code)

        const newSelectedInventory = { day: this.state.selectedDayInventory.day, items: currentSelectedItems };

        this.setState({
            selectedDayInventory: newSelectedInventory,
            filteredSelectedDayInventory: newSelectedInventory
        });
    }

    checkDailyItemOverload = () => {
        if(this.state.selectedDayInventory.items.length == this.state.recommendedDailyItemAmount) {
            this.props.showPopup(new Error(`Se aconseja mantener menos de ${this.state.recommendedDailyItemAmount} items, ya que la inteligencia artificial tiende a confundirse cuando hay una gran cantidad de productos`));
        }
    }

    handleDayTabClick = (selectedDayNumber) => {
        this.saveDailyInventories()

        const allInventories = this.state.dayInventories

        this.setState({
            selectedDayInventory: allInventories[selectedDayNumber],
            filteredSelectedDayInventory: allInventories[selectedDayNumber]
        })
    }   

    handleSearch = (filteredList) => {
        this.setState({
          filteredProducts: filteredList
        })
    }

    handleDailyInventorySearch = (filteredList) => {
        console.log("handleDailyInventorySearch", filteredList)
        this.setState({
          filteredSelectedDayInventory: {day: this.state.selectedDayInventory.day, items: filteredList}
        })
    }

    saveDailyInventories = async () => {
        var newDayInventories = this.state.dayInventories
        const selectedDayInventory = this.state.selectedDayInventory

        //Remove all day inventory
        newDayInventories = newDayInventories.filter(x => x.day != selectedDayInventory.day)
        //add new one
        newDayInventories.push(selectedDayInventory)
        
        var newDayInventoriesDto = []

        newDayInventories.forEach(dayInv => {
            const dayInvDto = {day: dayInv.day, itemIds: dayInv.items.map(x => x.code)}
            newDayInventoriesDto.push(dayInvDto)
        });

        try {
            const response = await axios.put(`${process.env.REACT_APP_HOST_URL}/global-config/dayInventory`, {inventories: newDayInventoriesDto});
            this.setState({
                dayInventories: response.data,
            });
        } catch (error) {
            this.props.showPopup(error);
        }
    }

    render() {
        const {selectedDayInventory, filteredProducts, filteredSelectedDayInventory} = this.state

        const allProductsList = filteredProducts?.map(x => {
            if(selectedDayInventory?.items?.find(y => y.code == x.code)) {return null;}

            return(
                <InventoryItemComponent key={x.id} item={x} isInDailyInventory={false} handleClickCallback={this.handleItemClick} />
            )
        });
        const selectedDayProductsList = filteredSelectedDayInventory?.items?.map(x => (
            <InventoryItemComponent key={x.id} item={x} isInDailyInventory={true} handleClickCallback={this.handleItemClick} />
        ));

        const navbarStyle = {
            display: 'flex',
            justifyContent: 'center',
        };

        return (
            <div className={`card bordered ${Color.Background}`}>
                <div className="card-content">
                    <nav className="transparent z-depth-0">
                        <div class="nav-wrapper">
                            {/* <Link className={`waves-light ${Color.Button_1}`} to="/" onClick={() => this.saveDailyInventories()}><i className="material-icons left teal-text">arrow_back</i></Link> */}
                            <ul style={navbarStyle}>
                                <li onClick={() => this.handleDayTabClick(0)} className={`z-depth-${selectedDayInventory?.day == 0 ? "1" : "0"}`}><a className={`grey-text text-darken-2`}>Lunes</a></li>
                                <li onClick={() => this.handleDayTabClick(1)} className={`z-depth-${selectedDayInventory?.day == 1 ? "1" : "0"}`}><a className={`grey-text text-darken-2`}>Martes</a></li>
                                <li onClick={() => this.handleDayTabClick(2)} className={`z-depth-${selectedDayInventory?.day == 2 ? "1" : "0"}`}><a className={`grey-text text-darken-2`}>Miercoles</a></li>
                                <li onClick={() => this.handleDayTabClick(3)} className={`z-depth-${selectedDayInventory?.day == 3 ? "1" : "0"}`}><a className={`grey-text text-darken-2`}>Jueves</a></li>
                                <li onClick={() => this.handleDayTabClick(4)} className={`z-depth-${selectedDayInventory?.day == 4 ? "1" : "0"}`}><a className={`grey-text text-darken-2`}>Viernes</a></li>
                                <li onClick={() => this.handleDayTabClick(5)} className={`z-depth-${selectedDayInventory?.day == 5 ? "1" : "0"}`}><a className={`grey-text text-darken-2`}>Sabado</a></li>
                                <li onClick={() => this.handleDayTabClick(6)} className={`z-depth-${selectedDayInventory?.day == 6 ? "1" : "0"}`}><a className={`grey-text text-darken-2`}>Domingo</a></li>
                            </ul>
                        </div>
                    </nav>
                    <div className='row'>
                        <div className='col s6'>
                            <SearchBar itemList={this.state.products} searchText="Buscar Productos..." OnSearchCallback={this.handleSearch}/>
                            <div style={{ overflowY: 'scroll', height: '63vh', "overflow-x": "hidden" }}>
                                {allProductsList}
                            </div>
                        </div>
                        <div className='col s6'>
                            {this.state.products && (<SearchBar itemList={selectedDayInventory?.items} searchText="Buscar Productos..." OnSearchCallback={this.handleDailyInventorySearch}/>)}
                            <div style={{ overflowY: 'scroll', height: '63vh', "overflow-x": "hidden" }}>
                                {selectedDayProductsList}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default InventoryScreen;
