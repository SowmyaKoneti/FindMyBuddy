import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import { Box, Container, Button, Typography } from '@mui/material';
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
        { name: "User 1", lat: 38.645160, lng: -90.245940, lookingFor: "Looking for mentorship in machine learning", rating: 4.5 },
        { name: "User 2", lat: 38.641500, lng: -90.240500, lookingFor: "Seeking collaboration on open-source projects", rating: 3.8 },
        { name: "User 3", lat: 38.650800, lng: -90.252200, lookingFor: "Interested in learning more about cloud computing", rating: 4.2 },
        { name: "User 4", lat: 38.638900, lng: -90.248300, lookingFor: "Looking for advice on data analysis techniques", rating: 4.0 },
        { name: "User 5", lat: 38.633200, lng: -90.241100, lookingFor: "Seeking help with software architecture design", rating: 4.1 },
        { name: "User 6", lat: 38.652300, lng: -90.236500, lookingFor: "Interested in career guidance in software engineering", rating: 3.9 },
        { name: "User 7", lat: 38.648100, lng: -90.258900, lookingFor: "Looking for networking opportunities in tech", rating: 4.3 },
        { name: "User 8", lat: 38.630600, lng: -90.250400, lookingFor: "Seeking support with web development challenges", rating: 3.7 },
        { name: "User 9", lat: 38.655200, lng: -90.230800, lookingFor: "Interested in AI research collaborations", rating: 4.4 },
        { name: "User 10", lat: 38.635500, lng: -90.260200, lookingFor: "Looking for partners in software startups", rating: 4.6 }
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
                    // Check if lat and lng are valid numbers and within valid range
                    const isValidLat = typeof user.lat === 'number' && user.lat >= -90 && user.lat <= 90;
                    const isValidLng = typeof user.lng === 'number' && user.lng >= -180 && user.lng <= 180;

                    if (isValidLat && isValidLng) {
                        const userLatLng = new window.google.maps.LatLng(user.lat, user.lng);
                        return bounds.contains(userLatLng);
                    }

                    return false; // Exclude users with invalid lat/lng
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
        <Box
            sx={{
                display: 'flex',
                height: '100vh',
                flexDirection: { xs: 'column', md: 'row' }, // Stack on mobile, side-by-side on larger screens
            }}
        >
            <Box
                sx={{
                    width: { xs: '100%', md: '70%' },
                    height: { xs: '50vh', md: '100%' },
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={15}
                        onLoad={onMapLoad}
                        onZoomChanged={onZoomChanged}
                    >
                        <Marker position={center} label="you" />
                        {visibleUsers.map((user, index) => (
                            <Marker
                                key={index}
                                position={{ lat: user.lat, lng: user.lng }}
                                icon={
                                    user.lat === center.lat && user.lng === center.lng
                                        ? undefined
                                        : { url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }
                                }
                                onMouseOver={() => setSelectedUser(user)}
                            />
                        ))}
                        {selectedUser && (
                            <InfoWindow
                                position={{ lat: selectedUser.lat, lng: selectedUser.lng }}
                                onCloseClick={() => setSelectedUser(null)}
                                options={{
                                    pixelOffset: new window.google.maps.Size(0, -30),
                                    disableAutoPan: true,
                                }}
                            >
                                <Box
                                    style={{
                                        textAlign: 'center',
                                        padding: '5px',
                                        width: '150px',
                                        borderRadius: '8px',
                                        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                                        backgroundColor: '#fff',
                                    }}
                                >
                                    <Typography variant="subtitle2" gutterBottom>
                                        {selectedUser.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Rating: {selectedUser.rating}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        fullWidth
                                        style={{ marginTop: '5px' }}
                                        onClick={() => alert(`Start chatting with ${selectedUser.name}`)}
                                    >
                                        Chat
                                    </Button>
                                </Box>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </LoadScript>
            </Box>
            <Box
                sx={{
                    width: { xs: '100%', md: '30%' },
                    height: { xs: '50vh', md: '100%' },
                    overflowY: 'auto',
                    padding: '1rem',
                    boxSizing: 'border-box',
                    borderLeft: { md: '1px solid #ddd' }, // Border between map and user list
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        marginBottom: '1rem',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}
                >Nearby Users Looking For</Typography>
                {/* Scrollable User List */}
                {users.map((user, index) => (
                    <Box
                        key={index}
                        sx={{
                            padding: '1rem',
                            marginBottom: '1rem',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#fff',
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            setSelectedUser(user);
                            if (mapRef.current) {
                                mapRef.current.panTo(new window.google.maps.LatLng(user.lat, user.lng)); // Center the map on the selected user
                                mapRef.current.setZoom(15); // Optional: Adjust zoom level
                            }
                        }} // Set selected user and pan the map
                    >
                        <Typography variant="h6">{user.name}</Typography>
                        {/* Add additional user details here if needed */}
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            {user.lookingFor}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            width="20px"
                            style={{ marginTop: '5px' }}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent click event from triggering on parent Box
                                alert(`Start chatting with ${user.name}`);
                            }}
                        >
                            Chat
                        </Button>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
export default MapComponent;
