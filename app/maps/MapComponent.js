import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import { Box, Container } from '@mui/material';
import { getDistance } from 'geolib';

const MapComponent = () => {
    const [center, setCenter] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [visibleUsers, setVisibleUsers] = useState([]);
    const mapRef = useRef(null);
    const maxDistance = 5000;

    const containerStyle = {
        width: "100%",
        height: "100%",
    };

    const users = [
        { name: "User 1", lat: 38.645160, lng: -90.245940 },
        { name: "User 2", lat: 38.641500, lng: -90.240500 },
        { name: "User 3", lat: 38.650800, lng: -90.252200 },
        { name: "User 4", lat: 38.638900, lng: -90.248300 },
        { name: "User 5", lat: 38.633200, lng: -90.241100 },
        { name: "User 6", lat: 38.652300, lng: -90.236500 },
        { name: "User 7", lat: 38.648100, lng: -90.258900 },
        { name: "User 8", lat: 38.630600, lng: -90.250400 },
        { name: "User 9", lat: 38.655200, lng: -90.230800 },
        { name: "User 10", lat: 38.635500, lng: -90.260200 }
    ];

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCenter({ lat: latitude, lng: longitude });
            },
            (error) => {
                console.error(error);
                setCenter({ lat: 38.627003, lng: -90.199402 }); // Default to Saint Louis if error
            }
        );
    }, []);

    // Include nearby users based on distance
    const updateVisibleUsers = () => {
        if (center) {
            const filteredUsers = users.filter((user) => {
                const distanceToUser = getDistance(
                    { latitude: center.lat, longitude: center.lng },
                    { latitude: user.lat, longitude: user.lng }
                );
                return distanceToUser <= maxDistance;
            });
            setVisibleUsers(filteredUsers);
        }
    };

    // On load, fit bounds to include nearby users
    const onMapLoad = (map) => {
        mapRef.current = map;
        updateVisibleUsers();
    };

    // Adjust on zoom-in/out
    const onZoomChanged = () => {
        if (mapRef.current) {
            const bounds = mapRef.current.getBounds();
            if (bounds) {
                const filteredUsers = users.filter((user) => {
                    const userLatLng = new window.google.maps.LatLng(user.lat, user.lng);
                    return bounds.contains(userLatLng);
                });
                setVisibleUsers(filteredUsers);
            }
        }
    };

    useEffect(() => {
        updateVisibleUsers();
    }, [center]);

    if (!center) return <div>loading...</div>;

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15} // initial zoom level
                onLoad={onMapLoad}
                onZoomChanged={onZoomChanged}
            >
                {/* Current user */}
                <Marker position={center} label="you" />
                {/* Other users */}
                {visibleUsers.map((user, index) => (
                    <Marker
                        key={index}
                        position={{ lat: user.lat, lng: user.lng }}
                        onMouseOver={() => setSelectedUser(user)}
                        onMouseOut={() => setSelectedUser(null)}
                    />
                ))}
                {/* Selected user */}
                {selectedUser && (
                    <InfoWindow
                        position={{ lat: selectedUser.lat, lng: selectedUser.lng }}
                        onCloseClick={() => setSelectedUser(null)}
                    >
                        <div>
                            <h4>{selectedUser.name}</h4>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>
    );
}

export default MapComponent;
