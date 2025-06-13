
"use client";

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserCircle, Mail, Phone, CalendarDays as CalendarIcon } from 'lucide-react'; // Renamed to avoid conflict

export default function ProfilePage() {
  // Placeholder data - in a real app, this would come from user state/backend
  const userProfile = {
    name: "Alex Doe",
    email: "alex.doe@example.com",
    phone: "+1 (555) 123-4567",
    dob: "1985-07-15",
    avatarUrl: "https://placehold.co/128x128.png?text=AD",
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-headline tracking-tight">My Profile</h1>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} data-ai-hint="person portrait" />
                <AvatarFallback><UserCircle className="h-10 w-10" /></AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-headline">{userProfile.name}</CardTitle>
                <CardDescription>Manage your personal information and preferences.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="flex items-center gap-2 mt-1">
                  <UserCircle className="h-5 w-5 text-muted-foreground" />
                  <Input id="name" defaultValue={userProfile.name} readOnly />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                 <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <Input id="email" type="email" defaultValue={userProfile.email} readOnly />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                 <div className="flex items-center gap-2 mt-1">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <Input id="phone" type="tel" defaultValue={userProfile.phone} readOnly />
                </div>
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                 <div className="flex items-center gap-2 mt-1">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <Input id="dob" type="date" defaultValue={userProfile.dob} readOnly />
                </div>
              </div>
            </div>
            <Button className="mt-4">Edit Profile</Button>
            <CardDescription className="text-xs pt-4">
                Note: Profile editing is disabled in this demo. In a full application, you would be able to update your details here.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Care Team (Placeholder)</CardTitle>
            <CardDescription>Information about your registered healthcare providers.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 p-3 border rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://placehold.co/100x100.png?text=DS" alt="Dr. Smith" data-ai-hint="doctor headshot" />
                  <AvatarFallback>DS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Dr. Emily Smith</p>
                  <p className="text-sm text-muted-foreground">Oncologist</p>
                </div>
              </li>
              <li className="flex items-center gap-3 p-3 border rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://placehold.co/100x100.png?text=NJ" alt="Nurse Jones" data-ai-hint="nurse headshot" />
                  <AvatarFallback>NJ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Nurse David Jones</p>
                  <p className="text-sm text-muted-foreground">Care Nurse</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
