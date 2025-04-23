'use client';

import { useEffect, useState, useCallback } from 'react';

// Extend the Window interface to include the google property
declare global {
  interface Window {
    google: typeof google;
  }
}
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { GoogleMap, Marker, LoadScript, InfoWindow } from '@react-google-maps/api';
import LoadingSpinner from './ui/loading-spinner';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY1,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN1,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL1,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID1,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET1,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID1,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID1,
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

interface BusLocation {
  lat: number;
  lng: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const TrackBus = () => {
  const [busLocation, setBusLocation] = useState<BusLocation>({ lat: 0, lng: 0 });
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  // Memoize the callback to prevent unnecessary re-renders
  const handleLocationUpdate = useCallback((snapshot: any) => {
    const data = snapshot.val();
    if (data) {
      setBusLocation({ 
        lat: parseFloat(data.latitude), 
        lng: parseFloat(data.longitude) 
      });
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const busLocationRef = ref(db, 'busLocation');
    const unsubscribe = onValue(busLocationRef, handleLocationUpdate);

    return () => {
      unsubscribe();
    };
  }, [handleLocationUpdate]);

  const toggleInfoWindow = useCallback(() => {
    setShowInfo(prev => !prev);
  }, []);

  const closeInfoWindow = useCallback(() => {
    setShowInfo(false);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <LoadingSpinner className="w-12 h-12 mb-4" />
        <p className="text-gray-600">Loading Bus Location...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        <span className="text-blue-600">Bus</span>
        <span className="text-green-600">Buddy</span>
        <span className="text-gray-700 flex items-center justify-center gap-2 text-lg mt-2">
          Track Your Bus
          <img
            src="https://cdn-icons-png.flaticon.com/128/6544/6544041.png"
            alt="Location Icon"
            className="w-6 h-6"
            loading="lazy"
          />
        </span>
      </h1>

      <div className="rounded-lg overflow-hidden shadow-lg">
        <LoadScript 
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
          loadingElement={<div className="h-96 bg-gray-200 animate-pulse" />}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={busLocation}
            zoom={15}
            onClick={closeInfoWindow}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            <Marker
              position={busLocation}
              onClick={toggleInfoWindow}
              icon={{
                url: 'https://cdn-icons-png.flaticon.com/128/3448/3448339.png',
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
            {showInfo && (
              <InfoWindow position={busLocation} onCloseClick={closeInfoWindow}>
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-1">Bus Location</h3>
                  <p className="text-sm">Latitude: {busLocation.lat.toFixed(6)}</p>
                  <p className="text-sm">Longitude: {busLocation.lng.toFixed(6)}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${busLocation.lat},${busLocation.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium block mt-1"
                  >
                    View on Google Maps
                  </a>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default TrackBus;