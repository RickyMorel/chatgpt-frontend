import React, { useEffect, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import Modal from 'react-modal';
import { PopupStyle } from '../Popups/PopupManager';
import axios from 'axios';
import { Color } from '../Colors';

const API_KEY = 'AIzaSyAABDFNQWqSoqDeJBIAUCHfxInlTDtRp6A'; // Replace with your actual API key

const Map = ({ positionObj, clientNumber }) => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const [position, setPosition] = useState(undefined);
    const [originalPosition, setOriginalPosition] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [noPos, setNoPos] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const isEditingRef = useRef(isEditing);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: API_KEY,
        version: 'weekly',
        libraries: ['maps'],
    });

    useEffect(() => {
        setPosition(positionObj);
        setOriginalPosition(positionObj);
        setIsEditing(false)
    }, [positionObj]);
    useEffect(() => { initializeMap(isLoaded, mapRef, originalPosition, position, setPosition);}, [isLoaded, originalPosition]);
    useEffect(() => { isEditingRef.current = isEditing;}, [isEditing]);

    const initializeMap = (isLoaded, mapRef, originalPosition, position, setPosition) => {
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

            markerRef.current = markerInstance
    
            mapInstance.addListener('click', (e) => handleMapClick(e, markerInstance));
        }
    }

    const handleMapClick = (event, markerInstance) => {
        if(isEditingRef.current == false) { return; }
                
        const newPosition = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };
        setPosition(newPosition);
        markerInstance.setPosition(newPosition);
    }

    const handleEditMode = () => {
        const newIsEditing = !isEditing
        setIsEditing(newIsEditing)

        if(newIsEditing == false) {
            updateLocation()
        }
    }

    const handleEditLocation = (e) => {
        if(e.target.value.includes(',') == false) { return; }

        // const positions = e.target.value.split(',')
        // const newPosition = {lat: positions[0].trim(), lng: positions[1].trim()}

        // console.log("positions", positions)
        // console.log("newPosition", newPosition)

        // setPosition({lat: newPosition.lat, lng: newPosition.lng});
    }
    
    const updateLocation = async () => {
        const locationObj = {
            phoneNumber: clientNumber,
            location: {lat: +position.lat, lng: +position.lng},
            locationPicture: "",
            locationDescription: ""
        }
        const response = await axios.put(`${process.env.REACT_APP_HOST_URL}/client-location/updateClientLocation`, locationObj);
    }

    return (
            <div ref={mapRef} style={{ height: '100%', width: '100%' }}>
                <div className="row">
                    <div className="col s10">
                        <input style={{display: 'block' }} name='location' onChange={(e) => handleEditLocation(e)}/>
                    </div>
                    <div className="col s2">
                        <button className={`waves-effect waves-light btn-small ${isEditing ? Color.Button_1 : Color.Second}`} onClick={() => handleEditMode(clientNumber)}>
                            <i className="material-icons">{isEditing ? "save" : "edit"}</i>
                        </button>
                    </div>
                </div>
            </div>
    );
};

export default Map;

