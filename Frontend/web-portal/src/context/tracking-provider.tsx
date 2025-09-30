
"use client";

import { useToast } from "@/hooks/use-toast";
import { createContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";

type Location = {
  latitude: number;
  longitude: number;
};

type TrackingInterval = 'realtime' | 'balanced' | 'saver';

const INTERVAL_OPTIONS: Record<TrackingInterval, PositionOptions> = {
  realtime: { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 },
  balanced: { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 },
  saver: { enableHighAccuracy: false, maximumAge: 300000, timeout: 20000 },
};

interface TrackingContextType {
  isTrackingEnabled: boolean;
  setIsTrackingEnabled: (enabled: boolean) => void;
  location: Location | null;
  locationError: string | null;
  isInitializing: boolean;
  trackingInterval: TrackingInterval;
  setTrackingInterval: (interval: TrackingInterval) => void;
}

export const TrackingContext = createContext<TrackingContextType>({
  isTrackingEnabled: true,
  setIsTrackingEnabled: () => {},
  location: null,
  locationError: null,
  isInitializing: true,
  trackingInterval: 'balanced',
  setTrackingInterval: () => {},
});

export const TrackingProvider = ({ children }: { children: ReactNode }) => {
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(true);
  const [location, setLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [trackingInterval, setTrackingIntervalState] = useState<TrackingInterval>('balanced');
  const watchIdRef = useRef<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load persisted settings from localStorage on mount
    const savedEnabled = localStorage.getItem('isTrackingEnabled');
    if (savedEnabled !== null) {
      setIsTrackingEnabled(JSON.parse(savedEnabled));
    }
    const savedInterval = localStorage.getItem('trackingInterval') as TrackingInterval;
    if (savedInterval && INTERVAL_OPTIONS[savedInterval]) {
      setTrackingIntervalState(savedInterval);
    }
    setIsInitializing(false);
  }, []);

  const setTrackingInterval = (interval: TrackingInterval) => {
    setTrackingIntervalState(interval);
    localStorage.setItem('trackingInterval', interval);
    // Restart watching to apply new interval settings
    if (isTrackingEnabled) {
      startWatching();
    }
  }

  const handleSetIsTrackingEnabled = (enabled: boolean) => {
    setIsTrackingEnabled(enabled);
    localStorage.setItem('isTrackingEnabled', JSON.stringify(enabled));
  }

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setLocation(null);
    setLocationError(null);
  }, []);

  const startWatching = useCallback(() => {
    stopWatching(); // Ensure any existing watch is cleared
    setLocationError(null);
    if (navigator.geolocation) {
      const options = INTERVAL_OPTIONS[trackingInterval];
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          const errorMessage = error.message || "Could not fetch location. Please grant permission or check your browser settings.";
          console.error("Geolocation error:", errorMessage, error);
          setLocationError(errorMessage);
          toast({
            variant: "destructive",
            title: "Location Error",
            description: errorMessage,
          });
          stopWatching(); // Stop trying if there's a persistent error
        },
        options
      );
    } else {
      const errorMsg = "Geolocation is not supported by your browser.";
      setLocationError(errorMsg);
      toast({
        variant: "destructive",
        title: "Location Error",
        description: errorMsg,
      });
    }
  }, [toast, stopWatching, trackingInterval]);

  useEffect(() => {
    if (isTrackingEnabled && !isInitializing) {
      startWatching();
    } else {
      stopWatching();
    }

    // Cleanup on component unmount
    return () => {
      stopWatching();
    };
  }, [isTrackingEnabled, startWatching, stopWatching, isInitializing]);

  return (
    <TrackingContext.Provider
      value={{ isTrackingEnabled, setIsTrackingEnabled: handleSetIsTrackingEnabled, location, locationError, isInitializing, trackingInterval, setTrackingInterval }}
    >
      {children}
    </TrackingContext.Provider>
  );
};
