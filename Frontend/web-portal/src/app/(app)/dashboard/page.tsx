
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPinned, BellRing, ShieldCheck, Loader2, LocateFixed, Star, Bot, Phone, Ambulance } from "lucide-react";
import Image from "next/image";
import placeholderImages from '@/lib/placeholder-images.json'
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { TrackingContext } from "@/context/tracking-provider";
import { calculateSafetyScore, CalculateSafetyScoreOutput } from "@/ai/flows/calculate-safety-score";
import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";
import { getIncidents, IncidentSerializable } from "@/lib/incidents";
import { parseLocation } from "@/components/incidents-map";
import { getDistance } from "geolib";

const IncidentsMap = dynamic(() => import('@/components/incidents-map'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted flex items-center justify-center"><Loader2 className="animate-spin" /></div>
});


function SafetyScoreCard() {
  const [scoreData, setScoreData] = useState<CalculateSafetyScoreOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchScore = async () => {
      setIsLoading(true);
      try {
        // In a real app, this data would be dynamically generated based on user's real travel history.
        const result = await calculateSafetyScore({
          travelPatterns: "User spent 3 hours in the Historic Center (daylight), 1 hour in the North Station District (evening), and briefly passed through the Riverside Industrial Park (night).",
          areaSensitivity: "Historic Center is Low-Risk. North Station District is Medium-Risk, especially at night. Riverside Industrial Park is High-Risk at all times."
        });
        setScoreData(result);
      } catch (error) {
        console.error("Error fetching safety score:", error);
        toast({
          variant: "destructive",
          title: "AI Error",
          description: "Could not calculate your safety score at this time.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchScore();
  }, [toast]);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="text-primary" />
          <span>Tourist Safety Score</span>
        </CardTitle>
        <CardDescription>An AI-generated score based on your recent activity.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center items-center text-center gap-2">
        {isLoading ? (
          <Loader2 className="w-16 h-16 text-muted-foreground animate-spin" />
        ) : scoreData ? (
          <>
            <p className="text-7xl font-bold font-headline text-primary">{scoreData.safetyScore.toFixed(1)}</p>
            <p className="text-sm font-medium text-muted-foreground">{scoreData.explanation}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Could not load score.</p>
        )}
      </CardContent>
      {scoreData && !isLoading && (
         <CardFooter className="flex flex-col items-start gap-4 p-4 bg-secondary/50 rounded-b-lg text-left">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-primary shrink-0" />
              <p className="text-sm font-semibold">AI Recommendation</p>
            </div>
            <p className="text-sm text-secondary-foreground">{scoreData.recommendation}</p>
         </CardFooter>
      )}
    </Card>
  )
}

function EmergencyHelplinesCard() {
    const helplines = [
        { name: "Police", number: "100", icon: <Phone className="w-5 h-5 text-blue-600" /> },
        { name: "Ambulance", number: "102", icon: <Ambulance className="w-5 h-5 text-red-600" /> },
        { name: "National Emergency", number: "112", icon: <Phone className="w-5 h-5 text-primary" /> },
        { name: "Tourist Helpline", number: "1363", icon: <Phone className="w-5 h-5 text-green-600" /> },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Phone className="text-destructive" />
                    <span>Emergency Helplines</span>
                </CardTitle>
                 <CardDescription>Quick access to emergency services.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                {helplines.map(line => (
                    <div key={line.name} className="flex items-center gap-3 bg-muted p-3 rounded-lg">
                        {line.icon}
                        <div>
                            <p className="font-semibold text-sm">{line.name}</p>
                            <a href={`tel:${line.number}`} className="font-mono text-base text-muted-foreground hover:text-primary">{line.number}</a>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function SafeTrekCard() {
  const { location, isTrackingEnabled, locationError, isInitializing } = useContext(TrackingContext);
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="text-primary" />
          <span>Safe Trek Mode</span>
        </CardTitle>
        <CardDescription>{isTrackingEnabled ? "Location tracking is active." : "Tracking is currently disabled."}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center items-center gap-4 text-center">
         <div className="relative w-24 h-24 flex items-center justify-center">
            {isInitializing ? (
              <Loader2 className="w-12 h-12 text-muted-foreground animate-spin" />
            ) : isTrackingEnabled && location ? (
                <LocateFixed className="w-12 h-12 text-primary animate-pulse" />
            ) : (
                <LocateFixed className="w-12 h-12 text-muted-foreground/50" />
            )}
        </div>
        {isTrackingEnabled && location ? (
            <div>
                <p className="text-sm font-medium">Lat: {location.latitude.toFixed(5)}</p>
                <p className="text-sm font-medium">Lon: {location.longitude.toFixed(5)}</p>
            </div>
        ) : (
             <p className="text-sm text-muted-foreground">
              {isInitializing ? "Initializing..." : isTrackingEnabled ? "Fetching location..." : "Tracking disabled"}
             </p>
        )}

        {isTrackingEnabled && locationError && (
            <Alert variant="destructive" className="text-left text-xs">
                <AlertTitle>Location Error</AlertTitle>
                <AlertDescription>
                    Could not access location. Please enable permissions.
                </AlertDescription>
            </Alert>
        )}
      </CardContent>
       <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/settings">Manage Settings <ArrowRight className="ml-2"/></Link>
        </Button>
       </CardFooter>
    </Card>
  )
}

function NearbyIncidentsCard() {
  const [incidents, setIncidents] = useState<IncidentSerializable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { location, isTrackingEnabled } = useContext(TrackingContext);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const allIncidents = await getIncidents();
        if(location && isTrackingEnabled) {
          const nearby = allIncidents.filter(incident => {
            const incidentCoords = parseLocation(incident.location);
            if (!incidentCoords) return false;

            const distance = getDistance(
              { latitude: location.latitude, longitude: location.longitude },
              { latitude: incidentCoords.lat, longitude: incidentCoords.lng }
            );
            return distance <= 5000; // 5km radius
          }).slice(0, 2); // Show max 2
          setIncidents(nearby);
        }
      } catch (error) {
        console.error("Failed to fetch incidents:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [location, isTrackingEnabled]);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing className="text-accent" />
          <span>Nearby Incidents</span>
        </CardTitle>
        <CardDescription>Recent reports from your area.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
          </div>
        ) : incidents.length > 0 ? (
          incidents.map(incident => (
            <div key={incident.id} className="flex items-center gap-4">
              <div className="bg-muted p-2 rounded-md">
                <MapPinned className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold">{incident.type}</p>
                <p className="text-sm text-muted-foreground">{incident.location}, {incident.timestamp}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-sm text-muted-foreground h-full flex items-center justify-center">
            No incidents reported nearby.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/incidents">View All Incidents <ArrowRight className="ml-2"/></Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<IncidentSerializable[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const allIncidents = await getIncidents();
        setIncidents(allIncidents);
      } catch (error) {
        console.error("Failed to fetch incidents:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome, Traveler!</h1>
        <p className="text-muted-foreground">Your safety dashboard for a worry-free journey.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <SafeTrekCard />
          <SafetyScoreCard />
          <EmergencyHelplinesCard />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Risk Zone Overview</CardTitle>
              <CardDescription>Live risk assessment of your surroundings.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow aspect-video">
                <IncidentsMap incidents={incidents} showHeatmap={true} focusedLocation={null} />
            </CardContent>
            <CardFooter>
              <Button variant="default" className="w-full" asChild>
                  <Link href="/safety-zones">Explore Safety Map <ArrowRight className="ml-2"/></Link>
              </Button>
            </CardFooter>
          </Card>
          <NearbyIncidentsCard />
        </div>
      </div>
    </div>
  );
}
