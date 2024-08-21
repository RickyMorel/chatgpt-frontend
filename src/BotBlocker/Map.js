import React, { useEffect, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import Modal from 'react-modal';
import { PopupStyle } from '../Popups/PopupManager';
import axios from 'axios';
import { Color } from '../Colors';

const API_KEY = 'AIzaSyAABDFNQWqSoqDeJBIAUCHfxInlTDtRp6A'; // Replace with your actual API key

const Map = ({ modalIsOpen, clientNumber, closeCallback }) => {
    const mapRef = useRef(null);
    const [position, setPosition] = useState(undefined);
    const [originalPosition, setOriginalPosition] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [noPos, setNoPos] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

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
                setOriginalPosition(positionObj);
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
            const mapInstance = new window.google.maps.Map(mapRef.current, {
                center: originalPosition,
                zoom: 14,
            });

            const markerInstance = new window.google.maps.Marker({
                position,
                map: mapInstance,
                title: 'Client Location',
            });


            mapInstance.addListener('click', (event) => {
                const newPosition = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                };
                setPosition(newPosition);
                markerInstance.setPosition(newPosition);
            });
        }
    }, [isLoaded, modalIsOpen, originalPosition]); // Ensure map is initialized when modal is open

    const handleEditMode = () => {
        setIsEditing(!isEditing)
    }
    
    const updateLocation = async () => {
        const locationObj = {
            phoneNumber: clientNumber,
            location: position,
            locationPicture: "",
            locationDescription: ""
        }
        const response = await axios.put(`${process.env.REACT_APP_HOST_URL}/client-location/updateClientLocation`, locationObj);
    }

    return (
        <Modal isOpen={modalIsOpen} onRequestClose={closeCallback} style={PopupStyle.Medium}>
            <button className={`waves-effect waves-light btn-small ${isEditing ? Color.Button_1 : Color.Second}`} onClick={() => handleEditMode(clientNumber)}>
                <i className="material-icons">{isEditing ? "save" : "edit"}</i>
            </button>
            <div ref={mapRef} style={{ height: '90%', width: '90%' }} />
        </Modal>
    );
};

export default Map;
