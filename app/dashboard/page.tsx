"use client";

import * as React from "react";
import Link from "next/link";
import {
  DollarSign,
  Lock,
  ShoppingBag,
  TrendingUp,
  Plus,
  ArrowRight,
  ShieldCheck,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { listings as placeholderListings } from "@/lib/placeholder-data";
import { RecentActivityFeed } from "@/components/dashboard/recent-activity-feed";

export default function DashboardPage() {
  const myListings = placeholderListings.slice(0, 3);

  return (
    <div className="container py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Overview
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your sales, escrow balances, and active trade listings.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/orders">View Orders</Link>
          </Button>
          <Button variant="brand" asChild>
            <Link href="/create-listing">
              <Plus className="h-4 w-4 mr-1.5" />
              Create Listing
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Earnings</span>
            <DollarSign className="h-4 w-4 text-brand" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-foreground">$1,420.00</p>
          <p className="mt-1 text-[11px] text-emerald-400 font-medium">+18% from last month</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>In Escrow (Locked)</span>
            <Lock className="h-4 w-4 text-warning" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-foreground">$420.00</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Releases upon delivery approval</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Completed Orders</span>
            <ShoppingBag className="h-4 w-4 text-brand" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-foreground">14</p>
          <p className="mt-1 text-[11px] text-muted-foreground">100% 5-star rating</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Active Listings</span>
            <Package className="h-4 w-4 text-brand" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-foreground">3</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Live on marketplace</p>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Left Column: Recent Activity Feed */}
        <div className="space-y-8">
          <RecentActivityFeed maxItems={6} />

          {/* Active Listings section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl">Your Active Listings</h2>
              <Link href="/marketplace" className="text-xs text-brand hover:underline">
                View on Marketplace →
              </Link>
            </div>

            <div className="space-y-3">
              {myListings.map((item) => (
                <div
                  key={item.slug}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/40"
                >
                  <div className="space-y-1">
                    <Badge variant="brand" className="text-[10px] py-0">{item.category}</Badge>
                    <h3 className="font-medium text-sm text-foreground line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.deliveryTime}</p>
                  </div>
                  <div className="text-right pl-4">
                    <p className="font-mono text-base font-semibold">
                      {formatPrice(item.priceCents, item.currency)}
                    </p>
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground mt-1" asChild>
                      <Link href={`/listing/${item.slug}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Links & Deposit Status & Compliance Status */}
        <div className="space-y-6">
          {/* Regulatory & Identity Status Widget */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand">
                Seller Credential
              </span>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400 font-bold border border-emerald-500/20">
                FINCEN COMPLIANT
              </span>
            </div>
            <h3 className="font-display text-base text-foreground">KYC Identity Level 2</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your government identification and biometrics are verified. P2P smart escrow releases and instant withdrawals enabled.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                <Link href="/kyc">
                  <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-brand" />
                  Audit Status
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                <Link href="/certificates">
                  Licenses
                </Link>
              </Button>
            </div>
          </div>

          {/* P2P Escrow Deposit Accounts */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-display text-lg">P2P Escrow Deposit Accounts</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ensure you verify your transaction hash after depositing crypto into escrow.
            </p>
            <div className="space-y-2">
              <div className="rounded-lg bg-secondary/50 p-2.5 text-xs flex justify-between items-center">
                <span>USDT (BEP20)</span>
                <span className="font-mono text-[11px] text-muted-foreground">0xc55b...87aa</span>
              </div>
              <div className="rounded-lg bg-secondary/50 p-2.5 text-xs flex justify-between items-center">
                <span>SOL (Solana)</span>
                <span className="font-mono text-[11px] text-muted-foreground">E9B1...MxYP</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/payment-methods">Full Payment Instructions</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
