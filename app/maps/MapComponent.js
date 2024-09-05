import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import { Box, Button, Typography } from '@mui/material';
import { getDistance } from 'geolib';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

// API key for Google Maps Geocoding
const GEOCODING_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const MapComponent = () => {
    const [center, setCenter] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [visibleUsers, setVisibleUsers] = useState([]);
    const [users, setUsers] = useState([]); // State to hold users fetched from API
    const mapRef = useRef(null);
    const maxDistance = 5000;
    const router = useRouter();

    const containerStyle = {
        width: "100%",
        height: "100%",
    };

    // Fetch Users from API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/user-details'); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();

                // Geocode Address and Location to Lat/Lng
                const usersWithLatLng = await Promise.all(data.map(async user => {
                    const fullAddress = `${user.address}, ${user.location}`;
                    const latLng = await getLatLngFromAddress(fullAddress);
                    return { ...user, ...latLng };
                }));

                setUsers(usersWithLatLng);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    // Function to Geocode Address to Lat/Lng
    const getLatLngFromAddress = async (address) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GEOCODING_API_KEY}`
            );
            const data = await response.json();
            if (data.status === 'OK' && data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry.location;
                return { lat, lng };
            } else {
                console.error('Failed to get lat/lng for address:', address);
                return { lat: null, lng: null };
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            return { lat: null, lng: null };
        }
    };

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
                if (user.lat && user.lng) {
                    const distanceToUser = getDistance(
                        { latitude: center.lat, longitude: center.lng },
                        { latitude: user.lat, longitude: user.lng }
                    );
                    return distanceToUser <= maxDistance;
                }
                return false;
            });
            setVisibleUsers(filteredUsers);
        }
    };

    useEffect(() => {
        updateVisibleUsers();
    }, [center, users]);

    const onMapLoad = (map) => {
        mapRef.current = map;
        updateVisibleUsers();
    };

    const onZoomChanged = () => {
        if (mapRef.current) {
            const bounds = mapRef.current.getBounds();
            if (bounds) {
                const filteredUsers = users.filter((user) => {
                    if (user.lat && user.lng) {
                        const userLatLng = new window.google.maps.LatLng(user.lat, user.lng);
                        return bounds.contains(userLatLng);
                    }
                    return false;
                });
                setVisibleUsers(filteredUsers);
            }
        }
    };

    const handleNavigation = (url) => {
        if (url) {
          window.open(url, '_blank');
        }
    };

    if (!center) return <div>Loading...</div>;

    return (
        <Box
        sx={{
            display: 'flex',
            height: '100vh',
            flexDirection: { xs: 'column', md: 'row' },
        }}
    >
            <Box
                sx={{
                width: { xs: '100%', md: '75%' },  
                height: { xs: '50vh', md: '100%' },  
                display: 'flex',
                flexDirection: 'column',
                }}
            >
                {/* <LoadScript googleMapsApiKey={GEOCODING_API_KEY}> */}
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={15}
                    onLoad={onMapLoad}
                    onZoomChanged={onZoomChanged}
                >
                    <Marker position={center} label="You" />
                    {visibleUsers.map((user, index) => (
                        <Marker
                            key={index}
                            position={{ lat: user.lat, lng: user.lng }}
                            icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
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
                                    {selectedUser.fullName}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Rating: {selectedUser.rating}
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{
                                        background: 'linear-gradient(to right, #4f758f, #449fdb)', 
                                        color: '#FFFFFF',  
                                        width: 'auto',     
                                        padding: '5 10px', 
                                        marginTop: '5px',  
                                        boxShadow: 'none', 
                                        '&:hover': {
                                        background: 'linear-gradient(to right, #3b5f7a, #4a86aa)', // Slightly darker gradient on hover
                                        },
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent click event from triggering on parent Box
                                        console.log("from main page:" ,selectedUser.email,selectedUser.username )
                                        router.push(`../profile?email=${encodeURIComponent(selectedUser.email)}&username=${encodeURIComponent(selectedUser.username)}`);
                                    }}
                                    >
                                    Chat
                                </Button>
                            </Box>
                        </InfoWindow>
                    )}
                </GoogleMap>
                {/* </LoadScript> */}
            </Box>
            <Box
                sx={{
                width: { xs: '100%', md: '25%' },  // Full width on small screens, 20% on medium+
                height: { xs: '50vh', md: '100%' },  // 50% height on small screens, full height on medium+
                overflowY: 'auto',  // Allows scrolling if content overflows
                padding: '0.5rem',
                boxSizing: 'border-box',
                borderLeft: { md: '1px solid #ddd' },  // Border on left side on medium+ screens
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        marginBottom: '0.2rem',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}
                >AI Suggested Nearby Users</Typography>
                {users.map((user, index) => (
                    <Box
                        key={index}
                        sx={{
                            padding: '1rem',
                            marginBottom: '1rem',
                            border: '1px solid #ddd',
                            borderRadius: '0px',
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
                        }}
                    >
                        <Typography variant="h6">{user.fullName}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        {user?.linkedIn && (
                            <LinkedInIcon sx={{ color: '#0077b5', cursor: 'pointer' }} onClick={() => handleNavigation(user.linkedIn)} />
                        )}
                        {user?.github && (
                            <GitHubIcon sx={{ color: '#333333', cursor: 'pointer' }} onClick={() => handleNavigation(user.github)} />
                        )}
                        {user?.twitter && (
                            <TwitterIcon sx={{ color: '#1DA1F2', cursor: 'pointer' }} onClick={() => handleNavigation(user.twitter)} />
                        )}
                        {user?.instagram && (
                            <InstagramIcon sx={{ color: '#E1306C', cursor: 'pointer' }} onClick={() => handleNavigation(user.instagram)} />
                        )}
                        </Box>    
                        {user?.areaOfInterest && (
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                Area of Interest: {user.areaOfInterest}
                            </Typography>
                        )}
                        {user?.lookingFor && (
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                Looking For: {user.lookingFor}
                            </Typography>
                        )}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            width: '100%',
                        }}>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{
                                background: 'linear-gradient(to right, #4f758f, #449fdb)', 
                                color: '#FFFFFF',  
                                width: 'auto',     
                                padding: '5 10px', 
                                marginTop: '5px',  
                                boxShadow: 'none', 
                                '&:hover': {
                                background: 'linear-gradient(to right, #3b5f7a, #4a86aa)', // Slightly darker gradient on hover
                                },
                            }}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent click event from triggering on parent Box
                                console.log("from main page:", user.email, user.username);
                                router.push(`../profile?email=${encodeURIComponent(user.email)}&username=${encodeURIComponent(user.username)}`);
                            }}
                            >
                            Chat
                        </Button>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default MapComponent;
