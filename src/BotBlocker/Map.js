import React, { useEffect, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import Modal from 'react-modal';
import { PopupStyle } from '../Popups/PopupManager';
import axios from 'axios';
import { Color, ColorHex } from '../Colors';
import CustomButton from '../Searchbar/CustomButton';
import { faCopy, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import CssProperties from '../CssProperties';

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
        setIsEditing(false);
    }, [positionObj]);

    useEffect(() => {
        initializeMap(isLoaded, mapRef, originalPosition, position, setPosition);
    }, [isLoaded, originalPosition]);

    useEffect(() => {
        isEditingRef.current = isEditing;
    }, [isEditing]);

    const initializeMap = (isLoaded, mapRef, originalPosition, position, setPosition) => {
        if (isLoaded && mapRef.current) {
            const mapInstance = new window.google.maps.Map(mapRef.current, {
                center: originalPosition,
                zoom: 14,
                // Disable the Map and Satellite buttons
                mapTypeControl: false, 
                fullscreenControl: false, // Hides the fullscreen control
                streetViewControl: false, // Hides Street View Pegman
                zoomControl: true, // Keep the zoom controls (set to false to hide)
                scaleControl: true, // Keep scale control (can be disabled if needed)
            });

            const markerInstance = new window.google.maps.Marker({
                position,
                map: mapInstance,
                title: 'Client Location',
            });

            markerRef.current = markerInstance;

            mapInstance.addListener('click', (e) => handleMapClick(e, markerInstance));
        }
    };

    const copyLocation= () => {
        navigator.clipboard.writeText(`${position.lat}, ${position.lng}`);
    }

    const handleMapClick = (event, markerInstance) => {
        if (isEditingRef.current === false) {
            return;
        }

        const newPosition = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };
        setPosition(newPosition);
        markerInstance.setPosition(newPosition);
    };

    const handleEditMode = () => {
        const newIsEditing = !isEditing;
        setIsEditing(newIsEditing);

        if (newIsEditing === false) {
            // updateLocation()
        }
    };

    const handleEditLocation = () => {
        if (!isEditing) {
            return;
        }
    };

    return (
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
            <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
            
            {/* Button Container */}
            <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                    <div style={{ ...coordinatesStyling }}>
                        <p style={{ color: ColorHex.TextBody, ...CssProperties.BodyTextStyle, textAlign: 'center' }}>
                            {`Coordenadas: ${position?.lat?.toString().substring(0, 9)}, ${position?.lng?.toString()?.substring(0, 9)}`}
                        </p>
                    </div>
                    <CustomButton text={'Copiar Ubicacion'} icon={faCopy} onClickCallback={copyLocation} />
                    <CustomButton text={'Editar Ubicacion'} icon={faPenToSquare} onClickCallback={handleEditMode} />
                </div>
            </div>
        </div>
    );
};

const coordinatesStyling = {
    backgroundColor: ColorHex.White,
    color: ColorHex.TextBody,
    width: '319px',
    height: '45px',
    borderRadius: '10px',
    boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
    border: `1px solid ${ColorHex.BorderColor}`,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '15px',
    paddingLeft: '15px',
    paddingRight: '15px',
    textAlign: 'center',
    outline: 'none',
  };

export default Map;
