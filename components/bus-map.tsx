'use client';

import { useEffect, useState, useCallback } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { GoogleMap, Marker, LoadScript, InfoWindow } from '@react-google-maps/api';
import LoadingSpinner from './ui/loading-spinner';

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Types
interface BusLocation {
  lat: number;
  lng: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

// 🗺️ Default location
const defaultLocation: BusLocation = {
  lat: 19.900324396566308,
  lng: 74.49484449390961,
};

const TrackBus = () => {
  const [busLocation, setBusLocation] = useState<BusLocation>(defaultLocation);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleLocationUpdate = useCallback((docSnap: any) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data?.lat && data?.lng) {
        setBusLocation({
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lng),
        });
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    try {
      const docRef = doc(db, 'busLocation', 'current');
      const unsubscribe = onSnapshot(docRef, handleLocationUpdate, (error) => {
        console.error("Error fetching bus location:", error);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up Firebase listener:", error);
      setLoading(false);
    }
  }, [handleLocationUpdate]);

  const toggleInfoWindow = useCallback(() => {
    setShowInfo((prev) => !prev);
  }, []);

  const closeInfoWindow = useCallback(() => {
    setShowInfo(false);
  }, []);

  const handleMapLoad = useCallback(() => {
    setMapLoaded(true);
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
        <span className="text-primary">Bus</span>
        <span className="text-secondary">Buddy</span>
        <span className="text-gray-700 flex items-center justify-center gap-2 text-lg mt-2">
          Track Your Bus
          <img
            src="https://cdn-icons-png.flaticon.com/128/6544/6544041.png"
            alt="Location Icon"
            className="w-6 h-6"
          />
        </span>
      </h1>

      <div className="rounded-lg overflow-hidden shadow-lg">
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
          loadingElement={<div className="h-96 bg-gray-200 animate-pulse" />}
          onLoad={handleMapLoad}
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
            onLoad={handleMapLoad}
          >
            {mapLoaded && (
              <Marker
                position={busLocation}
                onClick={toggleInfoWindow}
                icon={{
                  url: 'https://cdn-icons-png.flaticon.com/128/3448/3448339.png',
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
            )}
            {showInfo && mapLoaded && (
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