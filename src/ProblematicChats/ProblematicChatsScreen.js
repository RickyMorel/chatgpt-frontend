
import React, { Component } from 'react';
import { Color } from '../Colors';
import ProblematicChatComponent from './ProblematicChatComponent';
import axios from 'axios';

class ProblematicChatsScreen extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            searchInput: '',
            allChats: null,
            filteredChats: null,
        };
    }

    componentDidMount() {
        this.fetchChatData()
        // const audio = new Audio("https://www.youtube.com/watch?v=yfPJhWo8HR8")
        // audio.play()
    }

    fetchChatData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/problematic-chats`);
          this.setState({
            allChats: response.data,
            filteredChats: response.data,
          });
        } catch (error) {
          this.setState({ error: error });
        } finally {
          this.setState({ loading: false });
        }
      };

    handleSearchInputChange = (event) => {
        const searchInput = event.target.value;
        this.setState({ searchInput }, () => {
          this.filterChats();
        });
    };

    filterChats = () => {
        const { allChats, searchInput } = this.state;
        console.log("allChats", allChats)
        const filteredChats = allChats.filter(chat =>
            chat.clientName.toLowerCase().includes(searchInput.toLowerCase()) ||
            chat.phoneNumber.toLowerCase().includes(searchInput.toLowerCase()) ||
            chat.chatDescription.toLowerCase().includes(searchInput.toLowerCase())
        );
        this.setState({ filteredChats: filteredChats });
    };

    render() {
        let i = 0
        const sortedChats = this.state.filteredChats?.slice().sort((a, b) => {
            // Sort by attended (true first)
            const attendedA = a.attended ? 1 : 0;
            const attendedB = b.attended ? 1 : 0;
            if (attendedA !== attendedB) {
                return attendedB - attendedA; // Sort in descending order of attended
            }
            
            // If attended is the same, sort by createdDate
            const createdDateA = new Date(a.createdDate);
            const createdDateB = new Date(b.createdDate);
            if (createdDateA < createdDateB) return -1;
            if (createdDateA > createdDateB) return 1;
            return 0;
        });
        const chatComponents = this.state.filteredChats?.map(x => {
            i = i + 1

            return <ProblematicChatComponent data={x} index={i}/>
        });

        return (
            <div className={`card bordered ${Color.Background}`}>
                <div className="card-content">
                    <input
                        type="text"
                        placeholder="Buscar clientes..."
                        value={this.state.searchInput}
                        onChange={this.handleSearchInputChange}
                    />
                    <div style={{ overflowY: 'scroll', height: '63vh', "overflow-x": "hidden" }}>
                        {chatComponents}
                    </div>
                </div>
            </div>
        );
    }
}

export default ProblematicChatsScreen;
