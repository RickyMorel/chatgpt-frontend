
import React, { Component } from 'react';
import { Color } from '../Colors';
import ProblematicChatComponent from './ProblematicChatComponent';

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
    }
    

    fetchChatData = async () => {
        try {
        //   const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/client-crud/blockChat`);
        //   let newList = []
        //   response.data.forEach(client => {
        //     const newClientState = {client: client, isBlocked: client.chatIsBlocked}
        //     newList.push(newClientState)
        //   });
        //   this.setState({
        //     allChats: response.data,
        //     filteredChats: response.data,
        //   });
        let newList = []
        for (let i = 0; i < 10; i++) {
            const chat = {clientName: "Juan piña", chatDescription: "El cliente pregunto a que hora se puede traer la comida", link: "https://web.whatsapp.com/"};
            newList.push(chat)
        }
          this.setState({
            allChats: newList,
            filteredChats: newList,
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
        const filteredChats = allChats.filter(chat =>
            chat.name.toLowerCase().includes(searchInput.toLowerCase())
        );
        this.setState({ filteredChats: filteredChats });
    };

    render() {
        // const mockData = [
        //     {
        //         clientName: "Juan Carlos",

        //     }
        // ]
        let i = 0
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
