import React, { Component } from 'react';

class SearchBar extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          filteredItems: null,
          searchInput: '',
        };
    }


    handleSearchInputChange = (event, OnSearchCallback, itemList) => {
        const searchInput = event.target.value;
        this.setState({ searchInput }, () => {
            this.filterProducts(OnSearchCallback, itemList);
        });
    };

    filterProducts = (OnSearchCallback, itemList) => {
        const { searchInput } = this.state;
        console.log("filterProducts", itemList, searchInput)
        const filteredItems = itemList.filter(item =>
            item.name.toLowerCase().includes(searchInput.toLowerCase())
        );
        this.setState({ filteredItems });

        OnSearchCallback(filteredItems)
      };

    render() {
        const { searchText, OnSearchCallback, itemList } = this.props;

        return (
        <div>
            <input
                type="text"
                placeholder={searchText}
                value={this.state.searchInput}
                onChange={(e) => this.handleSearchInputChange(e, OnSearchCallback, itemList)}
            />
        </div>
        );
    }
}

export default SearchBar;