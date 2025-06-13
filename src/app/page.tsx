
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ActivitySquare, BellRing, MessageCircle, BookOpenText, NotebookPen, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const quickLinks = [
  { title: 'Log Symptoms', href: '/symptoms', icon: <ActivitySquare className="h-5 w-5" />, description: 'Track your symptoms and side effects.' },
  { title: 'Check Reminders', href: '/reminders', icon: <BellRing className="h-5 w-5" />, description: 'Manage medications and appointments.' },
  { title: 'View Messages', href: '/messages', icon: <MessageCircle className="h-5 w-5" />, description: 'Communicate with your care team.' },
  { title: 'Read Articles', href: '/education', icon: <BookOpenText className="h-5 w-5" />, description: 'Access helpful information.' },
  { title: 'Record Mood', href: '/journal', icon: <NotebookPen className="h-5 w-5" />, description: 'Log your daily mood and thoughts.' },
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-headline tracking-tight text-primary">Welcome to OncoAssist</CardTitle>
            <CardDescription className="text-lg">Your companion for managing cancer care and well-being.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This platform is designed to help you track your health, manage treatments, communicate with your care team, and find emotional support. Explore the features below to get started.
            </p>
            <div className="mt-6 relative h-60 w-full rounded-lg overflow-hidden">
              <Image 
                src="https://placehold.co/1200x400.png" 
                alt="Supportive healthcare" 
                layout="fill" 
                objectFit="cover" 
                data-ai-hint="healthcare support"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
               <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-2xl font-headline">Empowering Your Journey</h2>
                <p className="text-sm">Tools and resources at your fingertips.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => (
            <Card key={link.title} className="hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium font-headline">{link.title}</CardTitle>
                <div className="text-primary">{link.icon}</div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </CardContent>
              <CardFooter>
                <Link href={link.href} passHref legacyBehavior>
                  <Button asChild variant="outline" className="w-full justify-center">
                    <a>
                      <span className="flex items-center justify-center w-full">
                        Go to {link.title.split(' ')[1]}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </a>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Tip of the Day</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Stay hydrated by drinking plenty of water throughout the day, especially during treatment. Small, frequent sips can help if you're feeling nauseous.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
