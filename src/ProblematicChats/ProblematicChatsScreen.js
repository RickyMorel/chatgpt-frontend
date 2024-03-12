import React, { useState, useEffect } from 'react';
import { Color } from '../Colors';
import ProblematicChatComponent from './ProblematicChatComponent';
import axios from 'axios';
import firebase from "../firebaseConfig";

const ProblematicChatsScreen = () => {
    const [searchInput, setSearchInput] = useState('');
    const [allChats, setAllChats] = useState(null);
    const [filteredChats, setFilteredChats] = useState(null);

    useEffect(() => {
        fetchChatData();
    }, []);

    const fetchChatData = async () => {
        const ref = firebase.collection("595971602152").orderBy('createdDate')

        ref.onSnapshot(query => {
            let chats = []
            console.log("SNAOPSHOITTTT")
            query.forEach(doc => {
                chats.push(doc.data())
            })
            setAllChats(chats);
            setFilteredChats(chats);
        })
    };

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
    const chatComponents = allChats?.map(x => {
        i = i + 1;
        return <ProblematicChatComponent key={i} data={x} index={i} />;
    });

    console.log("allChats", allChats, chatComponents)
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
