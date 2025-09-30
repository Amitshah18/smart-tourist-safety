
"use client";

import { useState, useEffect, useContext, useRef, useMemo, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Info, Loader2, MapPin, ShieldAlert, ShieldCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { suggestRiskScoreExplanation, SuggestRiskScoreExplanationOutput } from '@/ai/flows/suggest-risk-score-explanation';
import { summarizeIncidentReports, SummarizeIncidentReportsOutput } from "@/ai/flows/summarize-incident-reports";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from '@/hooks/use-toast';
import { getDistance } from 'geolib';
import { cn } from "@/lib/utils";
import { TrackingContext } from '@/context/tracking-provider';
import { GoogleMap, useJsApiLoader, Circle, MarkerF } from '@react-google-maps/api';

// Mock Data organized by city
const cityData = {
  "Madrid": {
    coords: { latitude: 40.416775, longitude: -3.703790 },
    zones: [
      { id: 1, name: "Historic Center", riskScore: 2.1, riskLevel: 'Low', incidentHistory: "1 minor theft in the last 72 hours.", locationDetails: "High foot traffic, well-lit, regular police patrols.", coords: { latitude: 40.415, longitude: -3.707 }, radius: 800, places: ["Plaza Mayor", "Royal Palace", "Mercado San Miguel"] },
      { id: 2, name: "North Station District", riskScore: 6.8, riskLevel: 'Medium', incidentHistory: "Reports of pickpocketing, especially in the evenings. One reported harassment case last week.", locationDetails: "Crowded public transport hub, less lit at night.", coords: { latitude: 40.428, longitude: -3.703 }, radius: 1000, places: ["Principe Pio Station", "Temple of Debod", "Plaza de España"] },
      { id: 3, name: "Riverside Industrial Park", riskScore: 8.5, riskLevel: 'High', incidentHistory: "Several break-ins reported after dark. Area is known for illicit activities.", locationDetails: "Sparsely populated, poor lighting, no regular security presence.", coords: { latitude: 40.39, longitude: -3.72 }, radius: 1200, places: ["Old Factory Complex", "Warehouse District"] },
      { id: 4, name: "Greenfield Park", riskScore: 1.5, riskLevel: 'Low', incidentHistory: "No incidents reported in the last month.", locationDetails: "Family-friendly park, closes at sunset, well-maintained.", coords: { latitude: 40.43, longitude: -3.68 }, radius: 1500, places: ["El Retiro Park", "Boating Lake", "Crystal Palace"] },
    ]
  },
  "New York": {
    coords: { latitude: 40.7128, longitude: -74.0060 },
    zones: [
      { id: 5, name: "Times Square", riskScore: 7.2, riskLevel: 'Medium', incidentHistory: "High risk of pickpocketing and scams targeting tourists.", locationDetails: "Extremely crowded, heavy police presence but still opportunistic crime.", coords: { latitude: 40.7580, longitude: -73.9855 }, radius: 500, places: ["Broadway Theaters", "Giant Billboards", "Pedestrian Plazas"] },
      { id: 6, name: "Central Park", riskScore: 3.5, riskLevel: 'Low', incidentHistory: "Generally safe during the day. Some thefts reported after dark in isolated areas.", locationDetails: "Large urban park, well-patrolled in main areas during daytime.", coords: { latitude: 40.785091, longitude: -73.968285 }, radius: 2000, places: ["Strawberry Fields", "Belvedere Castle", "The Lake"] },
      { id: 7, name: "East Village", riskScore: 5.5, riskLevel: 'Medium', incidentHistory: "Mix of busy nightlife and quiet residential streets. Some reports of harassment.", locationDetails: "Vibrant area with many bars and restaurants, can be noisy at night.", coords: { latitude: 40.7265, longitude: -73.9835 }, radius: 700, places: ["St. Mark's Place", "Tompkins Square Park", "Iconic eateries"] },
    ]
  }
};

type Zone = (typeof cityData.Madrid.zones)[0];

const riskVariants: {[key: string]: 'secondary' | 'accent' | 'destructive'} = {
  'Low': 'secondary',
  'Medium': 'accent',
  'High': 'destructive',
};

const riskZoneOptions: {[key: string]: google.maps.CircleOptions} = {
    Low: {
        strokeColor: "#22c55e",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#22c55e",
        fillOpacity: 0.2,
    },
    Medium: {
        strokeColor: "#f97316",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#f97316",
        fillOpacity: 0.2,
    },
    High: {
        strokeColor: "#ef4444",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#ef4444",
        fillOpacity: 0.2,
    }
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem',
};

function RiskZoneCard({ zone, onSelect }: { zone: Zone, onSelect: () => void }) {
  const [explanation, setExplanation] = useState<SuggestRiskScoreExplanationOutput | null>(null);
  const [summary, setSummary] = useState<SummarizeIncidentReportsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFetchDetails = async () => {
    if (explanation && summary) return; // Already loaded

    setIsLoading(true);
    try {
      const [explanationResult, summaryResult] = await Promise.all([
        suggestRiskScoreExplanation({
          zoneName: zone.name,
          riskScore: zone.riskScore,
          incidentHistory: zone.incidentHistory,
          locationDetails: zone.locationDetails
        }),
        summarizeIncidentReports({
          areaDescription: zone.name,
          incidentReports: zone.incidentHistory,
        })
      ]);
      setExplanation(explanationResult);
      setSummary(summaryResult);
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Error generating AI details',
        description: 'The service might be temporarily unavailable or rate-limited. Please try again in a moment.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow" onClick={onSelect}>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline">{zone.name}</CardTitle>
                <CardDescription>Overall Risk Assessment</CardDescription>
            </div>
            <Badge variant={riskVariants[zone.riskLevel]}>{zone.riskLevel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow text-center">
        <p className="text-6xl font-bold font-headline">{zone.riskScore}</p>
        <p className="text-sm text-muted-foreground">out of 10</p>
        
        <Dialog onOpenChange={(open) => open && handleFetchDetails()}>
            <DialogTrigger asChild>
                <Button variant="link" className="mt-2" onClick={(e) => e.stopPropagation()}>
                    <Info className="mr-2 h-4 w-4" /> How is this calculated?
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Risk Score for {zone.name}</DialogTitle>
                  <DialogDescription>
                      This score is generated by our AI based on multiple factors.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-4">
                  <div className="grid gap-4 py-4">
                    {isLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <>
                        <h4 className="font-semibold font-headline">AI-Generated Explanation</h4>
                        <p className="text-sm text-muted-foreground">{explanation?.explanation || "Could not load explanation."}</p>
                        <h4 className="font-semibold mt-2 font-headline">Incident Summary</h4>
                        <p className="text-sm text-muted-foreground">{summary?.summary || "Could not load summary."}</p>
                      </>
                    )}
                  </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>

        <div className="mt-4 text-left pt-4 border-t flex-grow">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <MapPin className="text-muted-foreground" size={16}/>
                Places of Interest
            </h4>
            <ul className="space-y-1">
                {zone.places.map(place => (
                    <li key={place} className="text-sm text-muted-foreground">{place}</li>
                ))}
            </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SafetyZonesPage() {
  const { location, isInitializing: isLocating, isTrackingEnabled } = useContext(TrackingContext);
  const [currentZone, setCurrentZone] = useState<Zone | null>(null);
  const [selectedCity, setSelectedCity] = useState(Object.keys(cityData)[0]);
  const { toast } = useToast();
  const notifiedZoneRef = useRef<number | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const zones = cityData[selectedCity as keyof typeof cityData].zones;
  const cityCoords = cityData[selectedCity as keyof typeof cityData].coords;

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleZoneSelect = (zone: Zone) => {
    if (mapRef.current) {
        mapRef.current.panTo({ lat: zone.coords.latitude, lng: zone.coords.longitude });
        mapRef.current.setZoom(14);
    }
  }

  useEffect(() => {
    if (mapRef.current) {
        mapRef.current.panTo({ lat: cityCoords.latitude, lng: cityCoords.longitude });
        mapRef.current.setZoom(12);
    }
  }, [selectedCity, cityCoords]);

  useEffect(() => {
    if (!isTrackingEnabled) {
      setCurrentZone(null);
      return;
    }
    
    if (location && isLocating === false) {
      let closestCity = null;
      let minCityDistance = Infinity;
      for (const cityName in cityData) {
          const city = cityData[cityName as keyof typeof cityData];
          const distance = getDistance({latitude: location.latitude, longitude: location.longitude}, city.coords);
          if (distance < minCityDistance) {
              minCityDistance = distance;
              closestCity = cityName;
          }
      }

      if (closestCity && minCityDistance < 50000 && selectedCity !== closestCity) {
          setSelectedCity(closestCity);
      }
    }
  }, [location, isLocating, isTrackingEnabled, selectedCity]);

  useEffect(() => {
    if (location && isTrackingEnabled) {
      const currentCityZones = cityData[selectedCity as keyof typeof cityData].zones;
      let closestZone: Zone | null = null;
      let minDistance = Infinity;

      currentCityZones.forEach(zone => {
        const distance = getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          zone.coords
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestZone = zone;
        }
      });
      
      if (closestZone && minDistance < closestZone.radius) {
        setCurrentZone(closestZone);
      } else {
        setCurrentZone(null);
      }
    } else {
        setCurrentZone(null);
    }
  }, [location, selectedCity, isTrackingEnabled]);

  useEffect(() => {
    if (currentZone && currentZone.id !== notifiedZoneRef.current) {
        if (currentZone.riskLevel === 'High' || currentZone.riskLevel === 'Medium') {
            toast({
                variant: currentZone.riskLevel === 'High' ? 'destructive' : 'default',
                title: `Entering ${currentZone.riskLevel}-Risk Zone`,
                description: `You are now in the ${currentZone.name}. Be extra vigilant.`,
                duration: 5000
            });
        }
        notifiedZoneRef.current = currentZone.id;
    } else if (!currentZone) {
        notifiedZoneRef.current = null;
    }
  }, [currentZone, toast]);


  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold font-headline">Safety Zones</h1>
            <p className="text-muted-foreground">
            AI-powered risk analysis of different zones in the city.
            </p>
        </div>
        <div className="w-full md:w-auto">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                    {Object.keys(cityData).map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>

       <Card className={cn("bg-accent/10 border-accent", {
         'bg-destructive/10 border-destructive': currentZone?.riskLevel === 'High',
         'bg-secondary/50 border-secondary-foreground/20': !currentZone || currentZone?.riskLevel === 'Low',
       })}>
        <CardHeader className="flex flex-row items-center gap-4">
          {isLocating ? (
            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin shrink-0"/>
          ) : (
            currentZone?.riskLevel === 'High' ? <ShieldAlert className="w-8 h-8 text-destructive shrink-0" /> :
            currentZone?.riskLevel === 'Medium' ? <AlertCircle className="w-8 h-8 text-accent shrink-0" /> :
            currentZone?.riskLevel === 'Low' ? <ShieldCheck className="w-8 h-8 text-green-700 shrink-0" /> :
            <ShieldCheck className="w-8 h-8 text-muted-foreground shrink-0" />
          )}
          <div>
            {isLocating ? (
                <CardTitle className="font-headline">Determining your location...</CardTitle>
            ) : currentZone ? (
                <>
                 <CardTitle className={cn("text-accent font-headline", {
                    'text-destructive': currentZone.riskLevel === 'High',
                    'text-green-800': currentZone.riskLevel === 'Low',
                  })}>
                    You are in a {currentZone.riskLevel}-Risk Zone
                  </CardTitle>
                  <CardDescription className={cn("text-accent/90", {
                    'text-destructive/90': currentZone.riskLevel === 'High',
                    'text-green-700/90': currentZone.riskLevel === 'Low',
                  })}>
                   Be vigilant of your surroundings in the {currentZone.name}.
                  </CardDescription>
                </>
            ) : (
                 <CardTitle className="font-headline text-muted-foreground">
                   {isTrackingEnabled ? 'You are outside of any monitored zone for this city.' : 'Enable Safe Trek to determine risk zone.'}
                 </CardTitle>
            )}
          </div>
        </CardHeader>
      </Card>>
      
      <Card>
        <CardContent className="h-96 w-full p-0">
            {loadError && <div>Error loading maps</div>}
            {!isLoaded && <div className="h-full w-full flex items-center justify-center bg-muted"><Loader2 className="animate-spin" /></div>}
            {isLoaded && (
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={{ lat: cityCoords.latitude, lng: cityCoords.longitude }}
                    zoom={12}
                    onLoad={onLoad}
                    options={{
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: false,
                    }}
                >
                    {zones.map(zone => (
                        <Circle
                            key={zone.id}
                            center={{ lat: zone.coords.latitude, lng: zone.coords.longitude }}
                            radius={zone.radius}
                            options={riskZoneOptions[zone.riskLevel]}
                        />
                    ))}
                    {isTrackingEnabled && location && (
                         <MarkerF
                            position={{ lat: location.latitude, lng: location.longitude }}
                            title="Your Location"
                            icon={{
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 8,
                                fillColor: "#4285F4",
                                fillOpacity: 1,
                                strokeColor: "white",
                                strokeWeight: 2,
                            }}
                        />
                    )}
                </GoogleMap>
            )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {zones.map((zone) => (
          <RiskZoneCard key={zone.id} zone={zone} onSelect={() => handleZoneSelect(zone)} />
        ))}
      </div>
    </div>
  );
}

