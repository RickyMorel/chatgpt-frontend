import React, { Component } from 'react';
import { ColorHex } from '../Colors';
import { border, borderRadius, padding } from '@mui/system';
import CssProperties from '../CssProperties';

class SearchBar extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          filteredItems: null,
          searchInput: '',
        };
    }


    handleSearchInputChange = (event, OnSearchCallback) => {
        const searchInput = event.target.value;
        this.setState({ searchInput }, () => {
            OnSearchCallback(searchInput)
        });
    };

    // filterProducts = (OnSearchCallback, itemList) => {
    //     const { searchInput } = this.state;
    //     console.log("filterProducts", itemList, searchInput)
    //     const filteredItems = itemList.filter(item =>
    //         item.name.toLowerCase().includes(searchInput.toLowerCase())
    //     );
    //     this.setState({ filteredItems });

    //     OnSearchCallback(filteredItems)
    // };

    render() {
        const { searchText, OnSearchCallback } = this.props;

        const searchBarStyling = {
            backgroundColor: ColorHex.Background,
            width: '292px',
            height: '45px',
            borderRadius: '10px',
            border: '0px',
            position: 'relative',
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '15px',
            paddingRight: '15px',
        }

        return (
        <div style={searchBarStyling}>
            <input
                type="text"
                placeholder={searchText}
                value={this.state.searchInput}
                onChange={(e) => this.handleSearchInputChange(e, OnSearchCallback)}
                style={{border: '0px', outline: '0px', backgroundColor: ColorHex.Background, width: '90%', height: '100%', borderRadius: '10px', color: ColorHex.TextBody, ...CssProperties.TextBody}}
            />
            <i className='material-icons' style={{color: ColorHex.TextBody, fontSize: '25px'}}>search</i>
        </div>
        );
    }
}

export default SearchBar;