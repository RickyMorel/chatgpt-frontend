import React, { Component, createRef } from 'react';
import { ColorHex } from '../Colors';

class PaginatedScrollView extends Component {
  constructor(props) {
    super(props);
    this.scrollRef = createRef();
    this.isFetchingData = false;
    this.fetchedAllPoolData = false;
  }

  componentDidMount() {
    const scrollDiv = this.scrollRef.current;

    scrollDiv.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    const scrollDiv = this.scrollRef.current;

    scrollDiv.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const scrollDiv = this.scrollRef.current;
    if (scrollDiv.scrollTop + (scrollDiv.clientHeight + 50) >= scrollDiv.scrollHeight) {
      this.fetchMoreClientBlocks();
    }
  };

  fetchMoreClientBlocks = async () => {
    if (this.isFetchingData || this.fetchedAllPoolData) return;

    this.isFetchingData = true;

    const moreClientBlocks = await this.props.fetchMoreData();

    if (moreClientBlocks.length < this.props.pageSize) {
      this.fetchedAllPoolData = true;
    }

    this.isFetchingData = false;

    // setTimeout(() => {
    //   this.isFetchingData = false;
    // }, 1000);
  };

  render() {
    return (
      <div style={scrollPanelStyle}>
        <div ref={this.scrollRef} style={scrollStyle}>
          {this.props.clientBlocks}
        </div>
      </div>
    )
  }
}

const scrollStyle = {
  overflowY: 'scroll', 
  height: '100%',
  width: '100%',
  alignItems: 'center',
  overflowX: 'hidden'
}

const scrollPanelStyle = {
  borderRadius: '10px',
  backgroundColor: ColorHex.Background,
  padding: '10px',
  boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.3)',
  height: '65vh',
  width: '100%',
  alignItems: 'center',
  paddingTop: '10px'
}

export default PaginatedScrollView;
