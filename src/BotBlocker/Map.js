import { faFloppyDisk, faRectangleXmark } from '@fortawesome/free-regular-svg-icons';
import { faCopy, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useJsApiLoader } from '@react-google-maps/api';
import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import CustomButton from '../Searchbar/CustomButton';

const API_KEY = 'AIzaSyAABDFNQWqSoqDeJBIAUCHfxInlTDtRp6A'; // Replace with your actual API key

const Map = ({ positionObj, clientNumber, locationChangeCallback }) => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const [position, setPosition] = useState(undefined);
    const [originalPosition, setOriginalPosition] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [noPos, setNoPos] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const isEditingRef = useRef(isEditing);
    const asuncionCenterPos = {lat: -25.285881866150206, lng: -57.57914900481195}

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: API_KEY,
        version: 'weekly',
        libraries: ['maps'],
    });

    // useEffect(() => {
    //     initializeMap(isLoaded)
    // }, [isLoaded]);

    useEffect(() => {
        setPosition(positionObj);
        setOriginalPosition(positionObj);
    }, [positionObj]);

    useEffect(() => {
        initializeMap(isLoaded, originalPosition);
    }, [isLoaded, originalPosition]);

    useEffect(() => {
        isEditingRef.current = isEditing;
    }, [isEditing]);

    const initializeMap = (isLoaded, originalPosition) => {
        console.log("initializeMap")
        if (isLoaded && mapRef.current) {
            console.log("initializeMap ifffffff", originalPosition)
            const mapInstance = new window.google.maps.Map(mapRef.current, {
                center: originalPosition?.lat ? originalPosition : asuncionCenterPos,
                zoom: 14,
                mapTypeControl: false,
                fullscreenControl: false,
                streetViewControl: false,
                zoomControl: true,
                scaleControl: true,
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

    const copyLocation = () => {
        navigator.clipboard.writeText(`${position.lat}, ${position.lng}`);
        toast.success("Ubicacion Copiada!", {
            style: {
                backgroundColor: '#4caf50',
                color: '#fff',
                fontWeight: 'bold',
            },
            progressStyle: {
                backgroundColor: '#fff',
            },
            autoClose: 1000
        });
    };

    const cancelEditing = () => {
        setIsEditing(false)
        setPosition(originalPosition)
        markerRef.current.setPosition(originalPosition);
    }

    const handleMapClick = (event, markerInstance) => {
        if (isEditingRef.current === false) { return;}

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
            
            <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                    <div style={{ ...coordinatesStyling, width: !isEditing ? '319px' : '429px' }}>
                        <p style={{ color: ColorHex.TextBody, ...CssProperties.BodyTextStyle, textAlign: 'center', whiteSpace: 'nowrap' }}>
                            {
                                !isEditing ?
                                    position?.lat ?
                                    `Coordenadas: ${position?.lat?.toString().substring(0, 9)}, ${position?.lng?.toString()?.substring(0, 9)}`
                                    :
                                    `Este cliente no tiene ubicacion`
                                :
                                `Haga clic en el mapa para establecer la ubicación...`
                            }
                        </p>
                    </div>
                    {
                        !isEditing ?
                        <>
                            <CustomButton text={'Copiar Ubicacion'} icon={faCopy} disabled={position?.lat == undefined} onClickCallback={copyLocation} />
                            <CustomButton text={'Editar Ubicacion'} icon={faPenToSquare} onClickCallback={handleEditMode} />
                        </>
                        :
                        <>
                            <CustomButton text={'Guardar'} classStyle="btnGreen" icon={faFloppyDisk} onClickCallback={() => { setIsEditing(false); locationChangeCallback(position) }}/>
                            <CustomButton text={'Cancelar'} classStyle="btnRed" icon={faRectangleXmark} onClickCallback={() => cancelEditing()}/>
                        </>
                    }
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
