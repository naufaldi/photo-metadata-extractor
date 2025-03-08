'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import useLeafletMarkerFix from '@/lib/useLeafletMarkerFix';

interface LocationMapProps {
  latitude: string;
  longitude: string;
  alwaysShow?: boolean;
}

const LocationMap = ({ latitude, longitude, alwaysShow = false }: LocationMapProps) => {
  const [showMap, setShowMap] = useState(alwaysShow);
  const [isClient, setIsClient] = useState(false);

  // Apply the Leaflet marker fix
  useLeafletMarkerFix();

  // Check if coordinates are valid
  const hasValidCoordinates = latitude !== 'Unknown' && longitude !== 'Unknown';
  const lat = hasValidCoordinates ? parseFloat(latitude) : 0;
  const lng = hasValidCoordinates ? parseFloat(longitude) : 0;

  // Handle client-side rendering for Next.js
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update showMap when alwaysShow prop changes
  useEffect(() => {
    if (alwaysShow) {
      setShowMap(true);
    }
  }, [alwaysShow]);

  if (!hasValidCoordinates) {
    return (
      <div className="mt-2 p-3 bg-gray-100 rounded-lg border-2 border-black text-center">
        <p className="text-gray-600">No location data available for this image</p>
      </div>
    );
  }

  return (
    <div className={alwaysShow ? 'h-full' : 'mt-4'}>
      {!alwaysShow && (
        <Button
          variant="outline"
          className="w-full mb-2 border-2 border-black flex items-center justify-center"
          onClick={() => setShowMap(!showMap)}
        >
          <MapPin className="mr-2 h-5 w-5" />
          {showMap ? 'Hide Map' : 'Show Location on Map'}
        </Button>
      )}

      {showMap && isClient && (
        <div className={`border-2 border-black rounded-lg overflow-hidden ${alwaysShow ? 'h-full' : 'h-[300px]'} shadow-[4px_4px_0px_0px_rgba(0,0,0)]`}>
          <MapContainer
            center={[lat, lng]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lng]}>
              <Popup>
                <div className="text-center">
                  <strong>Photo Location</strong><br />
                  Latitude: {latitude}<br />
                  Longitude: {longitude}
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default LocationMap; 