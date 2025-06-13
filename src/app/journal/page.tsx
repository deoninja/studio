
"use client";

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Smile, Frown, Meh, Angry, CircleDot, PlusCircle, Trash2, Edit3, NotebookPen } from 'lucide-react'; // CircleDot for Neutral
import { cn } from '@/lib/utils';
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

type Mood = "happy" | "sad" | "anxious" | "angry" | "neutral";

interface MoodOption {
  name: Mood;
  emoji: string; // Using string for emoji characters
  icon: React.ReactElement;
  colorClass: string;
}

const moodOptions: MoodOption[] = [
  { name: "happy", emoji: "😊", icon: <Smile className="h-5 w-5" />, colorClass: "text-green-500" },
  { name: "sad", emoji: "😢", icon: <Frown className="h-5 w-5" />, colorClass: "text-blue-500" },
  { name: "anxious", emoji: "😟", icon: <Meh className="h-5 w-5" />, colorClass: "text-yellow-500" },
  { name: "angry", emoji: "😠", icon: <Angry className="h-5 w-5" />, colorClass: "text-red-500" },
  { name: "neutral", emoji: "😐", icon: <CircleDot className="h-5 w-5" />, colorClass: "text-gray-500" },
];

const journalEntrySchema = z.object({
  mood: z.custom<Mood>(val => moodOptions.some(m => m.name === val), "Please select a mood"),
  text: z.string().min(1, "Journal entry cannot be empty"),
  date: z.string().optional(),
  id: z.string().optional()
});

type JournalEntryValues = z.infer<typeof journalEntrySchema>;

export default function JournalPage() {
  const { toast } = useToast();
  const [entries, setEntries] = React.useState<JournalEntryValues[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [editingEntry, setEditingEntry] = React.useState<JournalEntryValues | null>(null);

  const form = useForm<JournalEntryValues>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: {
      mood: "neutral",
      text: "",
    },
  });

  React.useEffect(() => {
    if (editingEntry) {
      form.reset(editingEntry);
      setShowForm(true);
    } else {
      form.reset({ mood: "neutral", text: "" });
    }
  }, [editingEntry, form]);

  const onSubmit = (data: JournalEntryValues) => {
    if (editingEntry) {
      setEntries(prev => prev.map(e => e.id === editingEntry.id ? { ...data, id: editingEntry.id, date: editingEntry.date } : e));
      toast({ title: "Journal Entry Updated" });
    } else {
      const newEntry: JournalEntryValues = {
        ...data,
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      };
      setEntries(prev => [newEntry, ...prev]);
      toast({ title: "Journal Entry Saved", description: `Mood: ${data.mood}` });
    }
    form.reset({ mood: "neutral", text: ""});
    setShowForm(false);
    setEditingEntry(null);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    toast({ title: "Journal Entry Deleted" });
  };

  const getMoodStyling = (moodName: Mood) => {
    return moodOptions.find(m => m.name === moodName) || moodOptions.find(m => m.name === 'neutral')!;
  }


  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-headline tracking-tight">Mood Journal</h1>
          <Button onClick={() => { setShowForm(!showForm); setEditingEntry(null); form.reset({ mood: "neutral", text: ""}); }} variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> {showForm ? 'Cancel' : 'New Entry'}
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">{editingEntry ? "Edit" : "New"} Journal Entry</CardTitle>
              <CardDescription>Record your mood and thoughts for today.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">How are you feeling?</label>
                  <div className="flex flex-wrap gap-2">
                    {moodOptions.map(moodOpt => (
                      <Button
                        key={moodOpt.name}
                        type="button"
                        variant={form.watch("mood") === moodOpt.name ? "default" : "outline"}
                        onClick={() => form.setValue("mood", moodOpt.name, { shouldValidate: true })}
                        className={cn("flex items-center gap-2 px-3 py-2 text-sm", form.watch("mood") === moodOpt.name ? '' : moodOpt.colorClass)}
                      >
                        {moodOpt.emoji}
                        <span className="capitalize">{moodOpt.name}</span>
                      </Button>
                    ))}
                  </div>
                  {form.formState.errors.mood && <p className="text-sm text-destructive mt-1">{form.formState.errors.mood.message}</p>}
                </div>

                <div>
                  <label htmlFor="journalText" className="block text-sm font-medium mb-1">Your thoughts:</label>
                  <Textarea
                    id="journalText"
                    {...form.register("text")}
                    rows={5}
                    placeholder="Write about your day, feelings, or anything on your mind..."
                  />
                  {form.formState.errors.text && <p className="text-sm text-destructive mt-1">{form.formState.errors.text.message}</p>}
                </div>

                <div className="flex gap-2">
                    <Button type="submit">
                        <PlusCircle className="mr-2 h-4 w-4" /> {editingEntry ? "Update Entry" : "Save Entry"}
                    </Button>
                    {editingEntry && (
                        <Button type="button" variant="outline" onClick={() => {setShowForm(false); setEditingEntry(null);}}>Cancel Edit</Button>
                    )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Past Entries</CardTitle>
            <CardDescription>Review your previous journal entries.</CardDescription>
          </CardHeader>
          <CardContent>
            {entries.length > 0 ? (
              <div className="space-y-4">
                {entries.map(entry => {
                  const moodStyle = getMoodStyling(entry.mood);
                  return (
                    <Card key={entry.id} className="overflow-hidden">
                      <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4", moodStyle.colorClass.replace('text-', 'bg-').replace('-500', '-100 dark:bg-opacity-20'))}>
                        <div className="flex items-center gap-2">
                           <span className={cn("text-2xl", moodStyle.colorClass)}>{moodStyle.emoji}</span>
                          <CardTitle className={cn("text-lg font-semibold capitalize", moodStyle.colorClass)}>{entry.mood}</CardTitle>
                        </div>
                        <p className="text-xs text-muted-foreground">{entry.date}</p>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <p className="text-sm whitespace-pre-wrap">{entry.text}</p>
                      </CardContent>
                      <CardFooter className="bg-muted/50 px-4 py-2 flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setEditingEntry(entry)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this journal entry.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteEntry(entry.id!)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <NotebookPen className="mx-auto h-16 w-16 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">You haven't made any journal entries yet.</p>
                <Button onClick={() => { setShowForm(true); setEditingEntry(null); form.reset({ mood: "neutral", text: ""}); }} variant="link" className="mt-2">Create your first entry</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
