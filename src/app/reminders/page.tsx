
"use client";

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pill, CalendarDays, PlusCircle, Trash2, Edit3 } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";

const medicationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  notes: z.string().optional(),
  recurring: z.boolean().default(false),
});
type MedicationValues = z.infer<typeof medicationSchema>;

const appointmentSchema = z.object({
  id: z.string().optional(),
  type: z.string().min(1, "Appointment type is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  location: z.string().optional(),
  notes: z.string().optional(),
  recurring: z.boolean().default(false),
});
type AppointmentValues = z.infer<typeof appointmentSchema>;

interface ReminderItem {
  id: string;
  type: 'medication' | 'appointment';
  title: string;
  details: string;
  timeInfo: string;
  recurring: boolean;
  data: MedicationValues | AppointmentValues;
}

export default function RemindersPage() {
  const { toast } = useToast();
  const [medications, setMedications] = React.useState<MedicationValues[]>([]);
  const [appointments, setAppointments] = React.useState<AppointmentValues[]>([]);
  const [showMedForm, setShowMedForm] = React.useState(false);
  const [showApptForm, setShowApptForm] = React.useState(false);
  const [editingMed, setEditingMed] = React.useState<MedicationValues | null>(null);
  const [editingAppt, setEditingAppt] = React.useState<AppointmentValues | null>(null);

  const medForm = useForm<MedicationValues>({ resolver: zodResolver(medicationSchema), defaultValues: { name: '', dosage: '', frequency: '', time: '08:00', recurring: false, notes: '' } });
  const apptForm = useForm<AppointmentValues>({ resolver: zodResolver(appointmentSchema), defaultValues: { type: '', date: '', time: '10:00', recurring: false, location: '', notes: '' } });

  React.useEffect(() => {
    if (editingMed) {
      medForm.reset(editingMed);
      setShowMedForm(true);
    } else {
      medForm.reset({ name: '', dosage: '', frequency: '', time: '08:00', recurring: false, notes: '' });
    }
  }, [editingMed, medForm]);

  React.useEffect(() => {
    if (editingAppt) {
      apptForm.reset(editingAppt);
      setShowApptForm(true);
    } else {
      apptForm.reset({ type: '', date: '', time: '10:00', recurring: false, location: '', notes: '' });
    }
  }, [editingAppt, apptForm]);

  const handleMedSubmit = (data: MedicationValues) => {
    if (editingMed) {
      setMedications(meds => meds.map(m => m.id === editingMed.id ? {...data, id: editingMed.id} : m));
      toast({ title: "Medication Updated" });
    } else {
      setMedications(prev => [{ ...data, id: Date.now().toString() }, ...prev]);
      toast({ title: "Medication Reminder Added" });
    }
    medForm.reset();
    setShowMedForm(false);
    setEditingMed(null);
  };

  const handleApptSubmit = (data: AppointmentValues) => {
     if (editingAppt) {
      setAppointments(appts => appts.map(a => a.id === editingAppt.id ? {...data, id: editingAppt.id} : a));
      toast({ title: "Appointment Updated" });
    } else {
      setAppointments(prev => [{ ...data, id: Date.now().toString() }, ...prev]);
      toast({ title: "Appointment Reminder Added" });
    }
    apptForm.reset();
    setShowApptForm(false);
    setEditingAppt(null);
  };
  
  const deleteMedication = (id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id));
    toast({ title: "Medication Reminder Deleted" });
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    toast({ title: "Appointment Reminder Deleted" });
  };

  const allReminders: ReminderItem[] = React.useMemo(() => {
    const medReminders: ReminderItem[] = medications.map(m => ({
      id: m.id!,
      type: 'medication',
      title: m.name,
      details: `${m.dosage}, ${m.frequency}`,
      timeInfo: m.time,
      recurring: m.recurring,
      data: m
    }));
    const apptReminders: ReminderItem[] = appointments.map(a => ({
      id: a.id!,
      type: 'appointment',
      title: a.type,
      details: a.location ? `Location: ${a.location}` : 'No location specified',
      timeInfo: `${a.date} at ${a.time}`,
      recurring: a.recurring,
      data: a
    }));
    return [...medReminders, ...apptReminders].sort((x, y) => {
      // Basic sort, could be improved for dates/times
      const timeX = x.type === 'medication' ? (x.data as MedicationValues).time : `${(x.data as AppointmentValues).date} ${(x.data as AppointmentValues).time}`;
      const timeY = y.type === 'medication' ? (y.data as MedicationValues).time : `${(y.data as AppointmentValues).date} ${(y.data as AppointmentValues).time}`;
      return timeX.localeCompare(timeY);
    });
  }, [medications, appointments]);


  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-headline tracking-tight">Reminders</h1>
        
        <Tabs defaultValue="all">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Reminders</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
            </TabsList>
             <div className="space-x-2">
              <Button onClick={() => { setShowMedForm(true); setEditingMed(null); medForm.reset(); }} variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add Medication</Button>
              <Button onClick={() => { setShowApptForm(true); setEditingAppt(null); apptForm.reset(); }} variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add Appointment</Button>
            </div>
          </div>

          {showMedForm && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="font-headline">{editingMed ? "Edit" : "Add New"} Medication Reminder</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={medForm.handleSubmit(handleMedSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="medName">Name</Label><Input id="medName" {...medForm.register("name")} />{medForm.formState.errors.name && <p className="text-sm text-destructive">{medForm.formState.errors.name.message}</p>}</div>
                    <div><Label htmlFor="dosage">Dosage</Label><Input id="dosage" {...medForm.register("dosage")} />{medForm.formState.errors.dosage && <p className="text-sm text-destructive">{medForm.formState.errors.dosage.message}</p>}</div>
                    <div><Label htmlFor="frequency">Frequency</Label><Input id="frequency" {...medForm.register("frequency")} />{medForm.formState.errors.frequency && <p className="text-sm text-destructive">{medForm.formState.errors.frequency.message}</p>}</div>
                    <div><Label htmlFor="medTime">Time (HH:MM)</Label><Input id="medTime" type="time" {...medForm.register("time")} />{medForm.formState.errors.time && <p className="text-sm text-destructive">{medForm.formState.errors.time.message}</p>}</div>
                  </div>
                  <div><Label htmlFor="medNotes">Notes</Label><Textarea id="medNotes" {...medForm.register("notes")} /></div>
                  <div className="flex items-center space-x-2">
                    <Controller name="recurring" control={medForm.control} render={({ field }) => (<Checkbox id="medRecurring" checked={field.value} onCheckedChange={field.onChange} />)} />
                    <Label htmlFor="medRecurring">Recurring Reminder</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">{editingMed ? "Update" : "Add"} Reminder</Button>
                    <Button type="button" variant="outline" onClick={() => { setShowMedForm(false); setEditingMed(null); }}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {showApptForm && (
             <Card className="mt-4">
              <CardHeader>
                <CardTitle className="font-headline">{editingAppt ? "Edit" : "Add New"} Appointment Reminder</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={apptForm.handleSubmit(handleApptSubmit)} className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="apptType">Type (e.g., Check-up, Chemo)</Label><Input id="apptType" {...apptForm.register("type")} />{apptForm.formState.errors.type && <p className="text-sm text-destructive">{apptForm.formState.errors.type.message}</p>}</div>
                    <div><Label htmlFor="apptDate">Date</Label><Input id="apptDate" type="date" {...apptForm.register("date")} />{apptForm.formState.errors.date && <p className="text-sm text-destructive">{apptForm.formState.errors.date.message}</p>}</div>
                    <div><Label htmlFor="apptTime">Time (HH:MM)</Label><Input id="apptTime" type="time" {...apptForm.register("time")} />{apptForm.formState.errors.time && <p className="text-sm text-destructive">{apptForm.formState.errors.time.message}</p>}</div>
                    <div><Label htmlFor="apptLocation">Location</Label><Input id="apptLocation" {...apptForm.register("location")} /></div>
                  </div>
                  <div><Label htmlFor="apptNotes">Notes</Label><Textarea id="apptNotes" {...apptForm.register("notes")} /></div>
                  <div className="flex items-center space-x-2">
                     <Controller name="recurring" control={apptForm.control} render={({ field }) => (<Checkbox id="apptRecurring" checked={field.value} onCheckedChange={field.onChange} />)} />
                    <Label htmlFor="apptRecurring">Recurring Reminder</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">{editingAppt ? "Update" : "Add"} Reminder</Button>
                     <Button type="button" variant="outline" onClick={() => { setShowApptForm(false); setEditingAppt(null); }}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <TabsContent value="all">
            <ReminderListCard title="All Upcoming Reminders" reminders={allReminders} onEdit={ (item) => item.type === 'medication' ? setEditingMed(item.data as MedicationValues) : setEditingAppt(item.data as AppointmentValues) } onDelete={(item) => item.type === 'medication' ? deleteMedication(item.id) : deleteAppointment(item.id)} />
          </TabsContent>
          <TabsContent value="medications">
             <ReminderListCard title="Medication Reminders" reminders={allReminders.filter(r => r.type === 'medication')} onEdit={(item) => setEditingMed(item.data as MedicationValues)} onDelete={(item) => deleteMedication(item.id)} />
          </TabsContent>
          <TabsContent value="appointments">
            <ReminderListCard title="Appointment Reminders" reminders={allReminders.filter(r => r.type === 'appointment')} onEdit={(item) => setEditingAppt(item.data as AppointmentValues)} onDelete={(item) => deleteAppointment(item.id)} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

interface ReminderListCardProps {
  title: string;
  reminders: ReminderItem[];
  onEdit: (item: ReminderItem) => void;
  onDelete: (item: ReminderItem) => void;
}

function ReminderListCard({ title, reminders, onEdit, onDelete }: ReminderListCardProps) {
  if (reminders.length === 0) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="font-headline">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            {title.includes("Medication") ? <Pill className="mx-auto h-12 w-12 text-muted-foreground" /> : <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground" />}
            <p className="mt-4 text-muted-foreground">No reminders of this type yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reminders.map(item => (
          <Card key={item.id} className="flex items-start p-4 gap-4">
            <div className="p-2 bg-accent/50 rounded-full text-accent-foreground">
                {item.type === 'medication' ? <Pill className="h-5 w-5" /> : <CalendarDays className="h-5 w-5" />}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.details}</p>
              <p className="text-sm">Time: {item.timeInfo} {item.recurring && "(Recurring)"}</p>
              {item.type === 'medication' && (item.data as MedicationValues).notes && <p className="text-xs text-muted-foreground mt-1">Notes: {(item.data as MedicationValues).notes}</p>}
              {item.type === 'appointment' && (item.data as AppointmentValues).notes && <p className="text-xs text-muted-foreground mt-1">Notes: {(item.data as AppointmentValues).notes}</p>}
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => onEdit(item)}><Edit3 className="h-4 w-4" /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the reminder for "{item.title}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(item)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

