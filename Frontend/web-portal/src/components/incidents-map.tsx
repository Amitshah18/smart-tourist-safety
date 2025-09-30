

"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, HeatmapLayer } from '@react-google-maps/api';
import { IncidentSerializable } from '@/lib/incidents';
import { Loader2 } from 'lucide-react';

const libraries: "visualization"[] = ["visualization"];

export function parseLocation(location: string): { lat: number, lng: number } | null {
  const match = location.match(/Lat: ([-]?\d+\.\d+), Lon: ([-]?\d+\.\d+)/);
  if (match) {
    return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  }
  return null;
}

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem',
};

const defaultCenter = {
  lat: 40.416775,
  lng: -3.703790
};

type Coords = { lat: number, lng: number };
type IncidentWithCoords = IncidentSerializable & { coords: Coords };

interface IncidentsMapProps {
    incidents: IncidentSerializable[];
    showHeatmap: boolean;
    focusedLocation: IncidentWithCoords | null;
}

export default function IncidentsMap({ incidents, showHeatmap, focusedLocation }: IncidentsMapProps) {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries,
    });

    const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);

    const validIncidents: IncidentWithCoords[] = useMemo(() => incidents.map(incident => {
        const coords = parseLocation(incident.location);
        if (coords) {
            return { ...incident, coords };
        }
        return null;
    }).filter((i): i is IncidentWithCoords => i !== null), [incidents]);
    
    const heatmapData = useMemo(() => {
        if (!isLoaded) return [];
        return validIncidents.map(i => new google.maps.LatLng(i.coords.lat, i.coords.lng));
    }, [isLoaded, validIncidents]);

    const onLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    useEffect(() => {
        if (mapRef.current && validIncidents.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            validIncidents.forEach(({ coords }) => {
                bounds.extend(new window.google.maps.LatLng(coords.lat, coords.lng));
            });

            if (validIncidents.length === 1) {
                mapRef.current.setCenter(bounds.getCenter());
                mapRef.current.setZoom(14);
            } else {
                mapRef.current.fitBounds(bounds);
            }
        }
    }, [validIncidents]);
    
    useEffect(() => {
        if (mapRef.current && focusedLocation?.coords) {
            mapRef.current.panTo(focusedLocation.coords);
            mapRef.current.setZoom(15);
            setSelectedIncidentId(focusedLocation.id);
        }
    }, [focusedLocation]);


    const handleMarkerClick = (incidentId: string) => {
        setSelectedIncidentId(selectedIncidentId === incidentId ? null : incidentId);
    };

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (showHeatmap && e.latLng) {
            mapRef.current?.panTo(e.latLng);
            const currentZoom = mapRef.current?.getZoom() || 12;
            mapRef.current?.setZoom(currentZoom + 2);
        }
    }

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div className="h-full w-full flex items-center justify-center bg-muted"><Loader2 className="animate-spin" /></div>;
    }

    const selectedIncident = validIncidents.find(i => i.id === selectedIncidentId);

    return (
        <div className="h-64 md:h-96 w-full">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={10}
                onLoad={onLoad}
                onClick={handleMapClick}
                onDragStart={() => setSelectedIncidentId(null)}
            >
                {showHeatmap ? (
                    <HeatmapLayer data={heatmapData} />
                ) : (
                    <>
                     {validIncidents.map(incident => (
                        <Marker
                            key={incident.id}
                            position={incident.coords}
                            onClick={() => handleMarkerClick(incident.id)}
                        />
                     ))}
                     {selectedIncident && (
                        <InfoWindow 
                            position={selectedIncident.coords} 
                            onCloseClick={() => setSelectedIncidentId(null)}
                        >
                            <div>
                                <h3 className="font-semibold">{selectedIncident.type}</h3>
                                <p className="text-sm">{selectedIncident.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">{selectedIncident.timestamp}</p>
                            </div>
                        </InfoWindow>
                     )}
                    </>
                )}
            </GoogleMap>
        </div>
    );
}
