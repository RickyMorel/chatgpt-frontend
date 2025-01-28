import React, { useEffect, useState } from 'react';
import { Color, ColorHex } from '../Colors';
import { firestore } from '../firebaseConfig';
import ProblematicChatComponent from './ProblematicChatComponent';
import CssProperties from '../CssProperties';
import SearchBar from '../Searchbar/Searchbar';
import PaginatedScrollView from '../BotBlocker/PaginatedScrollView';

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

    const handleSearchInputChange = (value) => {
        const input = value;
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
        <div>
            <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>Atención Especial</p>

            <div style={orderPanelStyling}>
                <div className='row'>
                    <div className="col-10">
                        <SearchBar width='100%' height='45px' itemList={allChats} searchText="Buscar Clientes..." OnSearchCallback={handleSearchInputChange}/>
                    </div>
                </div>
                <div style={{ alignItems: 'center', width: '100%', marginTop: '25px'}}>
                    <div style={{ alignItems: 'center', height: '45px', width: '98%', display: 'flex'}}>
                        <div style={headerStyle} className='col-1'></div>
                        <div style={headerStyle} className='col-2'>Nombre del Cliente</div>
                        <div style={headerStyle} className='col-5'>Descripcion</div>
                        <div style={headerStyle} className='col-1'>Tiempo</div>
                        <div style={headerStyle} className='col-2'>Numero</div>
                        <div style={headerStyle} className='col-1'></div>
                    </div>

                    <div style={scrollStyle}>
                        {chatComponents}
                    </div>
                </div>
            </div>
        </div>
    );
};

            // <div className={`card bordered ${Color.Background}`}>
            //     <div className="card-content">
            //         <input
            //             type="text"
            //             placeholder="Buscar clientes..."
            //             value={searchInput}
            //             onChange={handleSearchInputChange}
            //         />
            //         <div style={{ overflowY: 'scroll', height: '63vh', overflowX: "hidden" }}>
            //             {chatComponents}
            //         </div>
            //     </div>
            // </div>

const headerStyle = {
    textAlign: 'center',
    color: ColorHex.TextBody,
    ...CssProperties.BodyTextStyle
}

const scrollStyle = {
    borderRadius: '10px',
    backgroundColor: ColorHex.Background,
    padding: '10px',
    boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.3)',
    overflowY: 'scroll', 
    height: '55vh',
    width: '100%',
    alignItems: 'center'
}

const orderPanelStyling = {
    width: '100%',
    height: '75vh',
    marginTop: '10px',
    marginTop: '25px',
    padding: '25px',
    boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
    border: `1px solid ${ColorHex.BorderColor}`,
    borderRadius: '10px',
    backgroundColor: ColorHex.White
  }

export default ProblematicChatsScreen;
