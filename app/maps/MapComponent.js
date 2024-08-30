import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Box, Container } from '@mui/material';
const MapComponent = () => {
    const [center, setCenter] = useState(null);

    const containerStyle = {
        width: "100%",
        height: "100%",
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCenter({ lat: latitude, lng: longitude });
            },
            (error) => {
                console.error(error)
                setCenter({ lat: 48.668221, lng: -90.322227 });
            }
        );
    }, []);
    if (!center) return <div>loading...</div>
    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <GoogleMap mapContainerStyle={containerStyle}
                center={center}
                zoom={10}>
                <Marker position={center} />
            </GoogleMap>
        </LoadScript>
    )
}
export default MapComponent;