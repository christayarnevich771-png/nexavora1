"use client";

import * as React from "react";
import Image from "next/image";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Globe,
  SlidersHorizontal,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { worldwideReviews, type WorldwideReview } from "@/lib/reviews-data";

export function WorldwideReviewsSection() {
  const [selectedCountry, setSelectedCountry] = React.useState<string>("all");

  const countries = [
    { code: "all", label: "All Worldwide", flag: "🌐" },
    { code: "US", label: "United States", flag: "🇺🇸" },
    { code: "GB", label: "United Kingdom", flag: "🇬🇧" },
    { code: "DE", label: "Germany", flag: "🇩🇪" },
    { code: "CA", label: "Canada", flag: "🇨🇦" },
    { code: "AU", label: "Australia", flag: "🇦🇺" },
    { code: "SG", label: "Singapore", flag: "🇸🇬" },
    { code: "FR", label: "France", flag: "🇫🇷" },
    { code: "JP", label: "Japan", flag: "🇯🇵" },
  ];

  const filteredReviews =
    selectedCountry === "all"
      ? worldwideReviews
      : worldwideReviews.filter((r) => r.countryCode === selectedCountry);

  return (
    <section className="border-b border-border py-16">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              <Globe className="h-4 w-4" />
              <span>Global Client Trust</span>
            </div>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl text-foreground">
              Worldwide Verified Reviews & Escrow Experiences
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              Authentic reviews from verified buyers across 40+ countries. Every reviewer held funds in NEXAVORA
              escrow until digital deliverables were inspected and approved.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground shrink-0">
            <div className="text-right">
              <p className="text-lg font-bold text-foreground flex items-center gap-1 justify-end">
                <Star className="h-4 w-4 fill-brand text-brand" />
                4.98 / 5.0
              </p>
              <p className="text-[11px] text-muted-foreground">From 1,840+ Escrow Trades</p>
            </div>
          </div>
        </div>

        {/* Country Filter Bar */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs text-muted-foreground mr-1 flex items-center gap-1 shrink-0">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filter by Country:
          </span>
          {countries.map((c) => (
            <button
              key={c.code}
              onClick={() => setSelectedCountry(c.code)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors shrink-0 ${
                selectedCountry === c.code
                  ? "bg-brand text-brand-foreground shadow-sm"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 transition-all hover:border-brand/40 hover:shadow-md"
            >
              <div>
                {/* User info bar with real portrait */}
                <div className="flex items-start gap-3.5">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-border">
                    <Image
                      src={rev.avatarUrl}
                      alt={rev.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-sm font-semibold text-foreground truncate">
                        {rev.name}
                      </h3>
                      <span className="text-sm" title={rev.country}>
                        {rev.flagEmoji}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground truncate">
                      {rev.role} {rev.company ? `· ${rev.company}` : ""}
                    </p>

                    <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <ShieldCheck className="h-3 w-3" /> Verified Buyer
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">{rev.country}</span>
                    </div>
                  </div>
                </div>

                {/* Star rating & order details */}
                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < Math.floor(rev.rating)
                            ? "fill-brand text-brand"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                    <span className="ml-1 font-mono font-bold text-foreground">
                      {rev.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">{rev.date}</span>
                </div>

                {/* Testimonial Quote */}
                <p className="mt-3.5 text-xs text-muted-foreground leading-relaxed italic">
                  &ldquo;{rev.testimonial}&rdquo;
                </p>
              </div>

              {/* Order Footer & Escrow Verification */}
              <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-[11px]">
                <div className="truncate max-w-[170px]">
                  <span className="text-muted-foreground block text-[10px] uppercase">Purchased</span>
                  <span className="font-medium text-foreground truncate block">
                    {rev.orderType}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-foreground block">
                    {rev.amount}
                  </span>
                  <span className="text-emerald-400 font-mono text-[10px] flex items-center justify-end gap-0.5">
                    <CheckCircle2 className="h-2.5 w-2.5" /> {rev.escrowStatus}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Summary Note */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          Showing verified international reviews logged on the immutable order timeline.
        </div>
      </div>
    </section>
  );
}
