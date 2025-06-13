
"use client";

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { ActivitySquare, BarChart, PlusCircle, Trash2 } from 'lucide-react';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer, BarChart as RechartsBarChart } from "recharts"

const symptomCategories = [
  "Pain", "Nausea", "Fatigue", "Neuropathy", "Constipation", "Mouth Sores", "Bone Aches", "Other"
];

const symptomFormSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  intensity: z.number().min(1).max(10),
  description: z.string().optional(),
  date: z.string().optional(), // Will be auto-filled
});

type SymptomFormValues = z.infer<typeof symptomFormSchema>;

interface SymptomEntry extends SymptomFormValues {
  id: string;
  date: string;
}

const initialChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;


export default function SymptomsPage() {
  const { toast } = useToast();
  const [symptoms, setSymptoms] = React.useState<SymptomEntry[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const form = useForm<SymptomFormValues>({
    resolver: zodResolver(symptomFormSchema),
    defaultValues: {
      category: "",
      intensity: 5,
      description: "",
    },
  });

  // Fetch symptoms from API
  React.useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await fetch('/api/symptoms');
        if (!response.ok) throw new Error('Failed to fetch symptoms');
        const data = await response.json();
        setSymptoms(data);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load symptoms", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSymptoms();
  }, []);

  const onSubmit = async (data: SymptomFormValues) => {
    const newSymptom: SymptomEntry = {
      ...data,
      id: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    try {
      const response = await fetch('/api/symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSymptom),
      });

      if (!response.ok) throw new Error('Failed to save symptom');

      // Add new symptom to local state
      setSymptoms(prev => [newSymptom, ...prev]);
      toast({ title: "Symptom Logged", description: `${data.category} intensity ${data.intensity} recorded.` });
      form.reset();
      setShowForm(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save symptom", variant: "destructive" });
    }
  };

  const deleteSymptom = async (id: string) => {
    try {
      const response = await fetch(`/api/symptoms/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete symptom');

      // Remove symptom from local state
      setSymptoms(prev => prev.filter(symptom => symptom.id !== id));
      toast({ title: "Symptom Deleted", description: "The symptom entry has been removed." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete symptom", variant: "destructive" });
    }
  };
  
  const aggregatedSymptoms = React.useMemo(() => {
    const data: { [key: string]: { count: number, totalIntensity: number, entries: SymptomEntry[] } } = {};
    symptoms.forEach(symptom => {
      if (!data[symptom.category]) {
        data[symptom.category] = { count: 0, totalIntensity: 0, entries: [] };
      }
      data[symptom.category].count++;
      data[symptom.category].totalIntensity += symptom.intensity;
      data[symptom.category].entries.push(symptom);
    });
    return Object.entries(data).map(([category, values]) => ({
      category,
      averageIntensity: values.count > 0 ? parseFloat((values.totalIntensity / values.count).toFixed(1)) : 0,
      count: values.count,
    }));
  }, [symptoms]);

  const chartConfigCustom: ChartConfig = symptomCategories.reduce((acc, category, index) => {
    acc[category] = {
      label: category,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    };
    return acc;
  }, {} as ChartConfig);


  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-headline tracking-tight">Symptom Tracker</h1>
          <Button onClick={() => setShowForm(!showForm)} variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> {showForm ? 'Cancel' : 'Log New Symptom'}
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Log New Symptom</CardTitle>
              <CardDescription>Record any symptoms or side effects you are experiencing.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Symptom Category</Label>
                  <Controller
                    name="category"
                    control={form.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {symptomCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.category && <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="intensity">Intensity (1-10)</Label>
                  <Controller
                    name="intensity"
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                       <div className="flex items-center gap-4">
                        <Slider
                          id="intensity"
                          min={1} max={10} step={1}
                          defaultValue={[value]}
                          onValueChange={(vals) => onChange(vals[0])}
                          className="flex-1"
                        />
                        <span className="w-8 text-center font-medium">{value}</span>
                      </div>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description (Optional)</Label>
                  <Textarea id="description" {...form.register("description")} placeholder="Describe how you feel, when it started, etc." />
                </div>
                <Button type="submit" className="w-full md:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" /> Log Symptom
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><BarChart className="h-5 w-5 text-primary" /> Symptom Overview</CardTitle>
            <CardDescription>A summary of your logged symptoms and their average intensities.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Loading symptoms...</p>
            ) : symptoms.length > 0 ? (
              <ChartContainer config={chartConfigCustom} className="min-h-[200px] w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={aggregatedSymptoms} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis domain={[0, 10]} allowDataOverflow={true} tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="averageIntensity" radius={4} fill="var(--color-primary)" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground">No symptom data to display for the chart yet.</p>
            )}
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Logged Symptoms History</CardTitle>
            <CardDescription>Review your previously logged symptoms.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Loading history...</p>
            ) : symptoms.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Intensity</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {symptoms.map(symptom => (
                    <TableRow key={symptom.id}>
                      <TableCell>{symptom.date}</TableCell>
                      <TableCell>{symptom.category}</TableCell>
                      <TableCell>{symptom.intensity}</TableCell>
                      <TableCell className="max-w-xs truncate">{symptom.description || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => deleteSymptom(symptom.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <ActivitySquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">You haven't logged any symptoms yet.</p>
                <Button onClick={() => setShowForm(true)} variant="link" className="mt-2">Log your first symptom</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
