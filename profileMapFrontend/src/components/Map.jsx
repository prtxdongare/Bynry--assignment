import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default function Map({ selectedProfile }) {
  const mapContainer = useRef(null); // Reference to the map container div
  const mapInstance = useRef(null);  // Reference to the Leaflet map instance
  const markerRef = useRef(null);    // Reference to the marker

  // Initialize the Leaflet map when the component mounts
  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map instance if it's not already initialized
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapContainer.current).setView([51.505, -0.09], 13); // Default to London

      // Set up tile layer (similar to Mapbox style)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);
    }
  }, []);

  // Re-center the map and add marker when the selected profile changes
  useEffect(() => {
    if (!mapInstance.current || !selectedProfile) return;

    const geocode = async () => {
      try {
        // Use OpenStreetMap Nominatim API to geocode the address into coordinates
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            selectedProfile.address
          )}&format=json`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const { lat, lon } = data[0]; // Get the latitude and longitude

          // Fly to the new location on the map
          mapInstance.current.flyTo([lat, lon], 14);

          // If there's an existing marker, remove it
          if (markerRef.current) {
            markerRef.current.remove();
          }

          // Add a new marker at the geocoded location
          markerRef.current = L.marker([lat, lon])
            .addTo(mapInstance.current)
            .bindPopup(`<b>${selectedProfile.name}</b><br>${selectedProfile.address}`)
            .openPopup();
        }
      } catch (error) {
        console.error('Error geocoding address:', error);
      }
    };

    geocode();
  }, [selectedProfile]);

  return <div ref={mapContainer} className="h-96 rounded-lg shadow-lg" />;
}
