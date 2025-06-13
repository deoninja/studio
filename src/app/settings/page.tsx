
"use client";

import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Palette, ShieldCheck, Info } from 'lucide-react';

export default function SettingsPage() {
  // Placeholder states - in a real app, these would be managed and persisted
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false); // Example, not fully implemented theme switching
  const [selectedLanguage, setSelectedLanguage] = React.useState("en");

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-headline tracking-tight">Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Notification Settings</CardTitle>
            <CardDescription>Manage how you receive alerts and reminders.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label htmlFor="notifications-switch" className="font-medium">Enable All Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive medication, appointment, and message alerts.</p>
              </div>
              <Switch
                id="notifications-switch"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
             <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label htmlFor="reminder-sound" className="font-medium">Reminder Sound</Label>
                <p className="text-sm text-muted-foreground">Choose a sound for your reminders.</p>
              </div>
              <Select defaultValue="default">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select sound" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Beep</SelectItem>
                  <SelectItem value="gentle">Gentle Chime</SelectItem>
                  <SelectItem value="alert">Alert Tone</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Palette className="h-5 w-5 text-primary" /> Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the app.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label htmlFor="dark-mode-switch" className="font-medium">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Reduce eye strain in low light conditions.</p>
              </div>
              <Switch
                id="dark-mode-switch"
                checked={darkModeEnabled}
                onCheckedChange={(checked) => {
                  setDarkModeEnabled(checked);
                  // Basic theme toggle for demo, full implementation requires more setup
                  if (checked) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label htmlFor="language-select" className="font-medium">Language</Label>
                <p className="text-sm text-muted-foreground">Select your preferred language.</p>
              </div>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es" disabled>Español (Coming Soon)</SelectItem>
                  <SelectItem value="fr" disabled>Français (Coming Soon)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Account & Privacy</CardTitle>
            <CardDescription>Manage your account security and data privacy.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">Change Password</Button>
            <Button variant="outline" className="w-full justify-start">Privacy Policy</Button>
            <Button variant="outline" className="w-full justify-start">Terms of Service</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Info className="h-5 w-5 text-primary" /> About OncoAssist</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Version: 1.0.0 (MVP)</p>
            <p className="text-sm text-muted-foreground">OncoAssist is designed to support cancer patients and caregivers through their journey.</p>
            <Button variant="link" className="p-0 h-auto mt-2">Check for Updates</Button>
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
