import React, { useEffect, useState } from 'react';
import { Color } from '../Colors';
import { firestore } from '../firebaseConfig';
import ProblematicChatComponent from './ProblematicChatComponent';

const ProblematicChatsScreen = (props) => {
    const [searchInput, setSearchInput] = useState('');
    const [allChats, setAllChats] = useState(null);
    const [filteredChats, setFilteredChats] = useState(null);

    useEffect(() => {
        if (props.botNumber) {
            fetchChatData();
        }
    }, [props.botNumber]); // Include props.botNumber in the dependency array
    
    const fetchChatData = async () => {
        console.log("props.botNumber", props.botNumber)
        if (!props.botNumber) {
            return;
        }
    
        try {
            const ref = firestore.collection(String(props.botNumber)).orderBy('createdDate');
            ref.onSnapshot(querySnapshot => {
                let chats = [];
                querySnapshot.forEach(doc => {
                    chats.push(doc.data());
                });
                setAllChats(chats);
                setFilteredChats(chats);
            });
        } catch (error) {
            console.error("Error fetching chat data:", error);
        }
    }

    const handleSearchInputChange = (event) => {
        const input = event.target.value;
        setSearchInput(input);
        filterChats(input);
    };

    const filterChats = (input) => {
        const filteredChats = allChats.filter(chat =>
            chat.clientName.toLowerCase().includes(input.toLowerCase()) ||
            chat.phoneNumber.toLowerCase().includes(input.toLowerCase()) ||
            chat.chatDescription.toLowerCase().includes(input.toLowerCase())
        );
        setFilteredChats(filteredChats);
    };

    let i = 0;
    const chatComponents = filteredChats?.map(x => {
        i = i + 1;
        return <ProblematicChatComponent key={i} data={x} index={i} />;
    });

    return (
        <div className={`card bordered ${Color.Background}`}>
            <div className="card-content">
                <input
                    type="text"
                    placeholder="Buscar clientes..."
                    value={searchInput}
                    onChange={handleSearchInputChange}
                />
                <div style={{ overflowY: 'scroll', height: '63vh', overflowX: "hidden" }}>
                    {chatComponents}
                </div>
            </div>
        </div>
    );
};

export default ProblematicChatsScreen;
