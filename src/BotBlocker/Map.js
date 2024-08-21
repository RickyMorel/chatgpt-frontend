import React, { useEffect, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import Modal from 'react-modal';
import { PopupStyle } from '../Popups/PopupManager';
import axios from 'axios';

const API_KEY = 'AIzaSyAABDFNQWqSoqDeJBIAUCHfxInlTDtRp6A'; // Replace with your actual API key

const Map = ({ modalIsOpen, clientNumber, closeCallback }) => {
    const mapRef = useRef(null);
    const [position, setPosition] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [noPos, setNoPos] = useState(false);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: API_KEY,
        version: 'weekly',
        libraries: ['maps'],
    });

    useEffect(() => {
        const fetchClientLocation = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/client-location/getLocationByNumber?phoneNumber=${clientNumber}`);
                const positionObj = { lat: response.data.location.lat, lng: response.data.location.lng };
                setPosition(positionObj);
            } catch (error) {
                console.log("Error fetching location:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClientLocation();
    }, [clientNumber]);

    useEffect(() => {
        if (isLoaded && mapRef.current) {
            const map = new window.google.maps.Map(mapRef.current, {
                center: { lat: position.lat, lng: position.lng },
                zoom: 14,
            });

            new window.google.maps.Marker({
                position: { lat: position.lat, lng: position.lng },
                map: map,
                title: 'Hello World!',
            });
        }
    }, [isLoaded, modalIsOpen, position]); // Ensure map is initialized when modal is open

    return (
        <Modal isOpen={modalIsOpen} onRequestClose={closeCallback} style={PopupStyle.Medium}>
            <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
        </Modal>
    );
};

export default Map;
