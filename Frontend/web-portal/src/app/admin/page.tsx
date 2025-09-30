

"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button"
import { MoreHorizontal, AlertTriangle, CheckCircle, Loader2, FileText, Home, Bot } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getIncidents, updateIncidentStatus, deleteIncident, type IncidentSerializable } from "@/lib/incidents"
import { useEffect, useState, useTransition } from "react"
import { useToast } from "@/hooks/use-toast"
import dynamic from 'next/dynamic'
import { parseLocation } from "@/components/incidents-map"
import Image from "next/image";
import { getDigitalIdForUser, DigitalIdSerializable } from "@/lib/digital-id"
import { generateEfir } from "@/ai/flows/generate-efir"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { detectAnomalies, DetectAnomaliesOutput } from "@/ai/flows/detect-anomalies"


const severityVariants: {[key: string]: 'secondary' | 'accent' | 'destructive'} = {
  'Low': 'secondary',
  'Medium': 'accent',
  'High': 'destructive',
};

const statusVariants: {[key: string]: 'secondary' | 'default' | 'outline'} = {
    'Resolved': 'secondary',
    'Reported': 'default',
    'In Progress': 'outline'
};

const IncidentsMap = dynamic(() => import('@/components/incidents-map'), {
  ssr: false,
  loading: () => <div className="h-64 md:h-96 w-full bg-muted flex items-center justify-center"><Loader2 className="animate-spin" /></div>
})

