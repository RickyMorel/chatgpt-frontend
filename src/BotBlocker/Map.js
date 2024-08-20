import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import Modal from 'react-modal';
import { PopupStyle } from '../Popups/PopupManager';
import axios from 'axios';

const Map = ({ modalIsOpen, clientNumber, closeCallback }) => {
    const [position, setPosition] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [mapReady, setMapReady] = useState(false);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyAABDFNQWqSoqDeJBIAUCHfxInlTDtRp6A",
    });

    const onLoadMap = (mapInstance) => {
        console.log("Map loaded:", mapInstance);
        setMapReady(true);
    };

    useEffect(() => {
        const fetchClientLocation = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/client-location/getLocationByNumber?phoneNumber=${clientNumber}`);
                console.log("response", response)

                if (!response.data.location ) {
                    setLoading(true);
                }
                else{
                    const positionObj = { lat: response.data.location.lat, lng: response.data.location.lng };
                    console.log("Position fetched:", positionObj);
                    setPosition(positionObj);
                }
            } catch (error) {
                console.log("Error fetching location:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClientLocation();
    }, [clientNumber]);

    // Check if both map and position are ready
    useEffect(() => {
        if (mapReady && position) {
            console.log("Map is ready and position is set, should render marker now.");
        }
    }, [mapReady, position]);

    if (loading) return <Modal isOpen={modalIsOpen} onRequestClose={closeCallback} style={PopupStyle.Medium}><div>Cargando...</div></Modal>;
    if (!isLoaded) return <Modal isOpen={modalIsOpen} onRequestClose={closeCallback} style={PopupStyle.Medium}><div>Cargando mapa...</div></Modal>;
    if (!position) return <Modal isOpen={modalIsOpen} onRequestClose={closeCallback} style={PopupStyle.Medium}><div>Ubicacion no existe</div></Modal>;

    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeCallback}
            style={PopupStyle.Medium}
        >
            <GoogleMap
                mapContainerStyle={{ height: "100%", width: "100%" }}
                zoom={14}
                center={position}
                onLoad={onLoadMap}
            >
                {mapReady && position && (
                    <Marker position={position} />
                )}
            </GoogleMap>
        </Modal>
    );
};

export default Map;
