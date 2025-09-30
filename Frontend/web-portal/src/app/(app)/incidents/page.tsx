
"use client"

import Link from 'next/link';
import { PlusCircle, Clock, Loader2, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';
import { getIncidents, getIncidentsForUser, type IncidentSerializable } from '@/lib/incidents';
import { useContext, useEffect, useState } from 'react';
import { TrackingContext } from '@/context/tracking-provider';
import { getDistance } from 'geolib';
import { parseLocation } from '@/components/incidents-map';


const severityVariants: {[key: string]: 'secondary' | 'accent' | 'destructive'} = {
  'Low': 'secondary',
  'Medium': 'accent',
  'High': 'destructive',
};

function IncidentList({ incidents, emptyMessage = "No incidents to display." }: { incidents: IncidentSerializable[], emptyMessage?: string }) {
  if (incidents.length === 0) {
    return <p className="text-muted-foreground text-center py-12">{emptyMessage}</p>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {incidents.map((incident: IncidentSerializable) => {
        return (
          <Card key={incident.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{incident.type}</CardTitle>
                <Badge variant={severityVariants[incident.severity]}>
                  {incident.severity}
                </Badge>
              </div>
              <CardDescription>{incident.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="relative h-48 w-full rounded-lg overflow-hidden">
                <Image
                  src={incident.image || `https://picsum.photos/seed/${incident.id}/600/400`}
                  alt={incident.type}
                  fill
                  className="object-cover"
                  data-ai-hint={incident.type === 'Medical' ? 'first aid' : incident.type.toLowerCase()}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {incident.timestamp}
              </div>
              <Badge variant={incident.status === 'Resolved' ? 'secondary' : 'default'}>{incident.status}</Badge>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

export default function IncidentsPage() {
  const [allIncidents, setAllIncidents] = useState<IncidentSerializable[]>([]);
  const [myIncidents, setMyIncidents] = useState<IncidentSerializable[]>([]);
  const [nearbyIncidents, setNearbyIncidents] = useState<IncidentSerializable[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { location, isTrackingEnabled, isInitializing } = useContext(TrackingContext);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [all, my] = await Promise.all([
          getIncidents(),
          getIncidentsForUser(),
        ]);
        setAllIncidents(all);
        setMyIncidents(my);
      } catch (error) {
        console.error("Failed to fetch incidents:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if(location && isTrackingEnabled && allIncidents.length > 0) {
      const nearby = allIncidents.filter(incident => {
        const incidentCoords = parseLocation(incident.location);
        if (!incidentCoords) return false;

        const distance = getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: incidentCoords.lat, longitude: incidentCoords.lng }
        );
        
        return distance <= 2000; // 2km radius
      });
      setNearbyIncidents(nearby);
    } else {
      setNearbyIncidents([]);
    }
  }, [location, isTrackingEnabled, allIncidents]);


  const getNearbyEmptyMessage = () => {
    if (isInitializing) {
      return "Checking your location...";
    }
    if (!isTrackingEnabled) {
      return "Enable 'Safe Trek' mode in settings to find nearby incidents.";
    }
    if (!location) {
      return "Could not determine your location. Please grant location access.";
    }
    return "No incidents found within a 2km radius of your location.";
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Incidents</h1>
          <p className="text-muted-foreground">
            View and report safety incidents in your area.
          </p>
        </div>
        <Button asChild>
            <Link href="/incidents/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Report Incident
            </Link>
          </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:inline-flex">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="my-reports">My Reports</TabsTrigger>
          <TabsTrigger value="nearby">Nearby</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="all" className="mt-6">
              <IncidentList incidents={allIncidents} />
            </TabsContent>
            <TabsContent value="my-reports" className="mt-6">
                <IncidentList incidents={myIncidents} />
            </TabsContent>
            <TabsContent value="nearby" className="mt-6">
                <IncidentList incidents={nearbyIncidents} emptyMessage={getNearbyEmptyMessage()} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