function AnomalyDetectionCard() {
  const [anomalyData, setAnomalyData] = useState<DetectAnomaliesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnomalies = async () => {
      setIsLoading(true);
      try {
        const result = await detectAnomalies({
          travelHistory: [
            { location: "Historic Center", timestamp: "2024-07-29T10:00:00Z" },
            { location: "Historic Center", timestamp: "2024-07-29T12:30:00Z" },
            { location: "North Station District", timestamp: "2024-07-29T18:00:00Z" },
            { location: "Riverside Industrial Park", timestamp: "2024-07-29T23:00:00Z" },
            { location: "Riverside Industrial Park", timestamp: "2024-07-29T23:55:00Z" },
          ],
          itinerary: "Day 1: Explore Historic Center. Evening: Dinner near North Station.",
          userProfile: { averageActivity: 'high', preferredZones: ['tourist', 'commercial'] }
        });
        setAnomalyData(result);
      } catch (error) {
        console.error("Error detecting anomalies:", error);
        toast({
          variant: "destructive",
          title: "AI Error",
          description: "Could not perform anomaly detection.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnomalies();
  }, [toast]);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <AlertTriangle className="text-destructive" />
          <span>AI Anomaly Detection</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center items-center text-center gap-4">
        {isLoading ? (
          <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
        ) : anomalyData && anomalyData.anomalies.length > 0 ? (
          <div className="text-destructive text-2xl font-bold">{anomalyData.anomalies.length}</div>
        ) : (
          <div className="text-2xl font-bold">0</div>
        )}
        <p className="text-xs text-muted-foreground">
          {isLoading ? 'Analyzing...' : anomalyData && anomalyData.anomalies.length > 0 ? 'Anomalies detected' : 'No anomalies detected'}
        </p>
      </CardContent>
    </Card>
  )
}


function IncidentTable({ incidents: filteredIncidents, onAction, onLocationClick }: { incidents: IncidentSerializable[], onAction: () => void, onLocationClick: (incident: IncidentSerializable & { coords: { lat: number, lng: number }}) => void }) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const [selectedIncident, setSelectedIncident] = useState<(IncidentSerializable & { coords: { lat: number, lng: number }}) | null>(null);
    const [digitalId, setDigitalId] = useState<DigitalIdSerializable | null>(null);
    const [isIdLoading, setIsIdLoading] = useState(false);
    const [efirContent, setEfirContent] = useState<string | null>(null);
    const [isEfirGenerating, setIsEfirGenerating] = useState(false);

    const handleStatusChange = (id: string, status: "In Progress" | "Resolved") => {
        startTransition(async () => {
          try {
            await updateIncidentStatus(id, status);
            toast({ title: "Incident Updated", description: `Status changed to ${status}` });
            onAction();
          } catch (error) {
             toast({ title: "Error", description: "Failed to update incident.", variant: "destructive" });
          }
        });
    }

    const handleDelete = (id: string) => {
        startTransition(async () => {
          try {
            await deleteIncident(id);
            toast({ title: "Incident Deleted", variant: "destructive" });
            onAction();
          } catch(error) {
            toast({ title: "Error", description: "Failed to delete incident.", variant: "destructive" });
          }
        });
    }
    
    const handleViewDetails = async (incident: IncidentSerializable & { coords: { lat: number, lng: number }}) => {
        setSelectedIncident(incident);
        setDigitalId(null);
        setEfirContent(null);
        
        if (!incident.userId) {
            // No user associated with the incident, so no digital ID to fetch.
            return;
        }

        setIsIdLoading(true);
        try {
            const id = await getDigitalIdForUser(incident.userId);
            setDigitalId(id);
        } catch (error) {
            // Not a critical error, maybe the user has no ID.
            console.error("Failed to fetch digital ID", error);
            setDigitalId(null);
        } finally {
            setIsIdLoading(false);
        }
    }
    
    const handleGenerateEfir = async () => {
        if (!selectedIncident || !digitalId) return;
        setIsEfirGenerating(true);
        try {
            const result = await generateEfir({
                incidentDetails: JSON.stringify(selectedIncident),
                touristIdDetails: JSON.stringify(digitalId)
            });
            setEfirContent(result.efirText);
        } catch(error) {
            toast({ title: "Error", description: "Failed to generate E-FIR.", variant: "destructive" });
        } finally {
            setIsEfirGenerating(false);
        }
    }

    const closeDetails = () => {
        setSelectedIncident(null);
        setDigitalId(null);
        setEfirContent(null);
    }

    return (
      <>
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden md:table-cell">Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.map((incident) => {
                const coords = parseLocation(incident.location);
                if (!coords) return null;
                const incidentWithCoords = { ...incident, coords };

                return (
                    <TableRow key={incident.id} data-state={isPending ? "pending" : "idle"}>
                    <TableCell className="font-medium">
                        <Button
                          variant="link"
                          className="p-0 h-auto font-medium text-current md:hidden"
                          onClick={() => onLocationClick(incidentWithCoords)}
                        >
                          {incident.type}
                        </Button>
                        <span className="hidden md:inline">{incident.type}</span>
                    </TableCell>
                    <TableCell>
                        <Badge variant={severityVariants[incident.severity]}>{incident.severity}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        <Button variant="link" className="p-0 h-auto" onClick={() => onLocationClick(incidentWithCoords)}>
                            {incident.location}
                        </Button>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{incident.timestamp}</TableCell>
                    <TableCell>
                        <Badge variant={statusVariants[incident.status]}>{incident.status}</Badge>
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                            disabled={isPending}
                            >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewDetails(incidentWithCoords)}>View Details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled={incident.status === 'In Progress' || incident.status === 'Resolved'} onClick={() => handleStatusChange(incident.id, 'In Progress')}>Mark as In Progress</DropdownMenuItem>
                            <DropdownMenuItem disabled={incident.status === 'Resolved'} onClick={() => handleStatusChange(incident.id, 'Resolved')}>Mark as Resolved</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(incident.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                )
              })}
            </TableBody>
          </Table>

        {selectedIncident && (
             <AlertDialog open onOpenChange={closeDetails}>
                <AlertDialogContent className="max-w-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Incident & Tourist Details</AlertDialogTitle>
                        <AlertDialogDescription>
                            Full report for incident ID: {selectedIncident.id}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
                        
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Incident Report</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><strong>Type:</strong> {selectedIncident.type}</div>
                                    <div><strong>Severity:</strong> <Badge variant={severityVariants[selectedIncident.severity]}>{selectedIncident.severity}</Badge></div>
                                    <div><strong>Status:</strong> <Badge variant={statusVariants[selectedIncident.status]}>{selectedIncident.status}</Badge></div>
                                    <div><strong>Timestamp:</strong> {selectedIncident.timestamp}</div>
                                </div>
                                <div>
                                    <strong className="text-sm">Location:</strong>
                                    <p className="text-sm text-muted-foreground">{selectedIncident.location}</p>
                                </div>
                                <div>
                                    <strong className="text-sm">Description:</strong>
                                    <p className="text-sm text-muted-foreground">{selectedIncident.description}</p>
                                </div>
                                {selectedIncident.image && (
                                    <div>
                                        <strong className="text-sm">Attached Media:</strong>
                                        <div className="mt-2 relative w-full h-64 rounded-lg overflow-hidden border">
                                            <Image src={selectedIncident.image} alt="Incident media" fill className="object-cover" />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Tourist Digital ID</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isIdLoading ? (
                                    <div className="flex items-center justify-center p-4"><Loader2 className="animate-spin" /></div>
                                ) : digitalId ? (
                                    <div className="space-y-4 text-sm">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><strong>Name:</strong> {digitalId.fullName}</div>
                                            <div><strong>Nationality:</strong> {digitalId.nationality}</div>
                                            <div><strong>Document:</strong> {digitalId.documentType}: {digitalId.documentNumber}</div>
                                            <div><strong>ID Valid Until:</strong> {new Date(digitalId.validUntil).toLocaleDateString()}</div>
                                        </div>
                                        <div>
                                            <strong className="text-sm">Planned Itinerary:</strong>
                                            <p className="text-sm text-muted-foreground">{digitalId.itinerary || "Not provided."}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No digital ID found for the reporting user.</p>
                                )}
                            </CardContent>
                        </Card>

                        {efirContent && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Generated E-FIR</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <pre className="text-xs whitespace-pre-wrap font-mono bg-muted p-4 rounded-md">{efirContent}</pre>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    <AlertDialogFooter className="pt-4 border-t">
                        <AlertDialogCancel>Close</AlertDialogCancel>
                        <Button variant="secondary" onClick={handleGenerateEfir} disabled={!digitalId || isEfirGenerating || !!efirContent}>
                             {isEfirGenerating ? <Loader2 className="mr-2 animate-spin" /> : <FileText className="mr-2" />}
                             {efirContent ? 'E-FIR Generated' : 'Generate E-FIR'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )}
      </>
    )
}

type Coords = { lat: number, lng: number };
type IncidentWithCoords = IncidentSerializable & { coords: Coords };


export default function AuthorityDashboardPage() {
  const [incidents, setIncidents] = useState<IncidentSerializable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [focusedLocation, setFocusedLocation] = useState<IncidentWithCoords | null>(null);

  const fetchIncidents = async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    try {
        const incidentData = await getIncidents();
        setIncidents(incidentData);
    } catch (error) {
        console.error("Failed to fetch incidents:", error);
    } finally {
        if (showLoading) setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchIncidents(true);
  }, []);
  
  const activeIncidents = incidents.filter(i => i.status === 'Reported' || i.status === 'In Progress').length;
  const highPriorityIncidents = incidents.filter(i => i.severity === 'High' && (i.status === 'Reported' || i.status === 'In Progress')).length;
  const resolvedIncidentsList = incidents.filter(i => i.status === 'Resolved');
  
  const handleLocationClick = (incidentWithCoords: IncidentWithCoords) => {
    document.getElementById('map-card')?.scrollIntoView({ behavior: 'smooth' });
    setFocusedLocation(incidentWithCoords);
  }

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-full">
            <Loader2 className="w-12 h-12 animate-spin" />
        </div>
    )
  }

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Authority Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage active incidents.
          </p>
        </div>
        <Button asChild variant="outline">
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Incidents
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeIncidents}</div>
            <p className="text-xs text-muted-foreground">
              Currently open and under review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              High-Priority Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityIncidents}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
        <AnomalyDetectionCard />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recently Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
              {resolvedIncidentsList.length > 0 ? (
                <div className="space-y-2">
                  {resolvedIncidentsList.slice(0, 2).map(incident => (
                      <div key={incident.id} className="text-sm">
                          <p className="font-medium truncate">{incident.type}</p>
                          <p className="text-xs text-muted-foreground truncate">{incident.description}</p>
                      </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No incidents resolved recently.</p>
              )}
          </CardContent>
        </Card>
        
        <Card id="map-card" className="col-span-1 lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Incident Hotspots</CardTitle>
                    <CardDescription>Visual overview of incident locations.</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="heatmap-toggle" checked={showHeatmap} onCheckedChange={setShowHeatmap} />
                    <Label htmlFor="heatmap-toggle">Show Heatmap</Label>
                </div>
            </div>
          </CardHeader>
          <CardContent>
              <IncidentsMap incidents={incidents} showHeatmap={showHeatmap} focusedLocation={focusedLocation} />
          </CardContent>
      </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incident Reports</CardTitle>
          <CardDescription>A list of all reported incidents.</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-4 sm:w-auto sm:inline-flex">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="reported">Reported</TabsTrigger>
                    <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                    <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-6">
                    <IncidentTable incidents={incidents} onAction={() => fetchIncidents(false)} onLocationClick={handleLocationClick} />
                </TabsContent>
                <TabsContent value="reported" className="mt-6">
                    <IncidentTable incidents={incidents.filter(i => i.status === 'Reported')} onAction={() => fetchIncidents(false)} onLocationClick={handleLocationClick} />
                </TabsContent>
                <TabsContent value="in-progress" className="mt-6">
                    <IncidentTable incidents={incidents.filter(i => i.status === 'In Progress')} onAction={() => fetchIncidents(false)} onLocationClick={handleLocationClick} />
                </TabsContent>
                <TabsContent value="resolved" className="mt-6">
                    <IncidentTable incidents={incidents.filter(i => i.status === 'Resolved')} onAction={() => fetchIncidents(false)} onLocationClick={handleLocationClick} />
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
    

    

