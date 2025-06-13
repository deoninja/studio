
"use client";

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, UserCircle, BriefcaseMedical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  sender: 'user' | 'provider';
  text: string;
  timestamp: string;
  avatar: string;
  name: string;
}

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage?: string;
  unreadCount?: number;
}

const dummyContacts: Contact[] = [
  { id: 'dr_smith', name: 'Dr. Emily Smith', role: 'Oncologist', avatar: 'https://placehold.co/100x100.png?text=DS', lastMessage: "How are you feeling today?", unreadCount: 1},
  { id: 'nurse_jones', name: 'Nurse David Jones', role: 'Care Nurse', avatar: 'https://placehold.co/100x100.png?text=NJ', lastMessage: "Just checking in on your symptoms." },
];

const initialMessages: { [contactId: string]: Message[] } = {
  dr_smith: [
    { id: '1', sender: 'provider', text: "Hello! How are you feeling today?", timestamp: "10:00 AM", avatar: 'https://placehold.co/100x100.png?text=DS', name: 'Dr. Smith' },
    { id: '2', sender: 'user', text: "I'm doing okay, a bit tired.", timestamp: "10:05 AM", avatar: 'https://placehold.co/100x100.png?text=U', name: 'You' },
  ],
  nurse_jones: [
     { id: '3', sender: 'provider', text: "Hi there, just checking in on your symptoms. Any changes?", timestamp: "11:00 AM", avatar: 'https://placehold.co/100x100.png?text=NJ', name: 'Nurse Jones' },
  ]
};


export default function MessagesPage() {
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(dummyContacts[0]);
  const [messages, setMessages] = React.useState<Message[]>(initialMessages[dummyContacts[0].id] || []);
  const [newMessage, setNewMessage] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setMessages(initialMessages[contact.id] || []);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedContact) return;
    const message: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: 'https://placehold.co/100x100.png?text=U',
      name: 'You'
    };
    
    // Simulate adding message to the global store and updating for the contact
    initialMessages[selectedContact.id] = [...(initialMessages[selectedContact.id] || []), message];
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  return (
    <AppLayout>
      <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-5rem)] flex flex-col md:flex-row gap-4">
        <Card className="w-full md:w-1/3 lg:w-1/4 flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Contacts</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full">
              {dummyContacts.map(contact => (
                <Button
                  key={contact.id}
                  variant={selectedContact?.id === contact.id ? "secondary" : "ghost"}
                  className="w-full justify-start h-auto p-3 rounded-none"
                  onClick={() => handleSelectContact(contact)}
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={contact.avatar} alt={contact.name} data-ai-hint="person portrait" />
                    <AvatarFallback>{contact.name.substring(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.role}</p>
                    {contact.lastMessage && <p className="text-xs text-muted-foreground truncate max-w-[150px]">{contact.lastMessage}</p>}
                  </div>
                  {contact.unreadCount && contact.unreadCount > 0 && (
                    <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {contact.unreadCount}
                    </span>
                  )}
                </Button>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="w-full md:w-2/3 lg:w-3/4 flex flex-col">
          {selectedContact ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                     <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} data-ai-hint="doctor nurse" />
                     <AvatarFallback>{selectedContact.name.substring(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="font-headline text-lg">{selectedContact.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{selectedContact.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[calc(100vh-20rem)] md:h-[calc(100vh-15rem)] p-4 space-y-4">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex items-end gap-2",
                        msg.sender === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      {msg.sender === 'provider' && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={msg.avatar} alt={msg.name} data-ai-hint="doctor headshot" />
                          <AvatarFallback>{msg.name.substring(0,1)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "max-w-[70%] rounded-lg px-3 py-2 shadow-sm",
                          msg.sender === 'user' ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className={cn(
                            "text-xs mt-1",
                            msg.sender === 'user' ? "text-primary-foreground/70 text-right" : "text-muted-foreground/70 text-left"
                          )}>{msg.timestamp}</p>
                      </div>
                       {msg.sender === 'user' && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={msg.avatar} alt={msg.name} data-ai-hint="person anonymous" />
                          <AvatarFallback><UserCircle className="h-5 w-5"/></AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                    autoComplete="off"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-5 w-5" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </CardFooter>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-full">
              <BriefcaseMedical className="h-24 w-24 text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground font-headline">Select a contact to start messaging.</p>
              <p className="text-sm text-muted-foreground">Your conversations will appear here.</p>
            </CardContent>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
