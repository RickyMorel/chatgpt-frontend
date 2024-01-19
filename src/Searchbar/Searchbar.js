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


    handleSearchInputChange = (event) => {
        const searchInput = event.target.value;
        this.setState({ searchInput }, () => {
            this.filterProducts();
        });
    };

    filterProducts = () => {
        const { items, searchInput } = this.state;
        const filteredItems = items.filter(item =>
            item.name.toLowerCase().includes(searchInput.toLowerCase())
        );
        this.setState({ filteredItems });
      };

    render() {
        const { searchText } = this.props;

        return (
        <div>
            <input
                type="text"
                placeholder={searchText}
                value={this.state.searchInput}
                onChange={(e) => this.handleSearchInputChange(e)}
            />
        </div>
        );
    }
}

export default SearchBar;