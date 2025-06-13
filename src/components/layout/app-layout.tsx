
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
  // SidebarInset was removed from sidebar.tsx exports, ensure it's not used or correctly re-added if necessary
  // For now, assuming SidebarInset is part of the main layout structure if needed, or handled by CSS.
  // If SidebarInset itself is a component, it needs to be imported.
  // Based on the current structure, SidebarInset seems to be a styling class for the main content area.
} from '@/components/ui/sidebar'; 
import { Button, buttonVariants } from '@/components/ui/button'; // Import buttonVariants
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
  PanelLeft, // Import PanelLeft if SidebarTrigger's default icon is needed elsewhere or if we revert
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
                          "w-full justify-start gap-2",
                          "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          pathname === item.href && "bg-sidebar-primary text-sidebar-primary-foreground"
                        )}
                      >
                        <span className="flex items-center gap-2"> {/* Single child for Link */}
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
                          "w-full justify-start gap-2",
                          "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          pathname === item.href && "bg-sidebar-primary text-sidebar-primary-foreground"
                        )}
                      >
                        <span className="flex items-center gap-2"> {/* Single child for Link */}
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
      {/* Ensure SidebarInset is correctly used - it's a div wrapper for main content */}
      <div className={cn(
        "group/sidebar-inset-wrapper flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)] md:peer-data-[variant=inset]:ml-[calc(var(--sidebar-width)_+_theme(spacing.2)_+2px)] md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow"
        // The class 'peer-data-[variant=inset]:ml-0' was removed as it conflicts with collapsed state adjustment
        // Using a specific class for the inset area that the sidebar can influence
      )}>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4 md:hidden">
          <SidebarTrigger asChild>
            <button 
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "h-7 w-7" // Explicitly setting size for the mobile trigger
              )}
            >
              <HeartPulse className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </button>
          </SidebarTrigger>
          <Link href="/" className="flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-primary" />
            <span className="text-lg font-headline font-semibold text-primary">OncoAssist</span>
          </Link>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
