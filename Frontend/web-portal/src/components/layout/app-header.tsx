
"use client";

import { useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertTriangle, LifeBuoy, User, LogOut, Loader2, PlusCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { createIncidentReport } from '@/ai/flows/create-incident-report';
import { useToast } from '@/hooks/use-toast';
import { TrackingContext } from '@/context/tracking-provider';

export function AppHeader() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSendingSOS, setIsSendingSOS] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { location: trackedLocation } = useContext(TrackingContext);

  const sendSOSReport = async (locationString: string) => {
    try {
      const result = await createIncidentReport({
        type: "SOS Emergency",
        severity: "High",
        description: "Urgent SOS alert triggered from user's device. Immediate assistance required. Notifying emergency contacts.",
        location: locationString,
        isSos: true,
      });

      if (result.success) {
        toast({
          title: "SOS Alert Sent",
          description: "Emergency services and your contacts have been notified of your location.",
        });
        router.push(`/incidents`);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'SOS Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsSendingSOS(false);
      setIsDialogOpen(false);
    }
  };

  const handleSendSOS = () => {
    setIsSendingSOS(true);

    // Prioritize using the already tracked location for speed
    if (trackedLocation) {
      const locationString = `Lat: ${trackedLocation.latitude.toFixed(5)}, Lon: ${trackedLocation.longitude.toFixed(5)}`;
      sendSOSReport(locationString);
      return;
    }

    // Fallback to fetching new location if not available
    if (!navigator.geolocation) {
       toast({
        variant: 'destructive',
        title: 'Location Error',
        description: 'Geolocation is not supported by your browser. Cannot send SOS.',
      });
      setIsSendingSOS(false);
      setIsDialogOpen(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationString = `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`;
        sendSOSReport(locationString);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          variant: 'destructive',
          title: 'Location Error',
          description: 'Could not fetch location for SOS. Please grant permission.',
        });
        setIsSendingSOS(false);
        setIsDialogOpen(false);
      }
    );
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-lg font-semibold font-headline md:hidden">Smart Tourist Safety</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="outline" asChild>
          <Link href="/incidents/new">
            <PlusCircle className="h-5 w-5" />
            <span className="hidden sm:inline ml-2">Report Incident</span>
          </Link>
        </Button>
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="gap-2 animate-pulse">
              <AlertTriangle className="h-5 w-5" />
              <span className="hidden sm:inline">SOS</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Activate SOS Alert?</AlertDialogTitle>
              <AlertDialogDescription>
                This will immediately create a high-priority incident and notify authorities and your emergency contacts with your current location. Only use this in a real emergency.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSendingSOS}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSendSOS} disabled={isSendingSOS}>
                {isSendingSOS && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSendingSOS ? 'Sending...' : 'Confirm & Send Alert'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://picsum.photos/seed/avatar/100/100" alt="User Avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Tourist User</p>
                <p className="text-xs leading-none text-muted-foreground">
                  user@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

    