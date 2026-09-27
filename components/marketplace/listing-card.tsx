import Link from "next/link";
import { ShieldCheck, Star } from "lucide-react";

import { cn, formatPrice } from "@/lib/utils";
import type { Listing } from "@/lib/placeholder-data";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listing/${listing.slug}`}
      className="group flex flex-col justify-between rounded-lg border border-border bg-card p-5 transition-colors hover:border-brand/50"
    >
      <div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{listing.category}</span>
          {listing.seller.verified && (
            <span className="flex items-center gap-1 font-mono text-[10px] text-brand">
              <ShieldCheck className="h-3 w-3" /> KYC Verified
            </span>
          )}
        </div>
        <h3 className="mt-1.5 font-display text-base leading-snug group-hover:text-brand transition-colors">
          {listing.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{listing.blurb}</p>
      </div>

      <div className="mt-5">
        <div className="ledger-rule" />
        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-sm">
              <span className={cn(listing.seller.verified && "text-foreground font-medium")}>
                {listing.seller.name}
              </span>
              {listing.seller.verified && (
                <ShieldCheck className="h-3.5 w-3.5 text-brand" aria-label="Verified seller" />
              )}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-brand text-brand" />
              <span>
                {listing.seller.rating.toFixed(1)} ({listing.seller.reviews})
              </span>
              <span className="mx-1">·</span>
              <span>{listing.deliveryTime}</span>
            </div>
          </div>
          <span className="font-mono text-base tabular-nums font-semibold">
            {formatPrice(listing.priceCents, listing.currency)}
          </span>
        </div>
      </div>
    </Link>
  );
}
