"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShieldCheck, Award } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const primaryNav = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/certificates", label: "Licenses" },
  { href: "/kyc", label: "Seller KYC" },
  { href: "/orders", label: "Orders" },
  { href: "/payment-methods", label: "Payment" },
];

type HeaderProfile = {
  username: string;
  display_name: string | null;
  avatar_url: string | null;
};

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = React.useState<HeaderProfile | null>(null);
  const supabase = React.useMemo(() => createClient(), []);

  React.useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      if (data?.user) {
        setUser({ id: data.user.id, email: data.user.email });
        const { data: prof } = await supabase
          .from("profiles")
          .select("username, display_name, avatar_url")
          .eq("id", data.user.id)
          .maybeSingle();
        if (mounted && prof) {
          setProfile(prof);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    }

    void loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (!mounted) return;
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
      if (!session?.user) setProfile(null);
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, [supabase]);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.push("/");
    router.refresh();
  }

  const isSignedIn = Boolean(user);
  const displayName = profile?.display_name || profile?.username || user?.email || "Account";
  const initials =
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "NX";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="container flex h-16 items-center justify-between gap-3">
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-2" aria-label="NEXAVORA home">
            <Logomark />
            <span className="font-display text-lg tracking-tight">NEXAVORA</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1 md:flex">
            {primaryNav.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
                    active && "text-foreground bg-secondary/60"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Search */}
        <div className="hidden flex-1 items-center justify-center px-2 lg:flex max-w-xs">
          <form action="/search" className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              placeholder="Search listings…"
              className="h-8 pl-8 text-xs"
              aria-label="Search"
            />
          </form>
        </div>

        {/* Right Auth & Theme Toggle */}
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <ThemeToggle />
            {isSignedIn ? (
              <UserMenu displayName={displayName} initials={initials} onSignOut={signOut} />
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="h-8 text-xs">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button variant="brand" size="sm" asChild className="h-8 text-xs">
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" aria-label="Open menu">
                <Menu className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <nav className="mt-8 flex flex-col gap-1">
                <DialogClose asChild>
                  <Link
                    href="/kyc"
                    className="rounded-md px-3 py-2 text-sm hover:bg-accent flex items-center gap-2"
                  >
                    <ShieldCheck className="h-4 w-4 text-brand" />
                    <span>Seller KYC Verification</span>
                  </Link>
                </DialogClose>
                <DialogClose asChild>
                  <Link
                    href="/certificates"
                    className="rounded-md px-3 py-2 text-sm hover:bg-accent flex items-center gap-2"
                  >
                    <Award className="h-4 w-4 text-brand" />
                    <span>Official Licenses & Certifications</span>
                  </Link>
                </DialogClose>

                <div className="my-2 h-px bg-border" />

                {primaryNav.map((item) => (
                  <DialogClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm hover:bg-accent",
                        pathname === item.href && "bg-secondary text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  </DialogClose>
                ))}

                <div className="my-2 h-px bg-border" />
                {isSignedIn ? (
                  <>
                    <DialogClose asChild>
                      <Link href="/profile" className="rounded-md px-3 py-2 text-sm hover:bg-accent">
                        Profile
                      </Link>
                    </DialogClose>
                    <DialogClose asChild>
                      <Link href="/dashboard" className="rounded-md px-3 py-2 text-sm hover:bg-accent">
                        Seller Dashboard
                      </Link>
                    </DialogClose>
                    <DialogClose asChild>
                      <button
                        type="button"
                        onClick={signOut}
                        className="rounded-md px-3 py-2 text-left text-sm hover:bg-accent w-full"
                      >
                        Sign out
                      </button>
                    </DialogClose>
                  </>
                ) : (
                  <>
                    <DialogClose asChild>
                      <Link href="/login" className="rounded-md px-3 py-2 text-sm hover:bg-accent">
                        Sign in
                      </Link>
                    </DialogClose>
                    <DialogClose asChild>
                      <Link
                        href="/register"
                        className="rounded-md px-3 py-2 text-sm font-medium text-brand hover:bg-accent"
                      >
                        Register
                      </Link>
                    </DialogClose>
                  </>
                )}
                <div className="mt-4 flex items-center justify-between px-3">
                  <span className="text-xs text-muted-foreground">Appearance</span>
                  <ThemeToggle />
                </div>
              </nav>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}

function UserMenu({
  displayName,
  initials,
  onSignOut,
}: {
  displayName: string;
  initials: string;
  onSignOut: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-8 w-8"
          aria-label={`${displayName} account menu`}
        >
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Seller dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/orders">Orders</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/kyc" className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-brand" /> Seller KYC Portal
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/certificates" className="flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-brand" /> Licenses & Trust
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            void onSignOut();
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Logomark() {
  return (
    <svg width="24" height="24" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path
        d="M13 1.5 24 7.75v10.5L13 24.5 2 18.25V7.75L13 1.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 18.5V7.5L11 18.5V7.5"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 7.5L18.5 18.5L22.5 7.5"
        stroke="hsl(var(--brand))"
        strokeWidth="2.1"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </svg>
  );
}
