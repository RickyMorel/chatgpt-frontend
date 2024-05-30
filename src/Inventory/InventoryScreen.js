
import axios from 'axios';
import React, { Component } from 'react';
import { Color } from '../Colors';
import SearchBar from '../Searchbar/Searchbar';
import InventoryEditItemModal from './InventoryEditItemModal';
import InventoryItemComponent from './InventoryItemComponent';

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
          needsToSave: false,
          nextDayIndex: -1,
          editItemModelOpen: false,
          itemToEdit: null,
          addedTags: []
        };
    }

    componentDidMount() {
        this.GetAllData();
    }

    GetAllData = async () => {
        this.props.setIsLoading(true)
    
        await this.fetchGlobalConfig();
        await this.fetchProductData();
    
        console.log("Force select day!", this.state.nextDayIndex); this.handleDayTabClick(this.state.nextDayIndex) 

        this.props.setIsLoading(false)
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
                dayInventories: response.data.dayInventories,
                selectedDayInventory: response.data.dayInventories[0],
                filteredSelectedDayInventory: response.data.dayInventories[0],
                promoItemCodes: response.data.dayInventories[0].promoItemCodes,
                nextDayIndex: response.data.nextDayIndex
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

    handleEditItem = (item) => {
        this.setState({
            editItemModelOpen: item != undefined,
            itemToEdit: item
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

        // this.checkDailyItemOverload();
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
        const allInventories = this.state.dayInventories

        this.setState({
            selectedDayInventory: allInventories[selectedDayNumber],
            filteredSelectedDayInventory: allInventories[selectedDayNumber],
            promoItemCodes: allInventories[selectedDayNumber].promoItemCodes
        })
    }   

    handleAddNewTag = (tag) => {
        const newTag = tag.trim();
        if (newTag && !this.state?.addedTags.includes(newTag)) {
            this.setState(prevState => ({
                addedTags: [...prevState.addedTags, newTag]
            }));
        }
    }

    updateProductLists = (updatedItem) => {
        console.log("updateProductLists updatedItem.code", updatedItem)
        console.log("updateProductLists this.state.products", this.state.products)
        console.log("updateProductLists this.state.filteredProducts", this.state.filteredProducts)
        let updatedProductList = this.state.products?.filter(x => x.code != updatedItem.code)
        updatedProductList.push(updatedItem)

        let updatedFilteredProductList = this.state.filteredProducts.filter(x => x.code != updatedItem.code)
        updatedFilteredProductList.push(updatedItem)

        this.setState({
            products: updatedProductList,
            filteredProducts: updatedFilteredProductList,
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

        console.log("newDayInventories", newDayInventories)

        //Remove old day inventory
        newDayInventories = newDayInventories?.filter(x => x.day != selectedDayInventory.day)
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
                dayInventories: response.data.dayInventories,
            });
        } catch (error) {
            this.props.showPopup(error);
        }
    }

    sortByName = (a, b, property) => {
        const itemA = a[property].toLowerCase();
        const itemB = b[property].toLowerCase();
        if (itemA < itemB) return -1;
        if (itemA > itemB) return 1;
        return 0;
    }

    render() {
        const {selectedDayInventory, filteredProducts, filteredSelectedDayInventory} = this.state

        const orderedFilteredProducts = filteredProducts?.sort((a, b) => this.sortByName(a, b, "name"))
        const allProductsList = orderedFilteredProducts?.map(x => {
            if(selectedDayInventory?.items?.find(y => y.code == x.code)) {return null;}

            return(
                <InventoryItemComponent 
                    key={x.id}
                    item={x}
                    isInDailyInventory={false}
                    handleClickCallback={this.handleItemClick} 
                    handleEditItemCallback={this.handleEditItem}
                />
            )
        });

        console.log("filteredSelectedDayInventory", filteredSelectedDayInventory)
        const orderedSelectedDayProducts = filteredSelectedDayInventory?.items?.sort((a, b) => this.sortByName(a, b, "name"))
        const selectedDayProductsList = orderedSelectedDayProducts?.map(x => {
            const isPromoItem = this.state?.promoItemCodes?.find(y => y == x.code) != undefined

            return(
            <InventoryItemComponent 
                key={x.id} item={x}
                isInDailyInventory={true} 
                isPromoItem={isPromoItem} 
                handleClickCallback={this.handleItemClick}
                handleSelectPromoItemCallback={this.handleSelectPromoItem} 
                handleEditItemCallback={this.handleEditItem}
            />
            )
        });

        let allTags = []

        this.state?.products?.forEach(item => {
            item.tags.forEach(tag => {
                if(allTags.includes(tag) == false) { allTags.push(tag) }
            });
            this.state?.addedTags.forEach(addedTag => {
                if(allTags.includes(addedTag) == false) { allTags.push(addedTag) }
            });
        });

        allTags = allTags?.sort()

        const editItemModal = 
        <InventoryEditItemModal 
            isOpen={this.state.editItemModelOpen} 
            itemToEdit={this.state.itemToEdit} 
            closeCallback={() => this.handleEditItem(undefined)}
            allTags={allTags}
            addNewTagCallback={this.handleAddNewTag}
            updateProductsCallback={this.updateProductLists}
            showPopup={this.props.showPopup}
        />      
            

        const navbarStyle = {
            display: 'flex',
            justifyContent: 'center',
        };

        return (
            <div className={`card bordered ${Color.Background}`}>
                {editItemModal}
                <div className="card-content">
                    <nav className="transparent z-depth-0">
                        <div class="nav-wrapper">
                            {
                                this.state?.needsToSave == true ?
                                <div className={`waves-effect waves-light btn right ${Color.First}`} onClick={this.saveDailyInventories}>Guardar</div>
                                :
                                <div></div>
                            }
                            <ul style={navbarStyle}>
                                <li onClick={() => this.handleDayTabClick(0)} className={`${0 == this.state.nextDayIndex ? Color.Third : ``} z-depth-${selectedDayInventory?.day == 0 ? "1" : "0"}`}>
                                    <a className={`grey-text text-darken-2`}>{0 == this.state.nextDayIndex ? `Hoy Mensajea => ` : ``}Lunes</a></li>
                                <li onClick={() => this.handleDayTabClick(1)} className={`${1 == this.state.nextDayIndex ? Color.Third : ``} z-depth-${selectedDayInventory?.day == 1 ? "1" : "0"}`}>
                                    <a className={`grey-text text-darken-2`}>{1 == this.state.nextDayIndex ? `Hoy Mensajea => ` : ``}Martes</a></li>
                                <li onClick={() => this.handleDayTabClick(2)} className={`${2 == this.state.nextDayIndex ? Color.Third : ``} z-depth-${selectedDayInventory?.day == 2 ? "1" : "0"}`}>
                                    <a className={`grey-text text-darken-2`}>{2 == this.state.nextDayIndex ? `Hoy Mensajea => ` : ``}Miercoles</a></li>
                                <li onClick={() => this.handleDayTabClick(3)} className={`${3 == this.state.nextDayIndex ? Color.Third : ``} z-depth-${selectedDayInventory?.day == 3 ? "1" : "0"}`}>
                                    <a className={`grey-text text-darken-2`}>{3 == this.state.nextDayIndex ? `Hoy Mensajea => ` : ``}Jueves</a></li>
                                <li onClick={() => this.handleDayTabClick(4)} className={`${4 == this.state.nextDayIndex ? Color.Third : ``} z-depth-${selectedDayInventory?.day == 4 ? "1" : "0"}`}>
                                    <a className={`grey-text text-darken-2`}>{4 == this.state.nextDayIndex ? `Hoy Mensajea => ` : ``}Viernes</a></li>
                                <li onClick={() => this.handleDayTabClick(5)} className={`${5 == this.state.nextDayIndex ? Color.Third : ``} z-depth-${selectedDayInventory?.day == 5 ? "1" : "0"}`}>
                                    <a className={`grey-text text-darken-2`}>{5 == this.state.nextDayIndex ? `Hoy Mensajea => ` : ``}Sabado</a></li>
                                <li onClick={() => this.handleDayTabClick(6)} className={`${6 == this.state.nextDayIndex ? Color.Third : ``} z-depth-${selectedDayInventory?.day == 6 ? "1" : "0"}`}>
                                    <a className={`grey-text text-darken-2`}>{6 == this.state.nextDayIndex ? `Hoy Mensajea => ` : ``}Domingo</a></li>
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
