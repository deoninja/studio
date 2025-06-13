
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button, buttonVariants } from '@/components/ui/button'; // Added Button here
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ActivitySquare,
  BellRing,
  MessageCircle,
  BookOpenText,
  NotebookPen,
  HeartPulse,
  Users,
  LogOut,
  Settings,
  PanelLeft,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

const mainNavItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: <LayoutDashboard /> },
  { href: '/symptoms', label: 'Symptom Tracker', icon: <ActivitySquare /> },
  { href: '/reminders', label: 'Reminders', icon: <BellRing /> },
  { href: '/messages', label: 'Messages', icon: <MessageCircle /> },
  { href: '/education', label: 'Education', icon: <BookOpenText /> },
  { href: '/journal', label: 'Mood Journal', icon: <NotebookPen /> },
];

const secondaryNavItems: NavItem[] = [
 { href: '/profile', label: 'Profile', icon: <Users /> },
 { href: '/settings', label: 'Settings', icon: <Settings /> },
];


export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <HeartPulse className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-headline font-semibold text-primary">OncoAssist</h1>
          </Link>
        </SidebarHeader>
        <ScrollArea className="flex-1">
          <SidebarContent className="py-2">
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          buttonVariants({
                            variant: pathname === item.href ? 'default' : 'ghost',
                            size: 'default',
                          }),
                          "w-full justify-start",
                          "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                           pathname === item.href && "bg-sidebar-primary text-sidebar-primary-foreground"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          {item.icon}
                          <span className="truncate">{item.label}</span>
                        </span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-card text-card-foreground border">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <Separator className="my-4" />
             <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                   <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                         className={cn(
                          buttonVariants({
                            variant: pathname === item.href ? 'default' : 'ghost',
                            size: 'default',
                          }),
                          "w-full justify-start",
                          "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                           pathname === item.href && "bg-sidebar-primary text-sidebar-primary-foreground"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          {item.icon}
                          <span className="truncate">{item.label}</span>
                        </span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-card text-card-foreground border">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </ScrollArea>
        <SidebarFooter className="p-4">
          <Button variant="outline" className="w-full justify-start gap-2">
            <LogOut />
            Log Out
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4 md:hidden">
          <SidebarTrigger
            variant="outline"
            size="icon"
            className="h-7 w-7"
          />
          <Link href="/" className="flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-primary" />
            <span className="text-lg font-headline font-semibold text-primary">OncoAssist</span>
          </Link>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
