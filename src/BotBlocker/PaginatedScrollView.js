import React, { Component, createRef } from 'react';

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
      <div ref={this.scrollRef} style={{ overflowY: 'scroll', height: '63vh', overflowX: 'hidden' }}>
        {this.props.clientBlocks}
      </div>
    );
  }
}

export default PaginatedScrollView;
