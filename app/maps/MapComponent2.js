import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, InfoWindow, useLoadScript, Marker } from '@react-google-maps/api';
import { Box, Button, Typography } from '@mui/material';
import { getDistance } from 'geolib';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const MapComponent2 = ({ searchTerm, defaultLocation }) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      });
    const effectRan = useRef(false);
    const [center, setCenter] = useState(defaultLocation);
    const [selectedUser, setSelectedUser] = useState(null);
    const [visibleUsers, setVisibleUsers] = useState([]);
    const { user: clerkUser } = useUser();
    const router = useRouter();
    const mapRef = useRef(null);
    const maxDistance = 50000; // 5 kilometers
    
    
    // Removed the Firestore query to fetch user location
    useEffect(() => {
        // if (effectRan.current === false) {
            console.log("center from parent class", center);
            if (center && searchTerm) {
                searchUsersByInterest(searchTerm);
            }
            effectRan.current = true;
        // }
    }, [searchTerm]);

    const searchUsersByInterest = async (interest) => {
        try {
            console.log("inside search by interest")
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('areaOfInterest', '==', interest));
            const querySnapshot = await getDocs(q);
            const users = [];
            querySnapshot.forEach((doc) => {
                const currentUser = `${clerkUser.username}_${clerkUser?.emailAddresses[0]?.emailAddress.replace(/[@.]/g, '_')}`
                const data = doc.data();
                if (data.lat && data.lng) {
                    const distanceToUser = getDistance(
                        { latitude: center.lat, longitude: center.lng },
                        { latitude: data.lat, longitude: data.lng }
                    );
                    if (distanceToUser <= maxDistance && currentUser != doc.id) {
                        users.push({ ...data, distance: distanceToUser });
                    }
                }
            });

            users.sort((a, b) => a.distance - b.distance);
            console.log("users found", users)
            setVisibleUsers(users.slice(0, 6));
            console.log("visible users", visibleUsers)
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const onMapLoad = (map) => {
        mapRef.current = map;
    };

    const onZoomChanged = () => {
        // if (mapRef.current) {
        //     const bounds = mapRef.current.getBounds();
        //     if (bounds) {
        //         const filteredUsers = visibleUsers.filter((user) => {
        //             const userLatLng = new window.google.maps.LatLng(user.lat, user.lng);
        //             return bounds.contains(userLatLng);
        //         });
        //         setVisibleUsers(filteredUsers);
        //     }
        // }
    };

    if (!center) return <div>Loading...</div>;
    if (!isLoaded) return <div>Hi Loading...</div>;
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
                    width: { xs: '100%', md: '70%' },
                    height: { xs: '50vh', md: '100%' },
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                    <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
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
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        fullWidth
                                        style={{ marginTop: '5px' }}
                                        onClick={() => alert(`Start chatting with ${selectedUser.fullName}`)}
                                    >
                                        Chat
                                    </Button>
                                </Box>
                            </InfoWindow>
                        )}
                    </GoogleMap>
            </Box>
            <Box
                sx={{
                    width: { xs: '100%', md: '30%' },
                    height: { xs: '50vh', md: '100%' },
                    overflowY: 'auto',
                    padding: '1rem',
                    boxSizing: 'border-box',
                    borderLeft: { md: '1px solid #ddd' },
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        marginBottom: '1rem',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}
                >Nearby Users</Typography>
                {visibleUsers.map((user, index) => (
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
                        }}
                    >
                        <Typography variant="h6">{user.fullName}</Typography>
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
                                console.log("from main page:" ,user.email,user.username )
                                router.push(`../profile?email=${encodeURIComponent(user.email)}&username=${encodeURIComponent(user.username)}`);
                            }}
                        >
                            Chat
                        </Button>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default MapComponent2;
