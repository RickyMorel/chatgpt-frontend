
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
          recommendedDailyItemAmount: 20,
          promoItemCodes: [],
          needsToSave: false
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
            console.log("response", response)
            this.setState({
                dayInventories: response.data,
                selectedDayInventory: response.data[0],
                filteredSelectedDayInventory: response.data[0],
                promoItemCodes: response.data[0].promoItemCodes
            });
        } catch (error) {}
    }

    handleItemClick = (movedItem, isInDailyInventory) => {
        if(!isInDailyInventory) {
            this.addToDailyInventory(movedItem);
        } else {
            this.removeFromDailyInventory(movedItem);
        }

        this.setState({
            needsToSave: true
        })
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

    handleDayTabClick = async (selectedDayNumber) => {
        await this.saveDailyInventories()      

        const allInventories = this.state.dayInventories

        this.setState({
            selectedDayInventory: allInventories[selectedDayNumber],
            filteredSelectedDayInventory: allInventories[selectedDayNumber],
            promoItemCodes: allInventories[selectedDayNumber].promoItemCodes
        })
    }   

    handleSearch = (filteredList) => {
        this.setState({
          filteredProducts: filteredList
        })
    }

    handleDailyInventorySearch = (filteredList) => {
        this.setState({
          filteredSelectedDayInventory: {day: this.state.selectedDayInventory.day, items: filteredList}
        })
    }

    handleSelectPromoItem = (item) => {
        let newPromoItems = this.state.promoItemCodes

        if(newPromoItems.includes(item.code) == false) {newPromoItems.unshift(item.code)}
        else 
        {
            const removeIndex = newPromoItems.indexOf(item.code);
            newPromoItems.splice(removeIndex, 1);
        }

        if(newPromoItems.length > 3) {newPromoItems.pop()}

        this.setState({
            promoItems: newPromoItems,
            needsToSave: true
        })
    }

    saveDailyInventories = async () => {
        this.setState({
            needsToSave: false
        })
        var newDayInventories = this.state.dayInventories
        const selectedDayInventory = this.state.selectedDayInventory

        //Remove old day inventory
        newDayInventories = newDayInventories.filter(x => x.day != selectedDayInventory.day)
        //add new one
        newDayInventories.push(selectedDayInventory)
        
        var newDayInventoriesDto = []

        console.log("saveDailyInventories state promo codes", this.state.promoItemCodes)

        newDayInventories.forEach(dayInv => {
            const dayInvDto = 
            {
                day: dayInv.day, itemIds: dayInv.items.map(x => x.code),
                promoItemCodes: this.state.selectedDayInventory.day == dayInv.day ? this.state.promoItemCodes : dayInv.promoItemCodes
            }
            newDayInventoriesDto.push(dayInvDto)
        });

        try {
            console.log("saveDailyInventories newDayInventoriesDto", newDayInventoriesDto)
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
        const selectedDayProductsList = filteredSelectedDayInventory?.items?.map(x => {
            const isPromoItem = this.state?.promoItemCodes?.find(y => y == x.code) != undefined

            return(
            <InventoryItemComponent key={x.id} item={x} isInDailyInventory={true} isPromoItem={isPromoItem} handleClickCallback={this.handleItemClick} handleSelectPromoItemCallback={this.handleSelectPromoItem} />
            )
        });
            

        const navbarStyle = {
            display: 'flex',
            justifyContent: 'center',
        };

        return (
            <div className={`card bordered ${Color.Background}`}>
                <div className="card-content">
                    <nav className="transparent z-depth-0">
                        <div class="nav-wrapper">
                            {
                                this.state?.needsToSave == true ?
                                <div className={`waves-effect waves-light btn right ${Color.First}`} onClick={this.saveDailyInventories}>Guardar</div>
                                :
                                <div></div>
                            }
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
