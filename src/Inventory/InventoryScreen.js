
import axios from 'axios';
import React, { Component } from 'react';
import { Color, ColorHex } from '../Colors';
import SearchBar from '../Searchbar/Searchbar';
import InventoryEditItemModal from './InventoryEditItemModal';
import InventoryItemComponent from './InventoryItemComponent';
import CssProperties from '../CssProperties';
import CustomSelect from '../Searchbar/CustomSelect';
import CustomButton from '../Searchbar/CustomButton';
import CustomToggle from '../Searchbar/CustomToggle';

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
          addedTags: [],
          productReccomendations: [],
          autoPromo: true,
          selectedDayNumber: 0
        };
    }

    componentDidMount() {
        this.GetAllData();
    }

    GetAllData = async () => {
        this.props.setIsLoading(true)

        const promise2 = await this.fetchProductData() 
        const promise1 = this.fetchGlobalConfig()
        const promise3 = this.fetchProductReccomendations()
          
        Promise.all([promise1, promise3, promise2])
        .then((results) => {
            this.props.setIsLoading(false)
        })
        .catch((error) => {
            console.error('One of the promises rejected:', error);
        });
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

    fetchProductReccomendations = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/product-correlation/getAllItemReccomendationsList`);
            this.setState({
                productReccomendations: response.data,
            });
        } catch (error) {}
    };

    fetchGlobalConfig = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/global-config`);
            let selectedInventoryItems = {day: response.data.dayInventories[0].day , items: this.state.products.filter(x => response.data.dayInventories[0].itemIds.includes(x.code))}

            this.setState({
                dayInventories: response.data.dayInventories,
                selectedDayInventory: selectedInventoryItems,
                filteredSelectedDayInventory: selectedInventoryItems,
                promoItemCodes: response.data.dayInventories[0].promoItemCodes,
                nextDayIndex: response.data.nextMessageDayIndex
            }).then(x => {
                this.handleDayTabClick(this.state.nextDayIndex) 
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

    handleOpenCreateItem = () => {
        this.setState({
            editItemModelOpen: true,
            itemToEdit: null
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

    handleDayTabClick = async (selectedItem) => {
        const selectedDayNumber = selectedItem.value
        const allInventories = this.state.dayInventories
        console.log("allInventories", allInventories, "selectedDayNumber", selectedDayNumber)
        let selectedInventoryItems = {day: allInventories[selectedDayNumber].day , items: this.state.products.filter(x => allInventories[selectedDayNumber].itemIds.includes(x.code))}

        this.setState({
            selectedDayNumber: selectedDayNumber,
            selectedDayInventory: selectedInventoryItems,
            filteredSelectedDayInventory: selectedInventoryItems,
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
        let updatedProductList = this.state.products?.filter(x => x.code != updatedItem.code)
        updatedProductList.push(updatedItem)

        let updatedFilteredProductList = this.state.filteredProducts.filter(x => x.code != updatedItem.code)
        updatedFilteredProductList.push(updatedItem)

        this.setState({
            products: updatedProductList,
            filteredProducts: updatedFilteredProductList,
        })
    }

    handleSearch = (searchText, isDailyInventory) => {
        const filteredItems = this.state.products.filter(item =>
            item.name.toLowerCase().includes(searchText.toLowerCase())
        );

        if(isDailyInventory) {
            this.setState({
                filteredSelectedDayInventory: {day: this.state.selectedDayInventory.day, items: filteredItems}
            })
        }
        else {
            this.setState({
              filteredProducts: filteredItems
            })
        }

    }

    handleAutoPromoChange = (e) => {
        this.setState({
            autoPromo: e.target.checked
        })
    }

    handleSelectPromoItem = (item) => {
        let newPromoItems = [...this.state.promoItemCodes]

        if(newPromoItems.includes(item.code) == false) {newPromoItems.unshift(item.code)}
        else 
        {
            const removeIndex = newPromoItems.indexOf(item.code);
            newPromoItems.splice(removeIndex, 1);
        }

        if(this.state.autoPromo == true) {
            let reccomendedItems = this.state.productReccomendations.find(x => x.itemCode == item.code)?.reccomendedItemCodes

            newPromoItems = []
            newPromoItems = [item.code, ...reccomendedItems]
        }

        if(newPromoItems.length > 3) {newPromoItems.pop()}

        this.setState({
            promoItemCodes: newPromoItems,
            needsToSave: true
        })
    }

    saveDailyInventories = async () => {
        if(this.state.selectedDayInventory?.items?.length < 5) {this.props.showPopup(new Error("Cargar al menos 5 productos!")); return;}
        if(this.state.promoItemCodes.length < 3) {this.props.showPopup(new Error("Hace falta marcar 3 productos especiales!")); return;}

        this.setState({
            needsToSave: false
        })
        var newDayInventories = this.state.dayInventories
        const selectedDayInventory = this.state.selectedDayInventory

        //Remove old day inventory
        newDayInventories = newDayInventories?.filter(x => x.day != selectedDayInventory.day)
        //add new one
        newDayInventories.push({day: selectedDayInventory.day, itemIds: selectedDayInventory.items.map(x => x.code), promoItemCodes: this.state.promoItemCodes})
        
        var newDayInventoriesDto = []

        newDayInventories.forEach(dayInv => {
            const dayInvDto = 
            {
                day: dayInv.day, itemIds: dayInv.itemIds,
                promoItemCodes: this.state.selectedDayInventory.day == dayInv.day ? this.state.promoItemCodes : dayInv.promoItemCodes
            }
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

    sortByName = (a, b, property) => {

        if(!property) {
            if (a < b) return -1;
            if (a > itemB) return 1;
            return 0;
        }

        const itemA = a[property].toLowerCase();
        const itemB = b[property].toLowerCase();
        if (itemA < itemB) return -1;
        if (itemA > itemB) return 1;
        return 0;
    }

    render() {
        const {selectedDayInventory, filteredProducts, filteredSelectedDayInventory, selectedDayNumber} = this.state

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

        const orderedSelectedDayProducts = filteredSelectedDayInventory?.items?.sort((a, b) => this.sortByName(a, b, "name"))
        const selectedDayProductsList = orderedSelectedDayProducts?.map(listedItem => {
            const isPromoItem = this.state?.promoItemCodes?.find(y => y == listedItem.code) != undefined
            //Only give reccomendations for promo items
            let reccomendedItems = isPromoItem ? this.state.productReccomendations.find(x => x.itemCode == listedItem.code)?.reccomendedItemCodes.slice(0, 2) : []
            reccomendedItems = reccomendedItems?.filter(x => this?.state?.promoItemCodes?.includes(x) == false)

            return(
            <InventoryItemComponent 
                key={listedItem.id} item={listedItem}
                isInDailyInventory={true} 
                isPromoItem={isPromoItem} 
                handleClickCallback={this.handleItemClick}
                handleSelectPromoItemCallback={this.handleSelectPromoItem} 
                handleEditItemCallback={this.handleEditItem}
                reccomendations={reccomendedItems}
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
            isCreateItem={this.state.itemToEdit == null}
        />      
            
        const navbarStyle = {
            display: 'flex',
            justifyContent: 'center',
        };

        const dayDropdownOptions = [
            {value: 0, label: 'Lunes'},
            {value: 1, label: 'Martes'},
            {value: 2, label: 'Miercoles'},
            {value: 3, label: 'Jueves'},
            {value: 4, label: 'Viernes'},
            {value: 5, label: 'Sabado'},
            {value: 6, label: 'Domingo'},
        ]

        return (
            <div>
                {editItemModal}
                <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>{`Inventario de ${dayDropdownOptions.find(x => x.value == selectedDayNumber).label}`}</p>

                <div style={{display: 'flex'}}>
                    <div class="flex-grow-1">
                        <CustomSelect
                            width='292px'
                            height='45px'
                            options={dayDropdownOptions}
                            onChange={(value) => this.handleDayTabClick(value)}
                            value={dayDropdownOptions.find(x => x.value == selectedDayNumber)}
                            isSearchable={false}
                        />
                    </div>
                    <div class="flex-grow-1" style={{paddingLeft: '25px'}}><CustomButton text="Crear un item" width="175px" height="45px" icon="add" onClickCallback={this.handleOpenCreateItem}/></div>
                    <div className="col-6"></div>
                    <div className="col-3" style={{marginLeft: '50px'}}>
                        <CustomToggle text="Auto Promo" checked={this.state.autoPromo} onChange={this.handleAutoPromoChange}/>
                    {/* <div className="switch" style={{ paddingRight: '20px' }}>
                        <label><input type="checkbox" checked={this.state.autoPromo} onChange={this.handleAutoPromoChange} /><span className="lever"></span>Auto Promo</label>
                    </div> */}
                    </div>
                </div>

                <div className='row' style={{paddingTop: '25px'}}>
                    <div className='col-6'>
                        <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody}}>Items Disponible para Cargar</p>
                        <div style={inventoryPanelStyling}>
                            <SearchBar width='100%' height='45px' itemList={this.state.products} searchText="Buscar Productos..." OnSearchCallback={(value) => this.handleSearch(value, false)}/>
                            <div style={scrollStyle}>
                                {allProductsList}
                            </div>
                        </div>
                    </div>
                        <div className='col-6'>
                            <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody}}>{`Items en el Inventario de ${dayDropdownOptions.find(x => x.value == selectedDayNumber).label}`}</p>
                            <div style={inventoryPanelStyling}>
                                <SearchBar width='100%' height='45px' itemList={selectedDayInventory?.items} searchText="Buscar Productos..." OnSearchCallback={(value) => this.handleSearch(value, true)}/>
                                <div style={scrollStyle}>
                                    {selectedDayProductsList}
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
            // <div className={`card bordered ${Color.Background}`}>
            //     {editItemModal}
            //     <div className="card-content">
            //         <nav className="transparent z-depth-0">
            //             <div class="nav-wrapper">
            //             <div className="nav-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            //                 <div style={{ position: 'absolute', left: 0, display: 'flex', alignItems: 'center' }}>
            //                     <div className="switch" style={{ paddingRight: '20px' }}>
            //                         <label><input type="checkbox" checked={this.state.autoPromo} onChange={this.handleAutoPromoChange} /><span className="lever"></span>Auto Promo</label>
            //                     </div>
            //                 </div>
            //                 <ul style={{ ...navbarStyle, margin: 0 }}>
            //                     <li onClick={() => this.handleDayTabClick(0)} className={`${0 == this.state.nextDayIndex ? Color.Third : ``} z-depth-${selectedDayInventory?.day == 0 ? "1" : "0"}`}>
            //                         <a className={`grey-text text-darken-2`}>{0 == this.state.nextDayIndex ? `Hoy Mensajea => ` : ``}Lunes</a>
            //                     </li>
            //                     <li onClick={() => this.handleDayTabClick(1)} className={`${1 == this.state.nextDayIndex ? Color.Third : ``} z-depth-${selectedDayInventory?.day == 1 ? "1" : "0"}`}>
            //                         <a className={`grey-text text-darken-2`}>{1 == this.state.nextDayIndex ? `Hoy Mensajea => ` : ``}Martes</a>
            //                     </li>
            //                     <li onClick={() => this.handleDayTabClick(2)} className={`${2 == this.state.nextDayIndex ? Color.Third : ``} z-depth-${selectedDayInventory?.day == 2 ? "1" : "0"}`}>
            //                         <a className={`grey-text text-darken-2`}>{2 == this.state.nextDayIndex ? `Hoy Mensajea => ` : ``}Miercoles</a>
            //                     </li>
            //                     <li onClick={() => this.handleDayTabClick(3)} className={`${3 == this.state.nextDayIndex ? Color.Third : ``} z-depth-${selectedDayInventory?.day == 3 ? "1" : "0"}`}>
            //                         <a className={`grey-text text-darken-2`}>{3 == this.state.nextDayIndex ? `Hoy Mensajea => ` : ``}Jueves</a>
            //                     </li>
            //                     <li onClick={() => this.handleDayTabClick(4)} className={`${4 == this.state.nextDayIndex ? Color.Third : ``} z-depth-${selectedDayInventory?.day == 4 ? "1" : "0"}`}>
            //                         <a className={`grey-text text-darken-2`}>{4 == this.state.nextDayIndex ? `Hoy Mensajea => ` : ``}Viernes</a>
            //                     </li>
            //                     <li onClick={() => this.handleDayTabClick(5)} className={`${5 == this.state.nextDayIndex ? Color.Third : ``} z-depth-${selectedDayInventory?.day == 5 ? "1" : "0"}`}>
            //                         <a className={`grey-text text-darken-2`}>{5 == this.state.nextDayIndex ? `Hoy Mensajea => ` : ``}Sabado</a>
            //                     </li>
            //                     <li onClick={() => this.handleDayTabClick(6)} className={`${6 == this.state.nextDayIndex ? Color.Third : ``} z-depth-${selectedDayInventory?.day == 6 ? "1" : "0"}`}>
            //                         <a className={`grey-text text-darken-2`}>{6 == this.state.nextDayIndex ? `Hoy Mensajea => ` : ``}Domingo</a>
            //                     </li>
            //                 </ul>
            //                 <div style={{ position: 'absolute', right: 0, display: 'flex', alignItems: 'center' }}>
            //                     <button onClick={this.handleOpenCreateItem} className={`waves-effect waves-light btn-small right ${Color.Fifth}`} style={{ padding: '12px 12px', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
            //                         <i className="material-icons" style={{ fontSize: '18px' }}>add_circle_outline</i>
            //                     </button>
            //                     {
            //                         this.state?.needsToSave == true ?
            //                         <div style={{ marginLeft: '20px' }} className={`waves-effect waves-light btn ${Color.First}`} onClick={this.saveDailyInventories}>Guardar</div>
            //                         :
            //                         <div></div>
            //                     }
            //                 </div>
            //             </div>
            //             </div>
            //         </nav>
            //         <div className='row'>
            //             <div className='col s6'>
            //                 <h6 className='center'>Todos los Artículos</h6>
            //                 <SearchBar itemList={this.state.products} searchText="Buscar Productos..." OnSearchCallback={this.handleSearch}/>
            //                 <div style={{ overflowY: 'scroll', height: '63vh', "overflow-x": "hidden" }}>
            //                     {allProductsList}
            //                 </div>
            //             </div>
            //             <div className='col s6'>
            //                 <h6 className='center'>Artículos Cargados</h6>
            //                 {this.state.products && (<SearchBar itemList={selectedDayInventory?.items} searchText="Buscar Productos..." OnSearchCallback={this.handleDailyInventorySearch}/>)}
            //                 <div style={{ overflowY: 'scroll', height: '63vh', "overflow-x": "hidden" }}>
            //                     {selectedDayProductsList}
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            // </div>
        );
    }
}

const inventoryPanelStyling = {
    width: '100%',
    height: '70vh',
    marginTop: '10px',
    marginTop: '25px',
    padding: '25px',
    boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
    border: `1px solid ${ColorHex.BorderColor}`,
    borderRadius: '10px',
    backgroundColor: ColorHex.White
}

const scrollStyle = {
    borderRadius: '10px',
    backgroundColor: ColorHex.Background,
    padding: '10px',
    marginTop: '25px',
    boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.3)',
    overflowY: 'scroll', 
    height: '55vh',
    width: '100%',
    overflowX: 'hidden',
    alignItems: 'center',
    scrollbarWidth: 'thin', // Makes the scrollbar thinner
}

export default InventoryScreen;
