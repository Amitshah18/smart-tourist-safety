
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useContext } from "react";
import { useToast } from "@/hooks/use-toast";
import { User, Shield, Languages, Save, Phone, QrCode, Loader2, Timer } from "lucide-react";
import { TrackingContext } from "@/context/tracking-provider";
import { getContacts, saveContacts } from "@/lib/contacts";

export default function SettingsPage() {
  const { isTrackingEnabled, setIsTrackingEnabled, trackingInterval, setTrackingInterval } = useContext(TrackingContext);
  const { toast } = useToast();
  const [contacts, setContacts] = useState([{ name: '', phone: '' }, { name: '', phone: '' }]);
  const [isSaving, setIsSaving] = useState(false);
  const [currentInterval, setCurrentInterval] = useState(trackingInterval);

  useEffect(() => {
    const fetchContacts = async () => {
        const existingContacts = await getContacts();
        if (existingContacts && existingContacts.length > 0) {
            const filledContacts = [
                existingContacts[0] || { name: '', phone: '' },
                existingContacts[1] || { name: '', phone: '' }
            ];
            setContacts(filledContacts);
        }
    };
    fetchContacts();
  }, []);

  useEffect(() => {
    setCurrentInterval(trackingInterval);
  }, [trackingInterval])

  const handleContactChange = (index: number, field: 'name' | 'phone', value: string) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    setContacts(newContacts);
  }

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
        await saveContacts(contacts.filter(c => c.name && c.phone));
        setTrackingInterval(currentInterval);
        toast({
            title: "Settings Saved",
            description: "Your preferences have been updated successfully.",
        });
    } catch (error) {
        console.error("Failed to save settings:", error);
        toast({
            variant: "destructive",
            title: "Save Failed",
            description: "Could not save your settings.",
        });
    } finally {
        setIsSaving(false);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-headline">Profile & Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile, emergency contacts, and application preferences.
        </p>
      </div>
      
      <div className="space-y-8">
         <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Phone className="w-6 h-6 text-destructive" />
                    <CardTitle>Emergency Contacts</CardTitle>
                </div>
                <CardDescription>Add contacts to be notified in an emergency. Changes are saved when you click the save button at the bottom.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="contact1-name">Contact 1 Name</Label>
                        <Input id="contact1-name" placeholder="e.g., Jane Doe" value={contacts[0].name} onChange={(e) => handleContactChange(0, 'name', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact1-phone">Contact 1 Phone</Label>
                        <Input id="contact1-phone" type="tel" placeholder="+1 (555) 123-4567" value={contacts[0].phone} onChange={(e) => handleContactChange(0, 'phone', e.target.value)} />
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="contact2-name">Contact 2 Name</Label>
                        <Input id="contact2-name" placeholder="e.g., John Smith" value={contacts[1].name} onChange={(e) => handleContactChange(1, 'name', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact2-phone">Contact 2 Phone</Label>
                        <Input id="contact2-phone" type="tel" placeholder="+1 (555) 765-4321" value={contacts[1].phone} onChange={(e) => handleContactChange(1, 'phone', e.target.value)} />
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary" />
                <CardTitle>Safe Trek Mode</CardTitle>
            </div>
            <CardDescription>Enable real-time location tracking for enhanced safety features. Your preferences are saved when you click the button at the bottom.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
              <Label htmlFor="safe-trek-mode" className="flex flex-col space-y-1">
                <span>Enable Safe Trek</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Shares your location for anomaly detection and geo-fencing.
                </span>
              </Label>
              <Switch id="safe-trek-mode" checked={isTrackingEnabled} onCheckedChange={setIsTrackingEnabled} aria-label="Enable Safe Trek Mode" />
            </div>
             <div className="space-y-2 rounded-lg border p-4">
                <Label htmlFor="tracking-interval" className="flex items-center gap-2">
                  <Timer className="w-4 h-4"/>
                  <span>Tracking Frequency</span>
                </Label>
                 <p className="text-sm font-normal leading-snug text-muted-foreground">
                  Choose how often to update your location. High frequency uses more battery.
                </p>
                <Select value={currentInterval} onValueChange={(value) => setCurrentInterval(value as 'realtime' | 'balanced' | 'saver')}>
                  <SelectTrigger id="tracking-interval" className="w-full md:w-1/2">
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time (High Power)</SelectItem>
                    <SelectItem value="balanced">Balanced (Every 30s)</SelectItem>
                    <SelectItem value="saver">Power Saver (Every 5min)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
                <Languages className="w-6 h-6 text-primary" />
                <CardTitle>Display Language</CardTitle>
            </div>
            <CardDescription>Customize your application language. This is a visual demonstration and is not yet functional.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
                <Label htmlFor="language" className="sr-only">Display Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language" className="w-full md:w-1/2">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                    <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                    <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                    <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                    <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                    <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                    <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                    <SelectItem value="es">Español (Spanish)</SelectItem>
                    <SelectItem value="fr" disabled>Français (coming soon)</SelectItem>
                    <SelectItem value="other" disabled>More coming soon...</SelectItem>
                  </SelectContent>
                </Select>
              </div>
          </CardContent>
        </Card>
      </div>
       <div className="flex justify-start pt-4">
        <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin" /> : <Save className="mr-2 h-4 w-4"/>}
            {isSaving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  );
}
