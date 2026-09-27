"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  Send,
  Search,
  ShieldCheck,
  Lock,
  MoreVertical,
  Paperclip,
  CheckCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { logActivityEvent } from "@/lib/activity-store";

type Message = {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
};

type Conversation = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  verified: boolean;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: Message[];
};

const initialConversations: Conversation[] = [
  {
    id: "conv-1",
    name: "Marlowe Studio",
    role: "Seller · Brand Identity",
    avatar: "MS",
    verified: true,
    lastMessage: "I've started drafting the second round of logomarks.",
    lastTime: "10:45 AM",
    unread: 1,
    messages: [
      {
        id: "m1",
        sender: "them",
        text: "Hi! Thanks for starting the order. Could you share your brand brief and color preferences?",
        time: "Yesterday, 3:15 PM",
      },
      {
        id: "m2",
        sender: "me",
        text: "Sure! We are looking for a sleek, dark-mode focused aesthetic with vibrant crimson accent highlights.",
        time: "Yesterday, 3:40 PM",
      },
      {
        id: "m3",
        sender: "them",
        text: "Got it! I've started drafting the second round of logomarks.",
        time: "10:45 AM",
      },
    ],
  },
  {
    id: "conv-2",
    name: "Castellan UI",
    role: "Seller · React Component Library",
    avatar: "CU",
    verified: true,
    lastMessage: "All components have been sent over with the Figma link.",
    lastTime: "Sep 25",
    unread: 0,
    messages: [
      {
        id: "m201",
        sender: "them",
        text: "All components have been sent over with the Figma link.",
        time: "Sep 25, 4:20 PM",
      },
    ],
  },
  {
    id: "conv-3",
    name: "NEXAVORA Support",
    role: "Platform Moderator",
    avatar: "NX",
    verified: true,
    lastMessage: "Welcome to NEXAVORA! Let us know if you need assistance with escrow deposits.",
    lastTime: "Sep 24",
    unread: 0,
    messages: [
      {
        id: "m301",
        sender: "them",
        text: "Welcome to NEXAVORA! Let us know if you need assistance with escrow deposits or dispute settlement.",
        time: "Sep 24, 11:00 AM",
      },
    ],
  },
];

export default function MessagesPage() {
  return (
    <React.Suspense fallback={<div className="container py-12 text-center text-sm text-muted-foreground">Loading encrypted inbox...</div>}>
      <MessagesContent />
    </React.Suspense>
  );
}

function MessagesContent() {
  const searchParams = useSearchParams();
  const recipientParam = searchParams.get("recipient");

  const [conversations, setConversations] =
    React.useState<Conversation[]>(initialConversations);
  const [selectedId, setSelectedId] = React.useState<string>("conv-1");
  const [inputMessage, setInputMessage] = React.useState("");

  React.useEffect(() => {
    if (recipientParam) {
      const existing = conversations.find(
        (c) => c.name.toLowerCase() === recipientParam.toLowerCase()
      );
      if (existing) {
        setSelectedId(existing.id);
      } else {
        const newConv: Conversation = {
          id: `conv-${Date.now()}`,
          name: recipientParam,
          role: "Seller",
          avatar: recipientParam.slice(0, 2).toUpperCase(),
          verified: true,
          lastMessage: "Conversation started.",
          lastTime: "Just now",
          unread: 0,
          messages: [
            {
              id: `m-${Date.now()}`,
              sender: "them",
              text: `Hello! I see you're interested in my services on NEXAVORA. How can I help you today?`,
              time: "Just now",
            },
          ],
        };
        setConversations((prev) => [newConv, ...prev]);
        setSelectedId(newConv.id);
      }
    }
  }, [recipientParam]);

  const activeConv =
    conversations.find((c) => c.id === selectedId) || conversations[0];

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConv) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "me",
      text: inputMessage,
      time: "Just now",
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConv.id) {
          return {
            ...c,
            lastMessage: inputMessage,
            lastTime: "Just now",
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    logActivityEvent({
      type: "message",
      title: `Message Sent to ${activeConv.name}`,
      description: `“${inputMessage.slice(0, 100)}${inputMessage.length > 100 ? "..." : ""}”`,
      timestamp: new Date().toISOString(),
      badgeText: "Sent Message",
      badgeVariant: "brand",
      linkHref: `/messages?recipient=${encodeURIComponent(activeConv.name)}`,
      linkText: "Open Chat",
      actor: "You",
    });

    setInputMessage("");
  }

  return (
    <div className="container py-8 max-w-6xl">
      <div className="grid h-[750px] overflow-hidden rounded-xl border border-border bg-card md:grid-cols-[320px_1fr]">
        {/* Left: Conversations list */}
        <div className="flex flex-col border-r border-border bg-card/60">
          <div className="border-b border-border p-4">
            <h1 className="font-display text-xl mb-3">Encrypted Inbox</h1>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search conversations…"
                className="h-8 pl-8 text-xs bg-background"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/60">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`flex w-full items-start gap-3 p-3.5 text-left transition-colors hover:bg-secondary/60 ${
                  conv.id === activeConv.id ? "bg-secondary" : ""
                }`}
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-brand/15 text-brand text-xs font-semibold">
                    {conv.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-foreground truncate max-w-[130px]">
                        {conv.name}
                      </span>
                      {conv.verified && (
                        <ShieldCheck className="h-3 w-3 text-brand shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {conv.lastTime}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground truncate">
                    {conv.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Message Stream & Send form */}
        <div className="flex flex-col bg-background/50">
          {/* Active Conversation Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-3.5 bg-card/40">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-brand/15 text-brand text-xs font-semibold">
                  {activeConv.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-semibold">{activeConv.name}</h2>
                  {activeConv.verified && (
                    <ShieldCheck className="h-3.5 w-3.5 text-brand" />
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">{activeConv.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/70 px-2.5 py-1 rounded-full">
                <Lock className="h-3 w-3 text-brand" />
                <span>Escrow Secured Chat</span>
              </div>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activeConv.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "me" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.sender === "me"
                      ? "bg-brand text-brand-foreground rounded-br-none"
                      : "bg-card border border-border text-foreground rounded-bl-none"
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground px-1">
                  <span>{msg.time}</span>
                  {msg.sender === "me" && (
                    <CheckCheck className="h-3 w-3 text-brand" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Box */}
          <div className="border-t border-border p-4 bg-card/40">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Message ${activeConv.name}…`}
                className="flex-1 bg-background"
              />
              <Button type="submit" variant="brand" size="icon" aria-label="Send message">
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="mt-2 text-[10px] text-center text-muted-foreground">
              Never share private recovery keys or transact outside NEXAVORA to retain escrow dispute protection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
