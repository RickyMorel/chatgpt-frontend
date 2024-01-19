import React, { Component } from 'react';

class SearchBar extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          items: null,
          filteredItems: null,
          searchInput: '',
        };
    }

    componentDidMount() {
        this.setState({
            items: this.props.itemList
        });
    }


    handleSearchInputChange = (event, OnSearchCallback) => {
        const searchInput = event.target.value;
        this.setState({ searchInput }, () => {
            this.filterProducts(OnSearchCallback);
        });
    };

    filterProducts = (OnSearchCallback) => {
        const { items, searchInput } = this.state;
        const filteredItems = items.filter(item =>
            item.name.toLowerCase().includes(searchInput.toLowerCase())
        );
        this.setState({ filteredItems });

        OnSearchCallback(filteredItems)
      };

    render() {
        const { searchText, OnSearchCallback } = this.props;

        return (
        <div>
            <input
                type="text"
                placeholder={searchText}
                value={this.state.searchInput}
                onChange={(e) => this.handleSearchInputChange(e, OnSearchCallback)}
            />
        </div>
        );
    }
}

export default SearchBar;